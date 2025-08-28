from flask import Flask, jsonify
from flask_cors import CORS
import os, json

app = Flask(__name__)
CORS(app)

# Lấy đường dẫn tuyệt đối tới thư mục back-end
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "Data")

def load_json_file(path):
    """Load 1 file JSON từ path"""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def transform_school_data(raw_data):
    """
    Chuyển dữ liệu thô từ file JSON thành dữ liệu phù hợp cho card:
    SchoolCard + MajorCard
    - method = table_title
    - note = ghi chú
    - không gộp các ngành trùng
    """
    school = {
        "school_code": raw_data.get("school_code"),
        "school_name": raw_data.get("school_name"),
        "majors": []
    }

    for table in raw_data.get("tables", []):
        table_title = table.get("table_title", "")
        for row in table.get("data", []):
            name = row.get("Tên ngành")
            subjects = row.get("Tổ hợp môn", "").split("; ")
            score = row.get("Điểm chuẩn")
            note = row.get("Ghi chú")

            # Không gộp ngành trùng, cứ tạo mới mỗi row
            major = {
                "name": name,
                "subjects": subjects,
                "scores": [{"score": score, "method": table_title, "note": note}]
            }

            school["majors"].append(major)

    # Thêm số ngành (số object trong majors)
    school["major_count"] = len(school["majors"])
    return school


def load_all_schools():
    """Load tất cả file JSON trong Data/schools và transform"""
    schools_dir = os.path.join(DATA_DIR, "schools")
    all_schools = []
    for filename in os.listdir(schools_dir):
        if filename.endswith(".json"):
            path = os.path.join(schools_dir, filename)
            raw_data = load_json_file(path)
            school = transform_school_data(raw_data)
            all_schools.append(school)
    return all_schools

# === Routes ===
@app.route("/")
def home():
    return jsonify({"message": "CareerCompass API is running 🚀"})

@app.route("/universities")
def universities():
    """Danh sách các trường + số ngành"""
    schools = load_all_schools()
    # Trả dữ liệu chỉ có info trường cho SchoolCard
    return jsonify([
        {
            "school_code": s["school_code"],
            "school_name": s["school_name"],
            "major_count": s["major_count"]
        } for s in schools
    ])

@app.route("/universities/<school_code>")
def university_detail(school_code):
    """Chi tiết ngành trong 1 trường (MajorCard)"""
    schools = load_all_schools()
    school = next((s for s in schools if s["school_code"] == school_code), None)
    if not school:
        return jsonify({"error": "School not found"}), 404
    return jsonify(school["majors"])

if __name__ == "__main__":
    app.run(debug=True, port=5000)
