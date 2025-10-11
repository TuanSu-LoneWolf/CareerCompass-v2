import { useState, useEffect } from "react";
import { Brain, Target, User } from "lucide-react";

// Page hiển thị kết quả 2 bài test + AI Top 5 ngành nghề
export function TestResultPage() {
  const [mbtiResult, setMbtiResult] = useState(null);
  const [riasecResult, setRiasecResult] = useState(null);
  const [careerSuggestions, setCareerSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lấy kết quả từ localStorage
    const savedMBTI = JSON.parse(localStorage.getItem('mbtiResult'));
    const savedRIASEC = JSON.parse(localStorage.getItem('riasecResult'));
    
    if (savedMBTI) setMbtiResult(savedMBTI);
    if (savedRIASEC) {
      setRiasecResult(savedRIASEC);
      // Tự động gọi API nếu có cả 2 kết quả
      if (savedMBTI) {
        fetchCareerSuggestions(savedRIASEC, savedMBTI);
      }
    }
  }, []);

  const fetchCareerSuggestions = async (riasecData, mbtiData) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5002/api/ai-career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mbti: mbtiData,
          riasec: riasecData,
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

  if (!mbtiResult || !riasecResult) {
    return (
      <div className="p-6 text-center">
        <p>Chưa có kết quả test. Vui lòng làm bài test trước.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Kết Quả Bài Test</h1>

      {/* Kết quả MBTI */}
      <div className="card p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[var(--bg-chart-1)] rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--primary)]">Kết Quả MBTI</h2>
            <p className="text-[var(--muted-foreground)]">Tính cách cá nhân</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Thông tin cơ bản</h3>
            <p><strong>Mã:</strong> {mbtiResult.code}</p>
            <p><strong>Tên:</strong> {mbtiResult.name}</p>
            <p><strong>Mô tả:</strong> {mbtiResult.overview}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Điểm số chi tiết</h3>
            {Object.entries(mbtiResult.scores).map(([dim, score]) => (
              <p key={dim}><strong>{dim}:</strong> {score}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Kết quả RIASEC */}
      <div className="card p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[var(--bg-chart-2)] rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--primary)]">Kết Quả RIASEC</h2>
            <p className="text-[var(--muted-foreground)]">Xu hướng nghề nghiệp</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Mã: {riasecResult.code}</h3>
          <p><strong>Mô tả:</strong> {riasecResult.description}</p>
          
          <h4 className="font-semibold mt-4 mb-2">Điểm số chi tiết:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(riasecResult.scores).map(([type, score]) => (
              <div key={type} className="p-2 bg-[var(--bg)] rounded">
                <strong>{type}:</strong> {score} điểm
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 5 ngành nghề */}
      <div className="card p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[var(--bg-chart-3)] rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--primary)]">Top 5 Ngành Nghề Phù Hợp</h2>
            <p className="text-[var(--muted-foreground)]">Đề xuất từ AI dựa trên kết quả test</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-[var(--muted-foreground)]">Đang phân tích và đề xuất nghề nghiệp...</p>
          </div>
        ) : careerSuggestions ? (
          <div>
            <div className="space-y-3 mb-6">
              {careerSuggestions.career_path.map((career, index) => (
                <div 
                  key={index}
                  className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-lg text-[var(--primary)]">{career}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {careerSuggestions.summary && (
              <div className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-lg">
                <h4 className="font-bold mb-3 text-[var(--primary)]">Tổng quan nghề nghiệp:</h4>
                <p className="text-[var(--muted-foreground)] leading-relaxed">{careerSuggestions.summary}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[var(--muted-foreground)]">Không thể tải đề xuất nghề nghiệp</p>
          </div>
        )}
      </div>
    </div>
  );
}