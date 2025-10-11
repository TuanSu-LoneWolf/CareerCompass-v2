import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import json

app = Flask(__name__)
CORS(app)

# Cấu hình API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("⚠️  Cảnh báo: Không tìm thấy GEMINI_API_KEY")
    
genai.configure(api_key=GEMINI_API_KEY)

def get_ai_suggestion(mbti, riasec):
    """Hàm gọi AI với model gemini-2.0-flash để lấy đề xuất nghề nghiệp"""
    try:
        prompt = f"""
        Bạn là chuyên gia hướng nghiệp. Hãy phân tích tính cách MBTI và xu hướng RIASEC để đề xuất 5 ngành nghề phù hợp nhất.

        THÔNG TIN CÁ NHÂN:
        - MBTI: {mbti.get('code')} - {mbti.get('name')}
        - Mô tả MBTI: {mbti.get('overview', '')}
        - RIASEC: {riasec.get('code')} 
        - Mô tả RIASEC: {riasec.get('description', '')}

        YÊU CẦU:
        1. Phân tích ngắn gọn sự kết hợp giữa MBTI {mbti.get('code')} và RIASEC {riasec.get('code')}
        2. Đề xuất 5 ngành nghề cụ thể, thực tế tại Việt Nam
        3. Mỗi ngành nghề cần có mô tả ngắn về lý do phù hợp
        4. Tổng quan về định hướng nghề nghiệp

        ĐỊNH DẠNG OUTPUT (JSON):
        {{
            "career_path": [
                "Tên ngành 1 - Mô tả ngắn lý do phù hợp",
                "Tên ngành 2 - Mô tả ngắn lý do phù hợp", 
                "Tên ngành 3 - Mô tả ngắn lý do phù hợp",
                "Tên ngành 4 - Mô tả ngắn lý do phù hợp",
                "Tên ngành 5 - Mô tả ngắn lý do phù hợp"
            ],
            "summary": "Phân tích tổng quan về định hướng nghề nghiệp phù hợp"
        }}

        Lưu ý: Chỉ trả về JSON, không thêm bất kỳ text nào khác.
        """
        
        print("🤖 Đang gọi Gemini 1.5 Pro...")
        
        # Sử dụng model gemini-2.0-flash
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        
        ai_text = response.text.strip()
        print("📄 Phản hồi từ AI:", ai_text[:500] + "..." if len(ai_text) > 500 else ai_text)
        
        # Làm sạch response - loại bỏ markdown code blocks
        cleaned_text = ai_text
        if '```json' in cleaned_text:
            cleaned_text = cleaned_text.split('```json')[1].split('```')[0].strip()
        elif '```' in cleaned_text:
            cleaned_text = cleaned_text.split('```')[1].split('```')[0].strip()
        
        # Xử lý trường hợp có text thừa trước/sau JSON
        start_idx = cleaned_text.find('{')
        end_idx = cleaned_text.rfind('}') + 1
        if start_idx != -1 and end_idx != -1:
            cleaned_text = cleaned_text[start_idx:end_idx]
            
        return json.loads(cleaned_text)
        
    except Exception as e:
        print(f"❌ Lỗi khi gọi AI: {e}")
        raise e

@app.route("/api/ai-career", methods=["POST"])
def ai_career():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "No data provided"}), 400
            
        mbti = data.get("mbti", {})
        riasec = data.get("riasec", {})

        print("📩 Nhận MBTI:", mbti.get('code', 'Unknown'))
        print("📩 Nhận RIASEC:", riasec.get('code', 'Unknown'))

        if not mbti or not riasec:
            return jsonify({"status": "error", "message": "Missing MBTI or RIASEC data"}), 400

        # Gọi AI để lấy đề xuất
        suggestion = get_ai_suggestion(mbti, riasec)

        return jsonify({
            "status": "success",
            "suggestion": suggestion
        })

    except json.JSONDecodeError as e:
        print("❌ Lỗi parse JSON từ AI:", e)
        # Fallback với phân tích chi tiết
        fallback = generate_detailed_fallback(mbti, riasec)
        return jsonify({
            "status": "success", 
            "suggestion": fallback
        })
        
    except Exception as e:
        print("❌ Lỗi xử lý:", e)
        # Fallback với phân tích chi tiết
        fallback = generate_detailed_fallback(mbti, riasec)
        return jsonify({
            "status": "success",
            "suggestion": fallback
        })

def generate_detailed_fallback(mbti, riasec):
    """Tạo đề xuất fallback chi tiết dựa trên MBTI và RIASEC"""
    mbti_code = mbti.get('code', '')
    riasec_code = riasec.get('code', '')
    
    # Phân tích chi tiết theo MBTI và RIASEC
    analysis = analyze_personality(mbti_code, riasec_code)
    
    return {
        "career_path": analysis["careers"],
        "summary": analysis["summary"]
    }

def analyze_personality(mbti, riasec):
    """Phân tích tính cách và đề xuất nghề nghiệp chi tiết"""
    
    # Mô tả các nhóm RIASEC
    riasec_descriptions = {
        "R": "Thực tế - thích làm việc với công cụ, máy móc, vật liệu",
        "I": "Nghiên cứu - thích quan sát, học hỏi, điều tra, phân tích", 
        "A": "Nghệ thuật - thích sáng tạo, tự do biểu đạt ý tưởng",
        "S": "Xã hội - thích giảng dạy, giúp đỡ, chữa trị, phục vụ",
        "E": "Quản lý - thích thuyết phục, lãnh đạo, quản lý, kinh doanh",
        "C": "Công chức - thích làm việc với dữ liệu, văn phòng, hệ thống"
    }
    
    # Đề xuất nghề nghiệp theo từng combination
    career_suggestions = {
        "ISTP_R": [
            "Kỹ sư cơ khí - Phù hợp với tư duy logic và kỹ năng thực hành",
            "Kỹ thuật viên ô tô - Giỏi giải quyết vấn đề kỹ thuật phức tạp",
            "Lập trình viên hệ thống - Tư duy phân tích và yêu thích công nghệ",
            "Kỹ sư xây dựng - Khả năng quản lý dự án và giải quyết vấn đề thực tế",
            "Chuyên gia an ninh mạng - Phân tích rủi ro và bảo mật hệ thống"
        ],
        "ISTP_I": [
            "Nhà nghiên cứu khoa học - Tư duy phân tích và yêu thích khám phá",
            "Kỹ sư phần mềm - Giải quyết vấn đề logic và sáng tạo",
            "Kỹ thuật viên phòng thí nghiệm - Tỉ mỉ và chính xác trong công việc",
            "Chuyên gia phân tích dữ liệu - Khả năng xử lý thông tin phức tạp",
            "Kỹ sư điện tử - Yêu thích công nghệ và kỹ thuật"
        ],
        "ISTP_A": [
            "Thiết kế công nghiệp - Kết hợp sáng tạo và kỹ thuật",
            "Nhiếp ảnh gia kỹ thuật - Đam mê công nghệ và nghệ thuật",
            "Biên tập video - Kỹ năng kỹ thuật và cảm quan nghệ thuật",
            "Nhà thiết kế game - Sáng tạo trong môi trường kỹ thuật",
            "Kiến trúc sư - Kết hợp thẩm mỹ và kỹ thuật xây dựng"
        ],
        "ISTP_S": [
            "Huấn luyện viên thể thao - Kỹ năng kỹ thuật và hướng dẫn người khác",
            "Kỹ thuật viên y tế - Hỗ trợ chăm sóc sức khỏe với kỹ năng kỹ thuật",
            "Giáo viên kỹ thuật - Truyền đạt kiến thức thực tế",
            "Nhân viên cứu hộ - Bình tĩnh xử lý tình huống khẩn cấp",
            "Chuyên gia đào tạo kỹ năng - Hướng dẫn thực hành hiệu quả"
        ],
        "ISTP_E": [
            "Quản lý dự án kỹ thuật - Kết hợp kỹ năng kỹ thuật và quản lý",
            "Tư vấn công nghệ - Phân tích và đề xuất giải pháp",
            "Chủ doanh nghiệp nhỏ - Độc lập và thực tế trong kinh doanh",
            "Quản lý sản xuất - Tối ưu hóa quy trình và hiệu suất",
            "Đại lý bất động sản kỹ thuật - Hiểu biết về kỹ thuật xây dựng"
        ],
        "ISTP_C": [
            "Quản lý hệ thống thông tin - Tổ chức và vận hành hệ thống",
            "Kỹ sư chất lượng - Đảm bảo tiêu chuẩn và quy trình",
            "Chuyên viên phân tích tài chính - Xử lý dữ liệu phức tạp",
            "Quản lý hậu cần - Tối ưu chuỗi cung ứng",
            "Kỹ thuật viên IT - Bảo trì và vận hành hệ thống"
        ]
    }
    
    # Lấy ký tự đầu của RIASEC code
    riasec_first = riasec[0] if riasec else 'R'
    combination_key = f"{mbti}_{riasec_first}"
    
    # Lấy careers hoặc dùng default
    careers = career_suggestions.get(combination_key, [
        "Quản lý dự án - Kỹ năng tổ chức và giải quyết vấn đề",
        "Phát triển phần mềm - Tư duy logic và sáng tạo",
        "Tư vấn kỹ thuật - Phân tích và đề xuất giải pháp",
        "Quản lý chất lượng - Đảm bảo tiêu chuẩn và hiệu suất",
        "Nghiên cứu và phát triển - Ứng dụng công nghệ mới"
    ])
    
    # Summary dựa trên MBTI và RIASEC
    mbti_descriptions = {
        "ISTP": "Bạn là người thực tế, độc lập, giỏi giải quyết vấn đề và có kỹ năng kỹ thuật tốt.",
        "ESTP": "Bạn năng động, thực tế, giỏi ứng biến và có khả năng giao tiếp tốt.",
        "ISFJ": "Bạn tận tâm, tỉ mỉ, đáng tin cậy và luôn quan tâm đến người khác.",
        "ENFP": "Bạn sáng tạo, nhiệt tình, linh hoạt và có khả năng truyền cảm hứng."
    }
    
    base_summary = mbti_descriptions.get(mbti, "Bạn có tính cách độc đáo với nhiều tiềm năng phát triển.")
    riasec_summary = riasec_descriptions.get(riasec_first, "phù hợp với môi trường làm việc đa dạng")
    
    summary = f"{base_summary} Với xu hướng {riasec_summary}, bạn sẽ phát huy tốt nhất khả năng của mình trong các lĩnh vực đòi hỏi sự kết hợp giữa tư duy phân tích và kỹ năng thực hành."
    
    return {
        "careers": careers,
        "summary": summary
    }

@app.route("/api/health", methods=["GET"])
def health_check():
    """Endpoint kiểm tra server hoạt động"""
    return jsonify({
        "status": "healthy", 
        "message": "Server is running",
        "api_key": "✅ Found" if GEMINI_API_KEY else "❌ Missing",
        "model": "gemini-2.0-flash"
    })

@app.route("/api/test-ai", methods=["GET"])
def test_ai():
    """Endpoint test AI connection"""
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content("Xin chào! Hãy trả lời ngắn gọn: Bạn có hoạt động không?")
        return jsonify({
            "status": "success",
            "message": "AI is working",
            "response": response.text
        })
    except Exception as e:
        return jsonify({
            "status": "error", 
            "message": str(e)
        }), 500

if __name__ == "__main__":
    print("🚀 Khởi động server career AI với Gemini 2.0-flash...")
    print(f"🔑 API Key: {'✅ Found' if GEMINI_API_KEY else '❌ Missing'}")
    print("🎯 Model: gemini-2.0-flash")
    
    app.run(port=5002, debug=True)