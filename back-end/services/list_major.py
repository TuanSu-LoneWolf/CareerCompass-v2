from flask import Flask, jsonify
from flask_cors import CORS
import os, json

app = Flask(__name__)
CORS(app, resources={
    r"/*": {"origins": [
        "https://careercompass-nine.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000"
    ]}
})

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAJORS_DIR = os.path.join(BASE_DIR, "Data", "majors", "2024")

def load_json_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_all_major_groups():
    major_groups = {}
    for filename in os.listdir(MAJORS_DIR):
        if filename.endswith(".json"):
            path = os.path.join(MAJORS_DIR, filename)
            try:
                data = load_json_file(path)
                nhom_nganh = data.get("nhom_nganh")
                danh_sach_nganh = data.get("danh_sach_nganh", [])
                if nhom_nganh:
                    major_groups[nhom_nganh] = danh_sach_nganh
            except Exception as e:
                print(f"[WARN] Bỏ qua file {filename}: {e}")
    return major_groups

all_major_groups = load_all_major_groups()
print(f"[INFO] Đã load {len(all_major_groups)} nhóm ngành.")

# === 1️⃣ View 1: Danh sách nhóm ngành
@app.route("/major-groups")
def get_major_groups():
    return jsonify([
        {"nhom_nganh": nhom}
        for nhom in all_major_groups.keys()
    ])

# === 2️⃣ View 2: Danh sách ngành trong nhóm + tổng số trường
@app.route("/major-groups/<nhom_nganh>")
def get_majors_in_group(nhom_nganh):
    danh_sach = all_major_groups.get(nhom_nganh)
    if not danh_sach:
        return jsonify({"error": "Nhóm ngành không tồn tại"}), 404

    result = []
    for nganh in danh_sach:
        tong = 0
        for truong in nganh.get("data", []):
            tong += len(truong.get("data_school", []))
        result.append({
            "ten_nganh": nganh.get("ten_nganh"),
            "tong_so_truong": tong
        })
    return jsonify({
        "nhom_nganh": nhom_nganh,
        "danh_sach_nganh": result
    })

# === 3️⃣ View 3: Danh sách chi tiết các trường (gom gọn 1 tầng)
@app.route("/majors/<nhom_nganh>/<ten_nganh>")
def get_schools_of_major(nhom_nganh, ten_nganh):
    danh_sach = all_major_groups.get(nhom_nganh)
    if not danh_sach:
        return jsonify({"error": "Nhóm ngành không tồn tại"}), 404

    for nganh in danh_sach:
        if nganh.get("ten_nganh") == ten_nganh:
            truong_list = []
            for truong in nganh.get("data", []):
                ten_truong = truong.get("ten_truong")
                for info in truong.get("data_school", []):
                    truong_list.append({
                        "ten_truong": ten_truong,
                        "ten_nganh": info.get("ten_nganh"),
                        "to_hop_mon": info.get("to_hop_mon"),
                        "diem_chuan_2024": info.get("diem_chuan_2024"),
                        "diem_chuan_2023": info.get("diem_chuan_2023")
                    })
            return jsonify({
                "ten_nganh": ten_nganh,
                "truong": truong_list
            })
    return jsonify({"error": "Ngành không tồn tại trong nhóm ngành"}), 404

@app.route("/")
def home():
    return jsonify({"message": "CareerCompass API is running 🚀"})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
