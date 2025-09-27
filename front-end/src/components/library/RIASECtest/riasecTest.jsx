// RIASECTest.jsx
import { useState, useEffect, useRef } from "react";
import { Target, Check, Shuffle } from "lucide-react";
import {
  Hammer,
  FlaskConical,
  Palette,
  Users,
  Briefcase,
  ClipboardList,
} from "lucide-react";

// Map type -> Icon
const riasecIcons = {
  R: Hammer,
  I: FlaskConical,
  A: Palette,
  S: Users,
  E: Briefcase,
  C: ClipboardList,
};

const sizeClass = ["w-10 h-10", "w-8 h-8", "w-7 h-7", "w-8 h-8", "w-10 h-10"];

const riasecQuestions = [
  // Realistic – R
  { id: 1, question: "Tự mua và lắp ráp máy vi tính theo ý mình", type: "R" },
  {
    id: 2,
    question: "Lắp ráp tủ theo hướng dẫn của sách hướng dẫn hoặc trang mạng",
    type: "R",
  },
  {
    id: 3,
    question:
      "Trang điểm cho mình hay cho bạn theo hướng dẫn của sách hướng dẫn hoặc trang mạng",
    type: "R",
  },
  { id: 4, question: "Cắt tỉa cây cảnh", type: "R" },
  {
    id: 5,
    question: "Tháo điện thoại di động hay máy tính ra để tìm hiểu",
    type: "R",
  },
  {
    id: 6,
    question:
      "Tham gia một chuyến du lịch thám hiểm (như khám phá hang động, núi rừng)",
    type: "R",
  },
  { id: 7, question: "Chăm sóc vật nuôi", type: "R" },
  { id: 8, question: "Sửa xe, như xe đạp, xe máy (các lỗi nhỏ)", type: "R" },
  { id: 9, question: "Làm đồ nội thất", type: "R" },
  { id: 10, question: "Lắp ráp máy vi tính", type: "R" },
  { id: 11, question: "Leo núi", type: "R" },
  { id: 12, question: "Đóng gói đồ đạc vào thùng", type: "R" },
  { id: 13, question: "Chơi một môn thể thao", type: "R" },
  {
    id: 14,
    question:
      "Tham gia chuyến đạp xe xuyên quốc gia (từ TPHCM ra Hà Nội, từ Hà Nội vào TPHCM)",
    type: "R",
  },

  // Investigative – I
  { id: 15, question: "Tham quan bảo tàng", type: "I" },
  {
    id: 16,
    question: "Tìm hiểu sự hình thành của các vì sao và vũ trụ",
    type: "I",
  },
  {
    id: 17,
    question: "Tìm hiểu về văn hóa một quốc gia mà mình thích",
    type: "I",
  },
  { id: 18, question: "Tìm hiểu về tâm lý con người", type: "I" },
  {
    id: 19,
    question:
      "Đọc một cuốn sách về tương lai của loài người trong một triệu năm nữa",
    type: "I",
  },
  {
    id: 20,
    question: "Đọc sách, báo hay xem trang tin tức về khoa học",
    type: "I",
  },
  { id: 21, question: "Tìm hiểu về cảm xúc con người", type: "I" },
  { id: 22, question: "Được xem một ca mổ tim", type: "I" },
  {
    id: 23,
    question:
      "Tìm hiểu về nguồn gốc của một dịch bệnh, nguồn gốc của con người,...",
    type: "I",
  },
  {
    id: 24,
    question:
      "Đọc các bài báo về ảnh hưởng của AI (Trí tuệ nhân tạo) lên nghề nghiệp tương lai",
    type: "I",
  },
  {
    id: 25,
    question: "Tìm hiểu về thế giới động vật (qua các kênh tìm hiểu khoa học)",
    type: "I",
  },
  { id: 26, question: "Phát minh xe điện", type: "I" },
  { id: 27, question: "Tiến hành thí nghiệm hóa học", type: "I" },
  { id: 28, question: "Nghiên cứu về chế độ dinh dưỡng", type: "I" },

  // Artistic – A
  {
    id: 29,
    question: "Tạo ra một tác phẩm nghệ thuật, tranh, câu chuyện",
    type: "A",
  },
  { id: 30, question: "Viết truyện ngắn", type: "A" },
  {
    id: 31,
    question:
      "Chứng tỏ năng lực nghệ thuật của bản thân với người khác (nói lên suy nghĩ/quan điểm qua tác phẩm nghệ thuật)",
    type: "A",
  },
  { id: 32, question: "Chơi trong một ban nhạc", type: "A" },
  { id: 33, question: "Chỉnh sửa phim", type: "A" },
  {
    id: 34,
    question: "Thuyết trình hoặc thiết kế, theo ý tưởng của mình",
    type: "A",
  },
  { id: 35, question: "Vẽ phim hoạt hình", type: "A" },
  { id: 36, question: "Hát trong một ban nhạc", type: "A" },
  { id: 37, question: "Biểu diễn nhảy hiện đại", type: "A" },
  { id: 38, question: "Dẫn chương trình (MC) cho một sự kiện", type: "A" },
  {
    id: 39,
    question: "Độc thoại hay kể chuyện trên đài phát thanh/phần mềm",
    type: "A",
  },
  {
    id: 40,
    question: "Viết kịch bản cho phim hoặc chương trình truyền hình",
    type: "A",
  },
  {
    id: 41,
    question:
      "Chụp ảnh cho các sự kiện trong cuộc sống hoặc sự kiện nghệ thuật",
    type: "A",
  },
  {
    id: 42,
    question: "Viết một bài phê bình phim cho bộ phim mình thích/ghét nhất",
    type: "A",
  },

  // Social – S
  { id: 43, question: "Giúp người khác chọn nghề nghiệp phù hợp", type: "S" },
  { id: 44, question: "Kết nối hai người bạn với nhau", type: "S" },
  {
    id: 45,
    question: "Dạy cho bạn mình cách giảm cân qua ăn uống đúng cách",
    type: "S",
  },
  {
    id: 46,
    question: "Tham gia ngày trái đất bằng cách lượm rác hay tắt điện",
    type: "S",
  },
  { id: 47, question: "Hướng dẫn khách nước ngoài chỗ ăn ngon", type: "S" },
  { id: 48, question: "Cứu động vật bị bỏ rơi ngoài đường", type: "S" },
  { id: 49, question: "Tham gia vào một cuộc thảo luận nhóm nhỏ", type: "S" },
  { id: 50, question: "Kể chuyện cười cho bạn bè nghe", type: "S" },
  {
    id: 51,
    question: "Dạy trẻ con chơi một trò chơi hay một môn thể thao",
    type: "S",
  },
  {
    id: 52,
    question: "Lắng nghe bạn bè tâm sự về vấn đề cá nhân của họ",
    type: "S",
  },
  {
    id: 53,
    question: "Giúp bạn bè giải quyết vấn đề liên quan đến tình yêu",
    type: "S",
  },
  { id: 54, question: "Tham gia một chuyến đi từ thiện", type: "S" },
  {
    id: 55,
    question: "Giúp một dự án cộng đồng trong sức của mình",
    type: "S",
  },
  {
    id: 56,
    question: "Sẵn sàng giúp thầy cô, bạn bè khi thấy họ cần",
    type: "S",
  },

  // Enterprising – E
  { id: 57, question: "Tham gia ban đại diện học sinh ở trường", type: "E" },
  { id: 58, question: "Làm cán bộ lớp", type: "E" },
  { id: 59, question: "Bán hàng trực tuyến", type: "E" },
  { id: 60, question: "Quản lý một cửa hàng trực tuyến", type: "E" },
  { id: 61, question: "Học về thị trường chứng khoán", type: "E" },
  { id: 62, question: "Tham gia một khóa học về quản lý tài chính", type: "E" },
  {
    id: 63,
    question:
      "Tham dự một trại huấn luyện kỹ năng lãnh đạo dành cho lứa tuổi thanh thiếu niên",
    type: "E",
  },
  { id: 64, question: "Lập kế hoạch làm việc cho thành viên nhóm", type: "E" },
  { id: 65, question: "Kiếm tiền bằng cách kinh doanh online", type: "E" },
  { id: 66, question: "Nói trước đám đông về một đề tài bạn thích", type: "E" },
  {
    id: 67,
    question: "Tham gia xây dựng các luật lệ mới cho lớp/ trường",
    type: "E",
  },
  { id: 68, question: "Thuyết phục cha mẹ theo ý mình", type: "E" },
  { id: 69, question: "Tổ chức đi chơi cho một nhóm bạn", type: "E" },
  { id: 70, question: "Kiếm tiền bằng cách làm thêm", type: "E" },

  // Conventional – C
  { id: 71, question: "Mở tài khoản tiết kiệm", type: "C" },
  { id: 72, question: "Lập kế hoạch chi tiêu hàng tháng", type: "C" },
  {
    id: 73,
    question: "Chuẩn bị ngân sách cho chuyến đi chơi tập thể lớp",
    type: "C",
  },
  { id: 74, question: "Chuẩn bị cho buổi trình bày trước lớp", type: "C" },
  { id: 75, question: "Lập kế hoạch cho kỳ nghỉ hè/ Tết", type: "C" },
  { id: 76, question: "Đếm và sắp xếp tiền", type: "C" },
  { id: 77, question: "Sắp xếp lại bàn học", type: "C" },
  { id: 78, question: "Viết kế hoạch học tập cho học kỳ mới", type: "C" },
  { id: 79, question: "Hoàn tất bài tập theo đúng hạn được giao", type: "C" },
  {
    id: 80,
    question: "Dò lỗi chính tả trong văn bản hoặc bài viết",
    type: "C",
  },
  {
    id: 81,
    question:
      "Học một khóa vi tính văn phòng và biết cách sắp xếp văn bản, thư mục sao cho chỉn chu",
    type: "C",
  },
  { id: 82, question: "Làm thủ quỹ cho lớp", type: "C" },
  { id: 83, question: "Sắp xếp lại tủ quần áo cá nhân", type: "C" },
  {
    id: 84,
    question:
      "Giúp cha mẹ quản lí tiền chợ của gia đình (mua gì, mua khi nào, mua bao nhiêu)",
    type: "C",
  },
];

const riasecTitles = {
  R: {
    title: "Realistic (Thực tế)",
    subtitle: "Thích hoạt động tay chân, máy móc, công cụ.",
  },
  I: {
    title: "Investigative (Nghiên cứu)",
    subtitle: "Thích tìm tòi, phân tích, giải quyết vấn đề.",
  },
  A: {
    title: "Artistic (Nghệ thuật)",
    subtitle: "Thích sáng tạo, tự do biểu đạt ý tưởng.",
  },
  S: {
    title: "Social (Xã hội)",
    subtitle: "Thích giúp đỡ, làm việc với con người.",
  },
  E: {
    title: "Enterprising (Quản lý, kinh doanh)",
    subtitle: "Thích lãnh đạo, thuyết phục, kinh doanh.",
  },
  C: {
    title: "Conventional (Quy củ, chi tiết)",
    subtitle: "Thích công việc theo quy tắc, dữ liệu, tổ chức.",
  },
};

// màu cho 3 hạng
const rankColors = {
  1: {
    bg: "bg-yellow-400/10",
    text: "text-yellow-400",
    progress: "bg-yellow-400",
  },
  2: { bg: "bg-gray-300/10", text: "text-gray-300", progress: "bg-gray-300" },
  3: {
    bg: "bg-amber-700/10",
    text: "text-amber-700",
    progress: "bg-amber-700",
  },
};

export function RIASECTest({ onFinish }) {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const questionRefs = useRef({}); // ref cho từng câu
  const topRef = useRef(null); // ref cho đầu trang
  const resultRef = useRef(null);

  // Gom nhóm câu hỏi theo type
  const groupedQuestions = ["R", "I", "A", "S", "E", "C"].map((type) => ({
    type,
    title: riasecTitles[type].title,
    subtitle: riasecTitles[type].subtitle,
    questions: riasecQuestions.filter((q) => q.type === type),
  }));

  const totalGroups = groupedQuestions.length;
  const completedGroups = groupedQuestions.filter((g) =>
    g.questions.every((q) => answers[q.id])
  ).length;
  const riasecProgress = Math.round((completedGroups / totalGroups) * 100);

  const handleSelect = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));

    // Scroll xuống câu tiếp theo giống MBTI
    const nextId = qId + 1;
    if (questionRefs.current[nextId]) {
      setTimeout(() => {
        const el = questionRefs.current[nextId];
        const y = el.getBoundingClientRect().top + window.scrollY;
        const offset = 370; // 👈 cùng offset như MBTI
        window.scrollTo({
          top: y - offset,
          behavior: "smooth",
        });
      }, 150);
    }
  };

  const isGroupComplete = () => {
    const group = groupedQuestions[step];
    return group.questions.every((q) => answers[q.id]);
  };

  const handleNext = () => {
    if (step < groupedQuestions.length - 1) {
      setStep(step + 1);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
    } else {
      // ... tính kết quả
      const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
      for (const q of riasecQuestions) {
        const value = answers[q.id];
        if (value) scores[q.type] += value;
      }
      const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      const top3 = sorted.slice(0, 3);
      const code = top3.map(([k]) => k).join("");
      const finalResult = { scores, code, top3 };
      setResult(finalResult);
      if (onFinish) onFinish(finalResult);

      // 👉 sửa chỗ này
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleRandomFill = () => {
    const group = groupedQuestions[step];
    const randomAnswers = {};
    group.questions.forEach((q) => {
      randomAnswers[q.id] = Math.floor(Math.random() * 5) + 1;
    });
    setAnswers((prev) => ({ ...prev, ...randomAnswers }));
  };

  if (result) {
    return (
      <div
        ref={resultRef}
        className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] mt-8 mb-16"
      >
        <h2 className="text-2xl font-bold text-[var(--primary)]">
          Kết quả RIASEC: {result.code}
        </h2>

        {/* Top 3 cards */}
        <div className="grid grid-cols-1 gap-4 mt-6">
          {result.top3.map(([type, score], idx) => {
            const Icon = riasecIcons[type];
            const rank = idx + 1;
            const rankStyle = rankColors[rank];
            return (
              <div
                key={type}
                className={`p-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] shadow`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-12 h-12 rounded-[var(--radius)] flex items-center justify-center ${rankColors[rank].bg}`}
                  >
                    <Icon className={`w-6 h-6 ${rankColors[rank].text}`} />
                  </div>

                  <div>
                    <h3
                      className={`text-lg font-bold ${rankColors[rank].text}`}
                    >
                      Hạng {rank}: {riasecTitles[type].title}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {riasecTitles[type].subtitle}
                    </p>
                  </div>
                </div>

                {/* Thanh điểm */}
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
                    <span>Điểm: {score}</span>
                  </div>
                  <div className="bg-[var(--bg-progress)] w-full h-3 rounded-full mt-1">
                    <div
                      className={`h-3 rounded-full ${rankStyle.progress}`}
                      style={{ width: `${(score / (14 * 5)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full bảng điểm */}
        <div className="mt-8">
          <h3 className="font-bold mb-4 text-[var(--primary)]">
            Điểm chi tiết
          </h3>
          <div className="space-y-3">
            {Object.entries(result.scores).map(([k, v]) => {
              const Icon = riasecIcons[k];
              return (
                <div key={k}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-[var(--primary)]" />
                      <span className="font-semibold text-[var(--muted-foreground)]">
                        {riasecTitles[k].title}
                      </span>
                    </div>
                    <span className="text-sm text-[var(--muted-foreground)]">
                      {v} điểm
                    </span>
                  </div>
                  <div className="bg-[var(--bg-progress)] w-full h-2 rounded-full mt-1">
                    <div
                      className="h-2 rounded-full bg-[var(--primary)]"
                      style={{ width: `${(v / (14 * 5)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => {
            setAnswers({});
            setStep(0);
            setResult(null);
          }}
          className="mt-8 px-4 py-2 bg-[var(--primary)] text-white rounded"
        >
          Làm lại
        </button>
      </div>
    );
  }

  const group = groupedQuestions[step];
  const Icon = riasecIcons[group.type];

  return (
    <div className="mt-6 mb-16" ref={topRef}>
      {/* header */}
      <div className="border border-[var(--border)] bg-[var(--card)] rounded-[var(--radius)] p-4 mt-8 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--bg-chart-1)] rounded-[var(--radius)] flex items-center justify-center">
            <Target className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="text-[var(--primary)]">
              Test xu hướng nghề nghiệp RIASEC
            </h2>
            <p className="text-[var(--muted-foreground)]">
              Khám phá những hoạt động và môi trường làm việc bạn yêu thích
            </p>
          </div>
        </div>
      </div>

      {/* progress */}
      <div className="flex flex-col gap-2">
        <div className="text-[var(--muted-foreground)] flex justify-between">
          <p>
            Nhóm {step + 1} / {totalGroups}
          </p>
          <p>{riasecProgress}%</p>
        </div>
        <div className="bg-[var(--bg-progress)] w-full h-3 rounded-full">
          <div
            className="h-3 rounded-full bg-[var(--primary)]"
            style={{ width: `${riasecProgress}%` }}
          ></div>
        </div>
      </div>

      {/* nhóm */}
      <div className="border border-[var(--border)] bg-[var(--card)] rounded-[var(--radius)] p-4 mt-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--bg-chart-1)] rounded-[var(--radius)] flex items-center justify-center">
            <Icon className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="text-[var(--primary)]">{group.title}</h2>
            <p className="text-[var(--muted-foreground)]">{group.subtitle}</p>
          </div>
        </div>
      </div>

      {/* câu hỏi */}
      {group.questions.map((q) => (
        <div
          key={q.id}
          ref={(el) => (questionRefs.current[q.id] = el)}
          className="card transition-all duration-500 border border-[var(--border)] w-full p-6 flex flex-col gap-4 bg-[var(--card)] rounded-[var(--radius)] mt-6"
        >
          <p className="text-[var(--muted-foreground)] text-lg">
            {q.id}. {q.question}
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <span className="text-sm text-[var(--primary)]">Không thích</span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((v, idx) => {
                const selected = answers[q.id] === v;

                // logic màu theo giá trị
                const baseBorder =
                  v <= 2
                    ? "border-[var(--primary)]"
                    : v === 3
                    ? "border-gray-400"
                    : "border-[var(--secondary)]";

                const bgSelected =
                  v <= 2
                    ? "bg-[var(--primary)] text-white"
                    : v === 3
                    ? "bg-gray-400 text-white"
                    : "bg-[var(--secondary)] text-white";

                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleSelect(q.id, v)}
                    className={`cursor-pointer flex-none flex items-center justify-center rounded-full
          ${sizeClass[idx]} ${baseBorder}
          ${selected ? bgSelected : "bg-transparent"}
          border-2 transition-all`}
                  >
                    {selected && <Check className="w-8/12 h-8/12" />}
                  </button>
                );
              })}
            </div>

            <span className="text-sm text-[var(--secondary)]">Rất thích</span>
          </div>
        </div>
      ))}

      {/* nút */}
      <div className="flex flex-wrap gap-4 justify-between mt-6">
        {step > 0 && (
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-200 text-black rounded-lg cursor-pointer"
          >
            Quay lại
          </button>
        )}

        <button
          onClick={handleRandomFill}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded-lg cursor-pointer"
        >
          <Shuffle className="w-4 h-4"/>
          <p>Random Fill</p>
        </button>
          <button
            onClick={handleNext}
            disabled={!isGroupComplete()}
            className={`px-6 py-2 rounded-lg text-white bg-[var(--primary)] cursor-pointer ${
              isGroupComplete() ? "" : "opacity-60 cursor-not-allowed"
            }`}
          >
            {step < groupedQuestions.length - 1 ? "Tiếp tục" : "Xem kết quả"}
          </button>
      </div>
    </div>
  );
}
