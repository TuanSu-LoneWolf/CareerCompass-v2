from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Cho phép React frontend gọi API

@app.route("/api/ai-career", methods=["POST"])
def ai_career():
    try:
        data = request.get_json()  # Nhận JSON từ frontend
        mbti = data.get("mbti", {})
        riasec = data.get("riasec", {})

        print("📩 Nhận MBTI:", mbti)
        print("📩 Nhận RIASEC:", riasec)

        # 👉 Bạn có thể gọi AI ở đây, ví dụ:
        # response = ai_model.generate_career_suggestions(mbti, riasec)

        # Giả sử tạm tạo gợi ý giả để test:
        career_suggestion = {
            "career_path": ["Tâm lý học", "Giáo dục học", "Xã hội học"],
            "summary": f"Với tính cách {mbti.get('name')} ({mbti.get('code')}) và xu hướng {riasec.get('code')}, bạn có xu hướng hướng ngoại, đồng cảm, thích giúp đỡ người khác."
        }

        return jsonify({
            "status": "success",
            "suggestion": career_suggestion
        })

    except Exception as e:
        print("❌ Lỗi xử lý:", e)
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5002, debug=True)
