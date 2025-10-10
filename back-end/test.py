from flask import Flask
from config import Config
import google.generativeai as genai

# 1️⃣ Tạo Flask app
app = Flask(__name__)
app.config.from_object(Config)

print("🔍 Flask Config Test:")
print("   GEMINI_API_KEY:", "Loaded ✅" if Config.GEMINI_API_KEY else "❌ Missing")
print("   ALLOWED_ORIGINS:", Config.ALLOWED_ORIGINS)
print("   ENVIRONMENT:", Config.ENVIRONMENT)

# 2️⃣ Test Gemini
if Config.GEMINI_API_KEY:
    try:
        genai.configure(api_key=Config.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash")
        res = model.generate_content("Xin chào Gemini! Hãy trả lời ngắn gọn.")
        print("✅ Gemini hoạt động ổn:", res.text[:80])
    except Exception as e:
        print("❌ Gemini lỗi:", e)
else:
    print("⚠️ Không tìm thấy GEMINI_API_KEY trong .env")

