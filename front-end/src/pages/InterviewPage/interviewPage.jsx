import { useState, useEffect } from "react";
import { InterviewForm } from "../../components/library/interviewForm/interviewForm";
import { MethodCard } from "../../components/library/cards/card";
import { MessageCircle, Mic, User, Send } from "lucide-react";
import { Button } from "../../components/library/buttons/button";
import careersData from "../../../../front-end/Data/interview/interview.json";
import { Input } from "../../components/library/input/input";
import { VoiceRecorderWithSTT } from "../../components/library/voiceRecorderWithSTT/voiceRecorderWithSTT";
import { InterviewResult } from "../../components/library/interviewResult/interviewResult.jsx";

export function InterviewPage() {
  const [view, setView] = useState("form");
  const [method, setMethod] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [userForm, setUserForm] = useState({});
  const [sessionId, setSessionId] = useState(null);

  // Chat states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  const startInterview = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5005/api/start-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          name: userForm.name || "Tuan", 
          age: 22, 
          job: userForm.career || "Lập trình viên" 
        }),
      });

      const data = await res.json();
      console.log("Server response:", data);
      
      // Lưu sessionId từ response
      if (data.session_id) {
        setSessionId(data.session_id);
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  const benefits = {
    chat: [
      "Có thời gian suy nghĩ",
      "Dễ dàng chỉnh sửa câu trả lời",
      "Phù hợp cho người introverted",
    ],
    voice: [
      "Rèn luyện kỹ năng nói",
      "Mô phỏng thực tế",
      "Phát triển phản xạ trả lời",
    ],
  };

  const options = [
    { key: "hoc-sinh", value: "Học sinh" },
    { key: "sinh-vien", value: "Sinh viên" },
    { key: "nguoi-di-lam", value: "Người đi làm" },
  ];

  // Flatten all questions for current career
  const selectedCareer = careersData.careers.find(
    (c) => c.name === userForm.career
  );

  const allQuestions = selectedCareer
    ? selectedCareer.criteria.flatMap((criterion) =>
        criterion.questions.map((q, i) => ({
          criterionId: criterion.id,
          criterionName: criterion.name,
          question: q,
          questionIndexInCriterion: i,
          totalQuestionsInCriterion: criterion.questions.length,
        }))
      )
    : [];

  // Helper: map question index to criterion index
  const getCurrentCriterionIndex = () => {
    if (!selectedCareer) return 0;
    let qCount = 0;
    for (let i = 0; i < selectedCareer.criteria.length; i++) {
      qCount += selectedCareer.criteria[i].questions.length;
      if (currentQuestionIndex < qCount) return i;
    }
    return selectedCareer.criteria.length - 1;
  };

  const handleSendAnswer = () => {
    if (!currentAnswer.trim()) return;

    const currentQ = allQuestions[currentQuestionIndex];

    const newAnswer = {
      criterionId: currentQ.criterionId,
      criterionName: currentQ.criterionName,
      question: currentQ.question,
      answer: currentAnswer,
    };

    const updatedAnswers = [...answers, newAnswer];

    setAnswers(updatedAnswers);
    setCurrentAnswer("");

    if (currentQuestionIndex + 1 >= allQuestions.length) {
      setView("result");
      console.log("Kết quả phỏng vấn:", updatedAnswers);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:min-h-screen">
      {/* Form */}
      {view === "form" && (
        <div className="pb-30">
          <div className="flex flex-col justify-center items-center max-w-3xl mx-auto">
            <img
              className="block mx-auto w-48 pt-8"
              src="/Logo_CC_tron_co_chu.svg"
            />
            <div className="px-2 sm:px-16 py-4">
              <h1 className="text-2xl text-[var(--card-foreground)] text-center mb-2">
                Chuẩn bị phỏng vấn – Chinh phục nhà tuyển dụng
              </h1>
              <p className="text-[var(--muted-foreground)] text-center mb-4">
                Mô phỏng buổi phỏng vấn thực tế, nhận phản hồi chi tiết và nâng
                cao kỹ năng giao tiếp.
              </p>
            </div>
          </div>
          <InterviewForm
            onSuccess={({ name, option, career, email, phone }) => {
              const selected = options.find((o) => o.key === option);
              setUserForm({
                name,
                option: selected ? selected.value : option,
                career,
                email,
                phone,
              });
              setView("interviewMethods");
            }}
          />
        </div>
      )}

      {/* Choose Method */}
      {view === "interviewMethods" && (
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:min-h-screen">
          <div className="flex flex-col justify-center items-center max-w-3xl mx-auto">
            <img
              className="block mx-auto w-48 pt-8"
              src="/Logo_CC_tron_co_chu.svg"
            />
            <div className="px-2 sm:px-16 py-4">
              <h1 className="text-2xl text-[var(--card-foreground)] text-center mb-2">
                Chọn phương thức phỏng vấn
              </h1>
              <p className="text-[var(--muted-foreground)] text-center mb-4">
                Lựa chọn phương thức phỏng vấn phù hợp với bạn. Cả hai phương
                thức đều sẽ đánh giá khả năng giao tiếp và trả lời câu hỏi của
                bạn.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-8 mb-16">
            <div className="flex flex-wrap justify-center gap-8">
              <MethodCard
                icon={MessageCircle}
                textColor="--primary"
                bgColor="--bg-chart-1"
                title="Phỏng Vấn Bằng Chat"
                subTitle="Trả lời câu hỏi bằng cách nhập văn bản. Phù hợp cho những ai muốn có thời gian suy nghĩ và soạn thảo câu trả lời."
                benefits={benefits.chat}
                isSelected={method === "chat"}
                onClick={() => {
                  setMethod("chat");
                  setIsSelected(true);
                }}
              />
              <MethodCard
                icon={Mic}
                textColor="--secondary"
                bgColor="--bg-chart-4"
                title="Phỏng Vấn Bằng Giọng Nói"
                subTitle="Trả lời câu hỏi bằng cách ghi âm giọng nói. Giúp rèn luyện kỹ năng nói và phản xạ trả lời nhanh."
                benefits={benefits.voice}
                isSelected={method === "voice"}
                onClick={() => {
                  setMethod("voice");
                  setIsSelected(true);
                }}
              />
            </div>
            <div className="flex justify-between">
              <Button
                onClick={() => setView("form")}
                back
                type="outline"
                className="border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)]"
              >
                Quay lại
              </Button>
              <Button
                onClick={() =>
                  isSelected && method
                    ? (setView(method), startInterview())
                    : alert("Vui lòng chọn phương thức phỏng vấn!")
                }
                type="primary"
                start
              >
                Bắt đầu phỏng vấn
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interview */}
      {view === "chat" && (
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:min-h-screen">
          {/* Header */}
          <div className="border border-[var(--border)] bg-[var(--card)] rounded-[var(--radius)] p-4 mt-8 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--bg-chart-1)] rounded-[var(--radius)] flex items-center justify-center">
                <User className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div className="w-full">
                <h2 className="text-[var(--primary)]">{userForm.career}</h2>
                <div className="flex justify-between items-center gap-1 w-full">
                  <p className="text-[var(--muted-foreground)]">
                    Ứng viên: {userForm.name} - {userForm.option}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress by Criterion */}
          {selectedCareer && currentQuestionIndex < allQuestions.length && (
            <div className="flex flex-col gap-2 mb-4">
              <div className="text-[var(--muted-foreground)] flex justify-between">
                <p>Tiêu chí</p>
                <p>
                  {getCurrentCriterionIndex() + 1}/
                  {selectedCareer.criteria.length}
                </p>
              </div>
              <div className="bg-[var(--bg-progress)] w-full h-3 rounded-full">
                <div
                  className="h-3 rounded-full bg-[var(--primary)]"
                  style={{
                    width: `${(
                      ((getCurrentCriterionIndex() + 1) /
                        selectedCareer.criteria.length) *
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Question Card */}
          {allQuestions.length > 0 &&
            currentQuestionIndex < allQuestions.length && (
              <div className="card bg-[var(--card)] w-full rounded-[var(--radius)] mt-4 flex flex-col gap-2 p-6">
                <h4 className="text-[var(--primary)] font-medium">
                  Câu hỏi{" "}
                  {allQuestions[currentQuestionIndex].questionIndexInCriterion +
                    1}
                </h4>
                <p className="mb-2">
                  {allQuestions[currentQuestionIndex].question}
                </p>

                <Input
                  type="textarea"
                  placeholder="Nhập câu trả lời..."
                  variant="primary"
                  rows={5}
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                />

                <div className="flex gap-2 mt-2">
                  {/* Nút gửi câu trả lời */}
                  <Button
                    icon={Send}
                    type="primary"
                    onClick={handleSendAnswer}
                    disabled={!currentAnswer.trim()} // nếu input rỗng => disable
                    className={
                      !currentAnswer.trim()
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  >
                    Gửi câu trả lời
                  </Button>

                  {/* Nút kết thúc phỏng vấn */}
                  <Button
                    type="outline"
                    onClick={() => {
                      setView("result");
                      console.log("Kết quả phỏng vấn:", answers);
                    }}
                    className="border-red-600 text-red-600 hover:text-white hover:bg-red-600"
                  >
                    Kết thúc phỏng vấn
                  </Button>
                </div>
              </div>
            )}
          <Button
            onClick={() => setView("interviewMethods")}
            back
            type="outline"
            className="mt-4 border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)]"
          >
            Quay lại
          </Button>
        </div>
      )}

      {/* Voice Interview Placeholder */}
      {view === "voice" && (
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:min-h-screen">
          {/* Header */}
          <div className="border border-[var(--border)] bg-[var(--card)] rounded-[var(--radius)] p-4 mt-8 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--bg-chart-4)] rounded-[var(--radius)] flex items-center justify-center">
                <User className="w-5 h-5 text-[var(--secondary)]" />
              </div>
              <div className="w-full">
                <h2 className="text-[var(--secondary)]">{userForm.career}</h2>
                <div className="flex justify-between items-center gap-1 w-full">
                  <p className="text-[var(--muted-foreground)]">
                    Ứng viên: {userForm.name} - {userForm.option}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress by Criterion */}
          {selectedCareer && currentQuestionIndex < allQuestions.length && (
            <div className="flex flex-col gap-2 mb-4">
              <div className="text-[var(--muted-foreground)] flex justify-between">
                <p>Tiêu chí</p>
                <p>
                  {getCurrentCriterionIndex() + 1}/
                  {selectedCareer.criteria.length}
                </p>
              </div>
              <div className="bg-[var(--bg-progress)] w-full h-3 rounded-full">
                <div
                  className="h-3 rounded-full bg-[var(--secondary)]"
                  style={{
                    width: `${(
                      ((getCurrentCriterionIndex() + 1) /
                        selectedCareer.criteria.length) *
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Question Card */}
          {allQuestions.length > 0 &&
            currentQuestionIndex < allQuestions.length && (
              <>
                <div className="card bg-[var(--card)] w-full rounded-[var(--radius)] mt-4 flex flex-col gap-2 p-6">
                  <h4 className="text-[var(--secondary)] font-medium">
                    Câu hỏi{" "}
                    {allQuestions[currentQuestionIndex]
                      .questionIndexInCriterion + 1}
                  </h4>
                  <p className="mb-2">
                    {allQuestions[currentQuestionIndex].question}
                  </p>
                </div>
                <div className="card bg-[var(--card)] w-full rounded-[var(--radius)] mt-4 flex flex-col gap-2 p-6">
                  <p className="text-[var(--muted-foreground)]">
                    Ghi âm câu trả lời
                  </p>
                  <VoiceRecorderWithSTT
                    value={currentAnswer}
                    onChange={(text) => setCurrentAnswer(text)}
                  />
                  <p className="text-[var(--muted-foreground)]">
                    Hoặc nhập văn bản trực tiếp:
                  </p>

                  <Input
                    type="textarea"
                    placeholder="Nhập câu trả lời..."
                    variant="secondary"
                    rows={3}
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                  />

                  <div className="flex gap-2 mt-2">
                    {/* Nút gửi câu trả lời */}
                    <Button
                      icon={Send}
                      type="secondary"
                      onClick={handleSendAnswer}
                      disabled={!currentAnswer.trim()} // nếu input rỗng => disable
                      className={`
                      ${
                        !currentAnswer.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                      text-white
                    `}
                    >
                      Gửi câu trả lời
                    </Button>

                    {/* Nút kết thúc phỏng vấn */}
                    <Button
                      type="outline"
                      onClick={() => {
                        setView("result");
                        console.log("Kết quả phỏng vấn:", answers);
                      }}
                      className="border-red-600 text-red-600 hover:text-white hover:bg-red-600"
                    >
                      Kết thúc phỏng vấn
                    </Button>
                  </div>
                </div>
              </>
            )}
          <Button
            onClick={() => setView("interviewMethods")}
            back
            type="outline"
            className="mt-4 border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--secondary)] hover:border-[var(--secondary)]"
          >
            Quay lại
          </Button>
        </div>
      )}

      {/* Result View */}
      {view === "result" && (
        <InterviewResult 
          userForm={userForm}
          answers={answers}
          method={method}
          sessionId={sessionId}
          onRestart={() => {
            setView("interviewMethods");
            setCurrentQuestionIndex(0);
            setAnswers([]);
            setCurrentAnswer("");
            setSessionId(null);
          }}
        />
      )}
    </div>
  );
}