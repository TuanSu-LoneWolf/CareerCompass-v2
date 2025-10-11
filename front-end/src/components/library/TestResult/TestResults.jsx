import { useState } from "react";

export default function TestResults({ mbtiResult, riasecResult }) {
  const [careerSuggestions, setCareerSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCareerSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5002/api/ai-career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mbti: mbtiResult,
          riasec: riasecResult,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setCareerSuggestions(data.suggestion);
      } else {
        console.error("Lỗi từ server:", data.message);
      }
    } catch (error) {
      console.error("Lỗi fetch API:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Kết quả bài test</h2>

      {/* Bảng MBTI */}
      <div style={{ marginTop: "20px" }}>
        <h3>1️⃣ MBTI</h3>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Mã</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{mbtiResult.name}</td>
              <td>{mbtiResult.code}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bảng RIASEC */}
      <div style={{ marginTop: "20px" }}>
        <h3>2️⃣ RIASEC</h3>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Mô tả</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{riasecResult.code}</td>
              <td>{riasecResult.description}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Nút gọi AI */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={fetchCareerSuggestions} disabled={loading}>
          {loading ? "Đang phân tích..." : "Xem Top 5 ngành nghề phù hợp"}
        </button>
      </div>

      {/* Hiển thị kết quả AI */}
      {careerSuggestions && (
        <div style={{ marginTop: "20px" }}>
          <h3>3️⃣ Top 5 ngành nghề phù hợp</h3>
          <ul>
            {careerSuggestions.career_path.map((career, index) => (
              <li key={index}>{career}</li>
            ))}
          </ul>
          <p><strong>Summary:</strong> {careerSuggestions.summary}</p>
        </div>
      )}
    </div>
  );
}