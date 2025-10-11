import os
import re
import sys
import logging
from typing import List, Tuple, Optional, Any
from dataclasses import dataclass
from datetime import datetime
import tempfile
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS

# Add parent directory to path for config/auth imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import config
try:
    from config.config import Config
except ImportError:
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from config.config import Config

import fitz  # PyMuPDF
import google.generativeai as genai
from auth.auth import firebase_required  # Chỉ giữ firebase_required
from auth.rate_limiter import rate_limit
from auth.auth_routes import auth_bp  # Nếu có endpoint xác thực

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class EvaluationResult:
    filename: str
    evaluation: str
    score: Optional[int]
    processing_time: float
    file_size: int
    errors: List[str] = None

    def __post_init__(self):
        if self.errors is None:
            self.errors = []

class SimpleCVEvaluationService:
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS = {'.pdf'}
    MAX_CV_LENGTH = 50000
    
    SUSPICIOUS_PATTERNS = [
        r"lorem ipsum", r"sample text", r"placeholder text",
        r"example content", r"test content", r"dummy text"
    ]
    
    TSHAPE_CRITERIA = """
ĐÁNH GIÁ CV THEO CHUẨN T-SHAPE SKILLS
1. **Chiều sâu (Vertical Skills):** 
- Kiến thức chuyên môn sâu sắc liên quan đến lĩnh vực {industry}.
- Kỹ năng ứng dụng công nghệ hiện đại và công cụ chuyên ngành.
- Kỹ năng đánh giá và đo lường hiệu quả công việc qua các dự án hoặc kết quả thực tế.
2. **Chiều rộng (Horizontal Skills):**
- Kỹ năng truyền đạt, hướng dẫn và đào tạo người khác.
- Kỹ năng tương tác, giao tiếp hiệu quả trong môi trường đa dạng.
- Kỹ năng lập kế hoạch, thiết kế nội dung công việc khoa học.
- Kỹ năng tổ chức, quản lý và điều phối các hoạt động thực tiễn.
- Khả năng thích ứng linh hoạt, hỗ trợ cá nhân hóa theo yêu cầu.
- Tư duy phát triển bản thân, đổi mới sáng tạo không ngừng.
- Tinh thần trách nhiệm và đạo đức nghề nghiệp cao.
**Nhiệm vụ:** Đánh giá chi tiết theo từng nhóm kỹ năng và đưa ra điểm số từ 0-100.
"""

    ATS_CRITERIA = """
ĐÁNH GIÁ CV THEO CHUẨN ATS
1. Từ khóa phù hợp (30%): CV chứa từ khóa liên quan job description
2. Định dạng chuẩn (20%): PDF/DOCX, font đơn giản, tránh thiết kế phức tạp
3. Cấu trúc logic (15%): Thông tin cá nhân, tóm tắt, kinh nghiệm, kỹ năng, học vấn
4. Phù hợp với JD (20%): Kỹ năng và kinh nghiệm match với yêu cầu
5. Không lỗi chính tả (10%): Chính tả và ngữ pháp chính xác
6. Hồ sơ chuyên nghiệp (5%): LinkedIn, GitHub, Portfolio
Tổng điểm từ 0–100 theo chuẩn ATS.
"""
    
    def __init__(self):
        self.gemini_model = self._initialize_gemini()
        
    def _initialize_gemini(self) -> Optional[Any]:
        try:
            if not Config.GEMINI_API_KEY:
                logger.warning("GEMINI_API_KEY not found in environment")
                return None
            genai.configure(api_key=Config.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-2.0-flash")  # Dùng Gemini 2.0
            logger.info("Gemini API configured successfully")
            return model
        except Exception as e:
            logger.error(f"Failed to configure Gemini API: {e}")
            return None
    
    def _extract_pdf_text(self, pdf_path: str) -> str:
        try:
            text = ""
            with fitz.open(pdf_path) as doc:
                for page_num, page in enumerate(doc):
                    try:
                        page_text = page.get_text()
                        if page_text.strip():
                            text += page_text + "\n"
                    except Exception as e:
                        logger.warning(f"Error reading page {page_num} from {pdf_path}: {e}")
                        continue
            text = re.sub(r'\s+', ' ', text).strip()
            if len(text) > self.MAX_CV_LENGTH:
                logger.warning(f"CV text truncated from {len(text)} to {self.MAX_CV_LENGTH} characters")
                text = text[:self.MAX_CV_LENGTH]
            return text
        except Exception as e:
            raise Exception(f"Cannot read PDF file: {str(e)}")
    
    def _validate_file(self, file) -> Tuple[bool, str]:
        if not file or not file.filename:
            return False, "No file provided"
        filename = secure_filename(file.filename)
        if not filename:
            return False, "Invalid filename"
        file_ext = os.path.splitext(filename)[1].lower()
        if file_ext not in self.ALLOWED_EXTENSIONS:
            return False, f"File type not supported. Allowed: {', '.join(self.ALLOWED_EXTENSIONS)}"
        try:
            file.seek(0, 2)
            file_size = file.tell()
            file.seek(0)
            if file_size > self.MAX_FILE_SIZE:
                return False, f"File too large. Max size: {self.MAX_FILE_SIZE // (1024*1024)}MB"
        except:
            pass
        return True, ""
    
    def _simple_plagiarism_check(self, cv_text: str) -> bool:
        cv_text_lower = cv_text.lower()
        for pattern in self.SUSPICIOUS_PATTERNS:
            if re.search(pattern, cv_text_lower):
                logger.warning(f"Suspicious pattern detected: {pattern}")
                return True
        words = cv_text_lower.split()
        if len(words) > 10:
            word_count = {}
            for word in words:
                if len(word) > 3:
                    word_count[word] = word_count.get(word, 0) + 1
            max_occurrences = max(word_count.values()) if word_count else 0
            if max_occurrences > len(words) * 0.05 and max_occurrences > 10:
                logger.warning(f"Excessive repetition detected")
                return True
        return False
    
    def _extract_score(self, evaluation_text: str) -> Optional[int]:
        patterns = [
            r"tổng điểm\s*[:]\s*(\d{1,3})\s*/\s*100",
            r"điểm\s*[:]\s*(\d{1,3})\s*/\s*100",
            r"(\d{1,3})\s*/\s*100",
            r"điểm số\s*[:]\s*(\d{1,3})"
        ]
        for pattern in patterns:
            matches = re.findall(pattern, evaluation_text, re.IGNORECASE)
            for match in matches:
                try:
                    score = int(match)
                    if 0 <= score <= 100:
                        return score
                except:
                    continue
        return None
    
    def _get_criteria_text(self, criteria_option: str, industry: str, custom_criteria: str = "") -> str:
        if criteria_option == 'ats':
            return self.ATS_CRITERIA
        elif criteria_option == 'tshape':
            return self.TSHAPE_CRITERIA.format(industry=industry)
        elif criteria_option == 'custom' and custom_criteria.strip():
            return custom_criteria.strip()
        else:
            return self.ATS_CRITERIA
    
    def _evaluate_with_gemini(self, cv_text: str, criteria_text: str, industry: str, job_description: str = "") -> str:
        if not self.gemini_model:
            return "Lỗi: Gemini API chưa được cấu hình. Vui lòng kiểm tra API key."
        jd_section = ""
        if job_description.strip():
            jd_section = f"""
--- MÔ TẢ CÔNG VIỆC (JD) --- 
{job_description}

Hãy so sánh CV với mô tả công việc này và đánh giá mức độ phù hợp.
"""
        prompt = f"""
Bạn là chuyên gia tuyển dụng chuyên nghiệp. Ngành tuyển dụng: {industry.upper()}.

--- TIÊU CHÍ ĐÁNH GIÁ ---
{criteria_text}

{jd_section}

--- CV ỨNG VIÊN ---
{cv_text}

Hãy thực hiện đánh giá theo các bước:
1. Phân tích kỹ năng và kinh nghiệm nổi bật
2. Đánh giá độ phù hợp với ngành {industry}
3. Phân tích kỹ năng chuyên môn (có ví dụ cụ thể)
4. Đánh giá kỹ năng mềm và khả năng học hỏi
5. {'So sánh với JD và đánh giá mức độ phù hợp' if job_description else ''}
6. Tổng kết điểm mạnh, yếu và khuyến nghị

👉 **Cuối cùng, cho điểm từ 0-100**
Tổng điểm: XX/100
"""
        try:
            response = self.gemini_model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return f"Lỗi khi gọi Gemini API: {str(e)}. Vui lòng thử lại sau."
    
    def evaluate_single_cv(self, file, industry: str, criteria_option: str, custom_criteria: str = "", job_description: str = "") -> EvaluationResult:
        start_time = datetime.now()
        filename = secure_filename(file.filename) if file.filename else "unknown"
        result = EvaluationResult(filename=filename, evaluation="", score=None, processing_time=0.0, file_size=0)
        try:
            is_valid, error_msg = self._validate_file(file)
            if not is_valid:
                result.evaluation = f"Lỗi file: {error_msg}"
                result.errors.append(error_msg)
                return result
            try:
                file.seek(0, 2)
                result.file_size = file.tell()
                file.seek(0)
            except:
                pass
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
                temp_path = temp_file.name
                file.save(temp_path)
            try:
                cv_text = self._extract_pdf_text(temp_path)
                if not cv_text.strip():
                    result.evaluation = "CV trống hoặc không đọc được nội dung."
                    result.errors.append("Empty CV content")
                    return result
                if self._simple_plagiarism_check(cv_text):
                    result.evaluation = "⚠️ Phát hiện nội dung nghi ngờ hoặc lặp lại quá nhiều trong CV."
                    result.score = 0
                    result.errors.append("Suspicious content detected")
                    return result
                criteria_text = self._get_criteria_text(criteria_option, industry, custom_criteria)
                evaluation = self._evaluate_with_gemini(cv_text, criteria_text, industry, job_description)
                result.evaluation = evaluation
                result.score = self._extract_score(evaluation)
            finally:
                try:
                    os.unlink(temp_path)
                except:
                    pass
        except Exception as e:
            logger.error(f"Error evaluating CV {filename}: {e}")
            result.evaluation = f"Lỗi xử lý CV: {str(e)}"
            result.errors.append(str(e))
        finally:
            result.processing_time = (datetime.now() - start_time).total_seconds()
        return result

# Flask App
app = Flask(__name__)
try:
    app.config.from_object(Config)
except:
    logger.warning("Using fallback configuration")

CORS(app, 
     origins=getattr(Config, 'ALLOWED_ORIGINS', ['http://localhost:3000']),
     allow_headers=['Content-Type', 'Authorization'],
     supports_credentials=True)
app.register_blueprint(auth_bp)

cv_service = SimpleCVEvaluationService()

@app.route('/evaluate', methods=['POST'])
# @firebase_required
@rate_limit(limit=10, window=3600, per_user=True)
def evaluate():
    logger.info(f"🔥 request.current_user: {getattr(request, 'current_user', {})}")
    try:
        files = request.files.getlist("cvs")
        if not files or len(files) == 0:
            return jsonify({"error": "Chưa upload file CV nào"}), 400
        if len(files) > 5:
            return jsonify({"error": "Tối đa 5 file CV mỗi lần"}), 400
        industry = request.form.get("industry", "").strip()
        if not industry or len(industry) > 100:
            return jsonify({"error": "Ngành nghề không hợp lệ (tối đa 100 ký tự)"}), 400
        criteria_option = request.form.get("criteria_option", "ats")
        if criteria_option not in ['ats', 'tshape', 'custom']:
            return jsonify({"error": "Tùy chọn tiêu chí không hợp lệ"}), 400
        custom_criteria = request.form.get("custom_criteria", "")
        if criteria_option == 'custom' and len(custom_criteria.strip()) > 5000:
            return jsonify({"error": "Tiêu chí tùy chỉnh quá dài (tối đa 5000 ký tự)"}), 400
        job_description = request.form.get("job_description", "")
        if len(job_description) > 10000:
            return jsonify({"error": "Mô tả công việc quá dài (tối đa 10000 ký tự)"}), 400

        results = []
        for file in files:
            result = cv_service.evaluate_single_cv(file, industry, criteria_option, custom_criteria, job_description)
            results.append({
                "filename": result.filename,
                "evaluation": result.evaluation,
                "score": result.score,
                "processing_time": result.processing_time,
                "file_size": result.file_size,
                "errors": result.errors
            })
        
        return jsonify({
            "results": results,
            "total_processed": len(results),
            "successful": len([r for r in results if not r["errors"]])
        })
        
    except Exception as e:
        logger.error(f"Server error in /evaluate: {e}")
        return jsonify({"error": f"Lỗi server: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "cv-evaluation-simple",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "services": {
            "gemini_api": cv_service.gemini_model is not None,
            "pdf_processing": True,
            "simple_plagiarism": True
        },
        "limits": {
            "max_file_size_mb": SimpleCVEvaluationService.MAX_FILE_SIZE // (1024*1024),
            "max_files_per_request": 5,
            "allowed_extensions": list(SimpleCVEvaluationService.ALLOWED_EXTENSIONS)
        }
    })

@app.route('/status', methods=['GET'])
def status():
    return jsonify({
        "status": "ok",
        "message": "CV Evaluation Service v2.0 - Simple version without premium check"
    })

@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "File too large"}), 413

@app.errorhandler(400)
def bad_request(e):
    return jsonify({"error": "Bad request"}), 400

@app.errorhandler(500)
def internal_error(e):
    logger.error(f"Internal server error: {e}")
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    logger.info("🚀 Starting Simple CV Evaluation Server v2.0...")
    logger.info(f"🤖 Gemini API: {'Configured' if cv_service.gemini_model else 'Not configured'}")
    logger.info("✅ Simple plagiarism detection enabled")
    app.run(debug=True, host='0.0.0.0', port=5000)
