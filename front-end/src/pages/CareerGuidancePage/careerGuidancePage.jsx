import { CareerForm } from "../../components/library/careerForm/careerForm";
import { MBTITest } from "../../components/library/MBTItest/mbtiTest";
import { RIASECTest } from "../../components/library/RIASECtest/riasecTest.jsx";
import { useState } from "react";
import { Button } from "../../components/library/buttons/button.jsx";
import { Target } from "lucide-react";

export function CareerGuidancePage() {
  const [view, setView] = useState("form");
  const [doneMBTI, setDoneMBTI] = useState(false);
  const [mbtiResult, setMbtiResult] = useState(null);

  const handleSendToAI = async (mbti, riasec) => {
    try {
      const response = await fetch("http://localhost:5002/api/ai-career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mbti: {
            code: mbti?.code,
            name: mbti?.name,
            overview: mbti?.overview,
          },
          riasec: {
            code: riasec?.["Mã RIASEC"],
            groups: riasec?.["Tên nhóm"],
            scores: riasec?.["Tổng điểm"],
          },
        }),
      });

      const data = await response.json();
      console.log("✅ Kết quả AI:", data);
    } catch (err) {
      console.error("❌ Lỗi gửi dữ liệu cho AI:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:min-h-screen">
      {view === "form" && (
        <div className="pb-30">
          <div className="flex flex-col justify-center items-center max-w-3xl mx-auto">
            <img
              className="block mx-auto w-48 pt-8"
              src="/Logo_CC_tron_co_chu.svg"
            ></img>
            <div className="px-2 sm:px-16 py-4">
              <h1 className="text-2xl text-[var(--card-foreground)] text-center mb-2">
                Khám phá bản thân – Định hướng tương lai
              </h1>
              <p className="text-[var(--muted-foreground)] text-center mb-4">
                Làm 2 bài trắc nghiệm MBTI & RIASEC để hiểu rõ tính cách, sở
                thích và khám phá ngành nghề phù hợp nhất với bạn.
              </p>
            </div>
          </div>
          <CareerForm
            onSuccess={({ level }) => {
              setView(level === "cap3" ? "testMBTI" : "testRIASEC");
              window.scrollTo({ top: 0, behavior: "smooth" }); // cuộn lên đầu
            }}
          ></CareerForm>
        </div>
      )}

      {view === "testMBTI" && (
        <div className="max-w-3xl mx-auto mb-16">
          <MBTITest
            onFinish={(MBTIResult) => {
              setDoneMBTI(true),
                setMbtiResult(MBTIResult),
                console.log(mbtiResult);
            }}
          />
          {doneMBTI && (
            <div
              onClick={() => {
                setView("testRIASEC"),
                  window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="card border border-[var(--border)] bg-[var(--card)] rounded-[var(--radius)] w-full p-6 flex flex-col gap-3 cursor-pointer"
            >
              <div className="flex flex-col gap-2">
                <h4 className="text-[var(--foreground)]">Tiếp tục khám phá</h4>
                <p className="text-[var(--muted-foreground)]">
                  Thực hiện test RIASEC để tìm hiểu xu hướng nghề nghiệp phù hợp
                  với bạn
                </p>
              </div>
              <Button icon={Target} type="primary" start>
                Bắt đầu test RIASEC
              </Button>
            </div>
          )}
        </div>
      )}

      {view === "testRIASEC" && (
        <div className="max-w-3xl mx-auto">
          <RIASECTest
            onFinish={(RIASECResult) => {
              if (mbtiResult) {
                handleSendToAI(mbtiResult, RIASECResult);
              } else {
                console.warn("⚠️ MBTI chưa có kết quả, chưa gửi AI.");
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
