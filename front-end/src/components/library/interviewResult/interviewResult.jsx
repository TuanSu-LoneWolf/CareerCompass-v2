// components/library/interviewResult/interviewResult.jsx
import { useState, useEffect } from "react";
import { Check, X, Star, Download, Share2, Clock, Target, User, Award, AlertCircle, BookOpen, MessageCircle, Mic } from "lucide-react";
import { Button } from "../../library/buttons/button";

// Import model data
import modelData from "../../../../../back-end/Data/model.json";

export function InterviewResult({ userForm, answers, onRestart, method }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState("ask");

  // Hàm tìm tiêu chí từ model.json dựa trên criterionId
  const findCriteriaFromModel = (criterionId) => {
    const model = modelData.find(m => m.id === selectedModel);
    if (!model) return null;

    for (const criteria of model.criteria) {
      if (criteria.id === criterionId) {
        return criteria;
      }
    }
    return null;
  };

  // Hàm đánh giá câu trả lời dựa trên tiêu chí từ model
  const evaluateAnswerWithModel = (answer, criteria) => {
    const answerText = answer.answer || "";
    
    if (!answerText.trim()) {
      return {
        score: 1,
        level: "Chưa đạt",
        reasoning: "Không có câu trả lời",
        description: criteria?.levels[0]?.description || "Không đáp ứng yêu cầu"
      };
    }

    // Logic đánh giá thông minh hơn dựa trên nội dung
    let score = 1;
    let reasoning = "";
    
    // Phân tích câu trả lời dựa trên độ dài và chất lượng
    const wordCount = answerText.trim().split(/\s+/).length;
    const hasKeywords = checkForKeywords(answerText, criteria);
    
    if (wordCount <= 5) {
      score = 1;
      reasoning = "Câu trả lời quá ngắn, thiếu chi tiết";
    } else if (wordCount <= 15) {
      score = 2;
      reasoning = "Câu trả lời cơ bản, cần phát triển thêm";
    } else if (wordCount <= 40) {
      score = hasKeywords ? 4 : 3;
      reasoning = hasKeywords ? "Câu trả lời chi tiết và có nội dung phù hợp" : "Câu trả lời đầy đủ, có nội dung tốt";
    } else {
      score = 4;
      reasoning = "Câu trả lời chi tiết, trình bày rõ ràng";
    }

    // Tìm mô tả tương ứng với điểm số
    const levelDescription = criteria?.levels[score - 1]?.description || "";

    return {
      score,
      level: criteria?.levels[score - 1]?.level || "Chưa đạt",
      reasoning,
      description: levelDescription
    };
  };

  // Hàm kiểm tra từ khóa trong câu trả lời (có thể tùy chỉnh)
  const checkForKeywords = (answer, criteria) => {
    const positiveKeywords = ["thành công", "hiệu quả", "giải quyết", "cải thiện", "phát triển", "học hỏi", "kinh nghiệm"];
    return positiveKeywords.some(keyword => answer.toLowerCase().includes(keyword));
  };

  // Hàm nhóm các câu trả lời theo criteriaId và tính điểm trung bình
  const groupAnswersByCriteria = (answers) => {
    const grouped = {};
    
    answers.forEach((answer, index) => {
      const criteriaId = answer.criterionId || `criteria_${(index % 10) + 1}`;
      
      if (!grouped[criteriaId]) {
        grouped[criteriaId] = {
          answers: [],
          criteriaName: answer.criteriaName || "Tiêu chí đánh giá",
          criterionId: criteriaId
        };
      }
      
      grouped[criteriaId].answers.push(answer);
    });
    
    return grouped;
  };

  // Tính toán kết quả thực tế dựa trên answers và model.json
  useEffect(() => {
    const calculateRealResults = () => {
      if (!answers || answers.length === 0) {
        return {
          totalScore: 0,
          maxScore: 40,
          scorePercentage: 0,
          passed: false,
          evaluation: "Không có câu trả lời nào được ghi nhận.",
          detailedResults: [],
          strengths: [],
          improvements: ["Cần trả lời đầy đủ các câu hỏi"],
          recommendation: "KHÔNG ĐẠT - Thiếu câu trả lời",
          interviewDuration: "0 phút",
          completedAt: new Date().toLocaleDateString('vi-VN'),
          selectedModel: "ASK"
        };
      }

      // Nhóm câu trả lời theo criteriaId
      const groupedAnswers = groupAnswersByCriteria(answers);
      const detailedResults = [];

      // Đánh giá từng nhóm criteria
      Object.values(groupedAnswers).forEach((group, groupIndex) => {
        const criteriaFromModel = findCriteriaFromModel(group.criterionId);
        
        // Tính điểm trung bình cho nhóm criteria
        let totalGroupScore = 0;
        const groupEvaluations = [];

        group.answers.forEach((answer, answerIndex) => {
          const evaluation = evaluateAnswerWithModel(answer, criteriaFromModel);
          totalGroupScore += evaluation.score;
          groupEvaluations.push({
            ...evaluation,
            question: answer.question,
            userAnswer: answer.answer || "",
            answerIndex: answerIndex
          });
        });

        const averageScore = Math.round(totalGroupScore / group.answers.length);
        const averageEvaluation = groupEvaluations[0]; // Lấy evaluation đầu tiên làm đại diện

        detailedResults.push({
          criteriaId: group.criterionId,
          criteriaName: criteriaFromModel?.name || group.criteriaName,
          score: averageScore,
          maxScore: 4,
          reasoning: `Đánh giá dựa trên ${group.answers.length} câu hỏi`,
          level: criteriaFromModel?.levels[averageScore - 1]?.level || "Chưa đạt",
          description: criteriaFromModel?.levels[averageScore - 1]?.description || "",
          question: group.answers.length > 1 ? `Nhóm ${group.answers.length} câu hỏi` : group.answers[0].question,
          userAnswer: group.answers.map(a => a.answer).join(" | "),
          levels: criteriaFromModel?.levels || [
            { level: "Chưa đạt", description: "Không đạt yêu cầu" },
            { level: "Đạt", description: "Cần cải thiện" },
            { level: "Khá", description: "Đạt yêu cầu" },
            { level: "Tốt", description: "Xuất sắc" }
          ],
          answerCount: group.answers.length,
          groupEvaluations: groupEvaluations
        });
      });

      const totalScore = detailedResults.reduce((sum, result) => sum + result.score, 0);
      const maxScore = detailedResults.length * 4;
      const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      const passed = scorePercentage >= 60;

      // Phân tích điểm mạnh và cần cải thiện
      const strengths = [];
      const improvements = [];

      // Phân tích theo nhóm tiêu chí
      const excellentCriteria = detailedResults.filter(r => r.score === 4);
      const goodCriteria = detailedResults.filter(r => r.score === 3);
      const poorCriteria = detailedResults.filter(r => r.score <= 2);

      // Điểm mạnh
      if (excellentCriteria.length > 0) {
        excellentCriteria.slice(0, 2).forEach(criteria => {
          strengths.push(`${criteria.criteriaName} - ${criteria.description}`);
        });
      }

      if (goodCriteria.length >= detailedResults.length * 0.5) {
        strengths.push("Nhiều kỹ năng đạt yêu cầu");
      }

      if (detailedResults.some(r => r.answerCount > 1 && r.score >= 3)) {
        strengths.push("Khả năng trả lời nhất quán qua nhiều câu hỏi");
      }

      // Điểm cần cải thiện
      if (poorCriteria.length > 0) {
        poorCriteria.slice(0, 2).forEach(criteria => {
          improvements.push(`${criteria.criteriaName} - ${criteria.description}`);
        });
      }

      if (scorePercentage < 70) {
        improvements.push("Cần nâng cao chất lượng câu trả lời");
      }

      if (detailedResults.some(r => r.answerCount > 1 && r.score <= 2)) {
        improvements.push("Cần cải thiện tính nhất quán trong trả lời");
      }

      // Đảm bảo luôn có ít nhất một điểm mạnh và cần cải thiện
      if (strengths.length === 0) {
        if (scorePercentage >= 60) {
          strengths.push("Có nền tảng kiến thức cơ bản");
        } else {
          strengths.push("Đã hoàn thành buổi phỏng vấn");
        }
      }

      if (improvements.length === 0 && scorePercentage < 100) {
        improvements.push("Có thể phát huy tốt hơn nữa");
      }

      const evaluation = passed 
        ? `Ứng viên ${userForm.name} đã ${scorePercentage >= 80 ? 'thể hiện xuất sắc' : scorePercentage >= 70 ? 'thể hiện tốt' : 'đáp ứng yêu cầu'} trong buổi phỏng vấn theo mô hình ${selectedModel.toUpperCase()}.`
        : `Ứng viên ${userForm.name} chưa đáp ứng được yêu cầu của vị trí ${userForm.career}.`;

      return {
        totalScore,
        maxScore,
        scorePercentage: Math.round(scorePercentage),
        passed,
        evaluation,
        detailedResults,
        strengths: strengths.slice(0, 3),
        improvements: improvements.slice(0, 3),
        recommendation: passed ? "ĐỖ - Phù hợp với vị trí công việc" : "TRƯỢT - Cần cải thiện",
        interviewDuration: calculateInterviewDuration(answers.length),
        completedAt: new Date().toLocaleDateString('vi-VN'),
        selectedModel: selectedModel.toUpperCase(),
        totalQuestions: answers.length,
        totalCriteria: detailedResults.length
      };
    };

    const calculateInterviewDuration = (questionCount) => {
      const baseTime = 2;
      const timePerQuestion = 1.5;
      const totalMinutes = baseTime + (questionCount * timePerQuestion);
      return `${Math.round(totalMinutes)} phút`;
    };

    setTimeout(() => {
      const realResults = calculateRealResults();
      setResults(realResults);
      setLoading(false);
    }, 1000);
  }, [answers, userForm.name, userForm.career, selectedModel]);

  // Các hàm helper
  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getPassedColor = (passed) => {
    return passed ? "text-green-500" : "text-red-500";
  };

  const getScoreLevel = (percentage) => {
    if (percentage >= 90) return "Xuất sắc";
    if (percentage >= 80) return "Rất tốt";
    if (percentage >= 70) return "Tốt";
    if (percentage >= 60) return "Khá";
    if (percentage >= 50) return "Trung bình";
    return "Cần cải thiện";
  };

  const getMethodIcon = () => {
    return method === 'chat' ? MessageCircle : Mic;
  };

  const getMethodColor = () => {
    return method === 'chat' ? 'var(--primary)' : 'var(--secondary)';
  };

  const MethodIcon = getMethodIcon();

  // Component Model Selector
  const ModelSelector = () => (
    <div className="card bg-[var(--card)] rounded-[var(--radius)] p-4 mb-6">
      <h3 className="text-lg font-semibold text-[var(--card-foreground)] mb-3">
        Chọn Mô Hình Đánh Giá
      </h3>
      <div className="flex flex-wrap gap-2">
        {modelData.map((model) => (
          <button
            key={model.id}
            onClick={() => setSelectedModel(model.id)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              selectedModel === model.id
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-white border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]'
            }`}
          >
            {model.name}
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-8">
        <div className="card bg-[var(--card)] rounded-[var(--radius)] p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">Đang tổng hợp kết quả...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-8">
        <div className="card bg-[var(--card)] rounded-[var(--radius)] p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)]">Có lỗi xảy ra khi tải kết quả</p>
          <Button
            onClick={onRestart}
            type="primary"
            className="mt-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-8">
      {/* Model Selector */}
      <ModelSelector />

      {/* Header */}
      <div className="text-center mb-8">
        <div className={`w-20 h-20 ${results.passed ? "bg-green-100" : "bg-red-100"} rounded-full flex items-center justify-center mx-auto mb-4`}>
          {results.passed ? (
            <Check className="w-10 h-10 text-green-600" />
          ) : (
            <X className="w-10 h-10 text-red-600" />
          )}
        </div>
        <h1 className="text-3xl font-bold text-[var(--card-foreground)] mb-2">
          Kết Quả Phỏng Vấn - {results.selectedModel}
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Hoàn thành vào {results.completedAt} • {results.interviewDuration} • 
          {results.totalQuestions} câu hỏi • {results.totalCriteria} tiêu chí
        </p>
      </div>

      {/* Overall Result Card */}
      <div className={`card bg-[var(--card)] rounded-[var(--radius)] p-6 mb-6 border-l-4 ${results.passed ? "border-l-green-500" : "border-l-red-500"}`}>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[var(--card-foreground)] mb-2">
              {results.recommendation}
            </h2>
            <p className="text-[var(--muted-foreground)] mb-4">
              {results.evaluation}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--primary)]" />
                <span>{userForm.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[var(--primary)]" />
                <span>{userForm.career}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[var(--primary)]" />
                <span>Mô hình: {results.selectedModel}</span>
              </div>
              <div className="flex items-center gap-2">
                <MethodIcon className="w-4 h-4" style={{ color: getMethodColor() }} />
                <span>{method === 'chat' ? 'Phỏng vấn Chat' : 'Phỏng vấn Giọng nói'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--primary)]" />
                <span>{results.interviewDuration}</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(results.scorePercentage)} mb-2`}>
              {results.scorePercentage}%
            </div>
            <div className="text-[var(--muted-foreground)]">
              {getScoreLevel(results.scorePercentage)}
            </div>
            <div className="text-sm text-[var(--muted-foreground)] mt-1">
              {results.totalScore}/{results.maxScore} điểm
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Score Summary */}
        <div className="card bg-[var(--card)] rounded-[var(--radius)] p-6">
          <h3 className="text-lg font-semibold text-[var(--card-foreground)] mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--primary)]" />
            Tổng Quan Điểm Số
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[var(--muted-foreground)]">Tổng điểm:</span>
              <span className="font-semibold">{results.totalScore}/{results.maxScore}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--muted-foreground)]">Tỷ lệ:</span>
              <span className={`font-semibold ${getScoreColor(results.scorePercentage)}`}>
                {results.scorePercentage}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--muted-foreground)]">Kết quả:</span>
              <span className={`font-semibold ${getPassedColor(results.passed)}`}>
                {results.passed ? "ĐẠT" : "KHÔNG ĐẠT"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--muted-foreground)]">Xếp loại:</span>
              <span className="font-semibold">{getScoreLevel(results.scorePercentage)}</span>
            </div>
          </div>
        </div>

        {/* Strengths */}
        <div className="card bg-[var(--card)] rounded-[var(--radius)] p-6">
          <h3 className="text-lg font-semibold text-[var(--card-foreground)] mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            Điểm Mạnh
          </h3>
          <ul className="space-y-2">
            {results.strengths.map((strength, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="card bg-[var(--card)] rounded-[var(--radius)] p-6">
          <h3 className="text-lg font-semibold text-[var(--card-foreground)] mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Cần Cải Thiện
          </h3>
          <ul className="space-y-2">
            {results.improvements.map((improvement, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed Results với key duy nhất */}
      <div className="card bg-[var(--card)] rounded-[var(--radius)] p-6 mb-6">
        <h3 className="text-xl font-semibold text-[var(--card-foreground)] mb-6">
          Chi Tiết Đánh Giá Theo Tiêu Chí {results.selectedModel}
        </h3>
        <div className="space-y-6">
          {results.detailedResults.map((criteria, index) => (
            <div 
              key={`${criteria.criteriaId}_${index}`}
              className="border-b border-[var(--border)] pb-6 last:border-b-0"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-[var(--card-foreground)]">
                      {criteria.criteriaName}
                    </h4>
                    {criteria.answerCount > 1 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {criteria.answerCount} câu hỏi
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-2">
                    {criteria.reasoning}
                  </p>
                  <p className="text-xs text-[var(--primary)] italic">
                    {criteria.description}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-bold text-[var(--primary)]">
                    {criteria.score}/{criteria.maxScore}
                  </div>
                  <div className={`text-sm font-medium ${
                    criteria.score === 4 ? 'text-green-500' :
                    criteria.score === 3 ? 'text-blue-500' :
                    criteria.score === 2 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {criteria.level}
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-[var(--bg-progress)] rounded-full h-2 mb-2">
                <div 
                  className="h-2 rounded-full bg-[var(--primary)]"
                  style={{ width: `${(criteria.score / criteria.maxScore) * 100}%` }}
                ></div>
              </div>
              
              {/* Levels description từ model */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {criteria.levels.map((level, levelIndex) => (
                  <div 
                    key={levelIndex}
                    className={`p-2 rounded text-center ${
                      levelIndex === criteria.score - 1 
                        ? 'bg-[var(--primary)] text-white' 
                        : 'bg-[var(--bg-subtle)] text-[var(--muted-foreground)]'
                    }`}
                  >
                    <div className="font-medium">{level.level}</div>
                    <div className="truncate text-[10px]">{level.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Answers Review */}
      <div className="card bg-[var(--card)] rounded-[var(--radius)] p-6 mb-6">
        <h3 className="text-xl font-semibold text-[var(--card-foreground)] mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[var(--primary)]" />
          Xem Lại Câu Trả Lời
        </h3>
        <div className="space-y-6">
          {answers.map((answer, index) => (
            <div key={index} className="border-b border-[var(--border)] pb-6 last:border-b-0">
              <h4 className="font-semibold text-[var(--card-foreground)] mb-2">
                Câu hỏi {index + 1}: {answer.question}
              </h4>
              <div className="bg-[var(--bg-subtle)] rounded-lg p-4">
                <p className="text-sm text-[var(--muted-foreground)] mb-1">Câu trả lời của bạn:</p>
                <p className="text-[var(--card-foreground)] whitespace-pre-wrap">{answer.answer || "(Không có câu trả lời)"}</p>
              </div>
              <div className="mt-2 text-sm text-[var(--muted-foreground)]">
                Tiêu chí: {answer.criteriaName} • ID: {answer.criterionId}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          onClick={onRestart}
          type="primary"
          className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-8 py-3"
        >
          Phỏng Vấn Lại
        </Button>
        
        <Button
          type="outline"
          icon={Download}
          className="border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] px-6 py-3"
        >
          Tải PDF
        </Button>
        
        <Button
          type="outline"
          icon={Share2}
          className="border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] px-6 py-3"
        >
          Chia Sẻ
        </Button>
      </div>

      {/* Final Recommendation */}
      {results.passed && (
        <div className="card bg-green-50 border border-green-200 rounded-[var(--radius)] p-6 mt-6 text-center">
          <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h4 className="text-lg font-semibold text-green-800 mb-2">
            Chúc mừng bạn đã vượt qua vòng phỏng vấn!
          </h4>
          <p className="text-green-700">
            Bạn đã thể hiện tốt và phù hợp với vị trí {userForm.career}. 
            Hãy tiếp tục phát huy những điểm mạnh và cải thiện các kỹ năng cần thiết.
          </p>
        </div>
      )}

      {!results.passed && (
        <div className="card bg-yellow-50 border border-yellow-200 rounded-[var(--radius)] p-6 mt-6 text-center">
          <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <h4 className="text-lg font-semibold text-yellow-800 mb-2">
            Cần cải thiện thêm
          </h4>
          <p className="text-yellow-700">
            Bạn chưa đạt yêu cầu cho vị trí {userForm.career}. 
            Hãy ôn luyện thêm và thử lại trong thời gian tới.
          </p>
        </div>
      )}

      {/* Additional Statistics */}
      <div className="card bg-[var(--card)] rounded-[var(--radius)] p-6 mt-6">
        <h3 className="text-lg font-semibold text-[var(--card-foreground)] mb-4">
          Thống Kê Chi Tiết
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[var(--primary)]">{results.totalQuestions}</div>
            <div className="text-sm text-[var(--muted-foreground)]">Tổng câu hỏi</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--primary)]">{results.totalCriteria}</div>
            <div className="text-sm text-[var(--muted-foreground)]">Tiêu chí đánh giá</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">
              {results.detailedResults.filter(r => r.score >= 3).length}
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">Tiêu chí đạt</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-500">
              {results.detailedResults.filter(r => r.score <= 2).length}
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">Cần cải thiện</div>
          </div>
        </div>
      </div>
    </div>
  );
}