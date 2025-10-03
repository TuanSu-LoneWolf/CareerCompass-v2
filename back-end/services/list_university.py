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
        content = f.read().strip()
        if not content:
            raise ValueError(f"File JSON rỗng: {path}")
        try:
            return json.loads(content)
        except json.JSONDecodeError as e:
            raise ValueError(f"File JSON không hợp lệ: {path}, lỗi: {e}")

def transform_school_data(raw_data, year):
    school = {
        "school_code": raw_data.get("school_code"),
        "school_name": raw_data.get("school_name"),
        "majors": []
    }

    for table in raw_data.get("tables", []):
        table_title = table.get("table_title", "")
        for row in table.get("data", []):
            name = row.get("Tên ngành")
            subjects = [
                s.strip() for s in row.get("Tổ hợp môn", "").replace(";", ",").split(",")
                if s.strip()
            ]
            score = row.get("Điểm chuẩn")
            note = row.get("Ghi chú")

            major = {
                "name": name,
                "subjects": subjects,
                "scores": [{
                    "year": year,
                    "score": score,
                    "method": table_title,
                    "note": note
                }]
            }
            school["majors"].append(major)

    school["major_count"] = len(school["majors"])
    return school

# ==== Chỉ load metadata (code + name + file paths) ====
def load_school_metadata():
    year_dirs = {
        "2024": os.path.join(DATA_DIR, "schools", "2024"),
        "2025": os.path.join(DATA_DIR, "schools", "2025"),
    }

    schools = {}

    for year, school_dir in year_dirs.items():
        if os.path.exists(school_dir):
            for filename in os.listdir(school_dir):
                if filename.endswith(".json"):
                    path = os.path.join(school_dir, filename)
                    try:
                        raw_data = load_json_file(path)
                    except ValueError:
                        continue

                    code = raw_data.get("school_code")
                    if code not in schools:
                        schools[code] = {
                            "school_code": code,
                            "school_name": raw_data.get("school_name"),
                            "paths": []
                        }
                    schools[code]["paths"].append((year, path))

    return list(schools.values())

# Load metadata 1 lần duy nhất
all_schools_meta = load_school_metadata()
print(f"[INFO] Đã load metadata của {len(all_schools_meta)} trường vào bộ nhớ.")

# === Routes ===
@app.route("/")
def home():
    return jsonify({"message": "CareerCompass API is running 🚀"})

@app.route("/universities")
def universities():
    return jsonify([
        {
            "school_code": s["school_code"],
            "school_name": s["school_name"],
            "year_count": len(s["paths"])  # số năm có dữ liệu
        } for s in all_schools_meta
    ])

@app.route("/universities/<school_code>")
def university_detail(school_code):
    school_meta = next((s for s in all_schools_meta if s["school_code"] == school_code), None)
    if not school_meta:
        return jsonify({"error": "School not found"}), 404

    majors = []
    for year, path in school_meta["paths"]:
        try:
            raw_data = load_json_file(path)
            school_data = transform_school_data(raw_data, year)
            majors.extend(school_data["majors"])
        except ValueError:
            continue

    return jsonify({
        "school_code": school_meta["school_code"],
        "school_name": school_meta["school_name"],
        "majors": majors,
        "major_count": len(majors)
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
