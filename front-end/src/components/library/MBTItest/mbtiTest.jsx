// MBTITest.jsx
import { useState, useRef } from "react";
import { Check, Brain, Shuffle } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "Ở các bữa tiệc bạn thường",
    a: "Nói chuyện với nhiều người, kể cả người lạ",
    b: "Nói chuyện với số ít những người quen thân",
    dimension: "EI",
  },
  {
    id: 2,
    question: "Bạn thấy mình là người thuộc loại nào nhiều hơn?",
    a: "Thực tế",
    b: "Mơ mộng",
    dimension: "SN",
  },
  {
    id: 3,
    question: "Bạn quan tâm đến điều gì nhiều hơn?",
    a: "Dữ liệu, thực tế",
    b: "Các câu chuyện",
    dimension: "SN",
  },
  {
    id: 4,
    question: "Bạn thường đối xử như thế nào nhiều hơn?",
    a: "Công bằng",
    b: "Đối xử tốt, theo tình cảm",
    dimension: "TF",
  },
  {
    id: 5,
    question: "Bạn thường",
    a: "Vô tư, không bao giờ thiên vị",
    b: "Cảm thông, đôi khi xử lí tình huống theo cảm tính",
    dimension: "TF",
  },
  {
    id: 6,
    question: "Bạn thích làm việc theo kiểu nào nhiều hơn?",
    a: "Theo đúng thời hạn",
    b: "Theo hứng",
    dimension: "JP",
  },
  {
    id: 7,
    question: "Bạn sẽ lựa chọn",
    a: "Rất cẩn thận",
    b: "Phần nào theo cảm nhận",
    dimension: "JP",
  },
  {
    id: 8,
    question: "Tại các bữa tiệc, bạn thường",
    a: "Ở lại muộn, cảm thấy ngày càng khỏe khoắn cao hứng hơn",
    b: "Ra về sớm và cảm thấy mỏi mệt dần",
    dimension: "EI",
  },
  {
    id: 9,
    question: "Bạn là người",
    a: "Nhạy cảm",
    b: "Suy nghĩ cẩn trọng",
    dimension: "SN",
  },
  {
    id: 10,
    question: "Bạn thích",
    a: "Dữ liệu, sự kiện thực tế",
    b: "Các ý tưởng khác nhau",
    dimension: "SN",
  },
  {
    id: 11,
    question: "Về bản chất bạn thường",
    a: "Công bằng với mọi người",
    b: "Tốt với mọi người",
    dimension: "TF",
  },
  {
    id: 12,
    question: "Lần đầu tiên tiếp xúc bạn thường",
    a: "Im lặng và cảm thấy xấu hổ",
    b: "Nói nhiều và tỏ ra thân thiện",
    dimension: "TF",
  },
  {
    id: 13,
    question: "Thường thì bạn là người",
    a: "Đúng giờ, chuẩn mực",
    b: "Thong thả",
    dimension: "JP",
  },
  {
    id: 14,
    question: "Trường hợp nào bạn cảm thấy nóng ruột, bồn chồn hơn?",
    a: "Khi mọi việc chưa hoàn thành",
    b: "Khi mọi việc đã hoàn thành",
    dimension: "JP",
  },
  {
    id: 15,
    question: "Với những người bạn của mình, bạn thường",
    a: "Biết điều gì đang xảy ra đối với mọi người",
    b: "Biết những điều đó cuối cùng",
    dimension: "EI",
  },
  {
    id: 16,
    question: "Bạn thường quan tâm tới",
    a: "Những chi tiết cụ thể",
    b: "Ý tưởng, khái niệm",
    dimension: "SN",
  },
  {
    id: 17,
    question: "Bạn thích những tác giả",
    a: "Nói thẳng điều định nói",
    b: "Dùng nhiều câu chuyện để minh họa cho điều họ định nói",
    dimension: "SN",
  },
  {
    id: 18,
    question: "Về bản chất bạn thường",
    a: "Vô tư, không thiên vị",
    b: "Hay thương người",
    dimension: "TF",
  },
  {
    id: 19,
    question: "Khi đánh giá, bạn thường",
    a: "Không để tình cảm cá nhân ảnh hưởng",
    b: "Đa cảm, hay động lòng",
    dimension: "TF",
  },
  {
    id: 20,
    question: "Bạn thường",
    a: "Sắp đặt công việc",
    b: "Khuyến khích các phương án khác nhau",
    dimension: "JP",
  },
  {
    id: 21,
    question: "Bạn thường muốn",
    a: "Các buổi hẹn có sắp đặt trước",
    b: "Để mọi việc tự do, thoải mái",
    dimension: "JP",
  },
  {
    id: 22,
    question: "Khi gọi điện thoại bạn",
    a: "Cứ gọi bình thường",
    b: "Chuẩn bị trước những điều sẽ nói",
    dimension: "EI",
  },
  {
    id: 23,
    question: "Sự kiện thực tế",
    a: "Tự nói lên mọi điều",
    b: "Thường cần có lời giải thích",
    dimension: "SN",
  },
  {
    id: 24,
    question: "Bạn thích làm việc với",
    a: "Những thông tin thực tế",
    b: "Những ý tưởng trừu tượng",
    dimension: "SN",
  },
  {
    id: 25,
    question: "Bạn là người",
    a: "Trầm tĩnh, lạnh lùng",
    b: "Sôi nổi, sốt sắng",
    dimension: "TF",
  },
  {
    id: 26,
    question: "Bạn thường là người",
    a: "Thực tế, vô tư hơn là thương xót, cảm thông",
    b: "Thương xót cảm thông hơn là vô tư, thực tế",
    dimension: "TF",
  },
  {
    id: 27,
    question: "Bạn cảm thấy thoải mái hơn khi",
    a: "Lập thời gian biểu rõ ràng",
    b: "Cứ để mọi việc tự nhiên",
    dimension: "JP",
  },
  {
    id: 28,
    question: "Bạn cảm thấy thoải mái hơn với",
    a: "Bản thỏa thuận viết lên giấy",
    b: "Thỏa thuận bằng lời và những cái bắt tay",
    dimension: "JP",
  },
  {
    id: 29,
    question: "Ở nơi làm việc bạn thường",
    a: "Là người bắt đầu các câu chuyện",
    b: "Ngồi chờ người khác đến với mình",
    dimension: "EI",
  },
  {
    id: 30,
    question: "Những nguyên tắc truyền thống",
    a: "Thường đáng tin cậy",
    b: "Thường làm ta sai phương hướng",
    dimension: "SN",
  },
  {
    id: 31,
    question: "Trẻ em thường không",
    a: "Hoạt động có ích hết khả năng chúng có",
    b: "Mơ mộng như đáng có",
    dimension: "SN",
  },
  {
    id: 32,
    question: "Bạn có thường",
    a: "Suy nghĩ luận giải chặt chẽ",
    b: "Dễ xúc động",
    dimension: "TF",
  },
  {
    id: 33,
    question: "Bạn có thường",
    a: "Chắc chắn, chặt chẽ hơn là mềm mỏng, dễ dãi",
    b: "Mềm mỏng dễ dãi hơn là chắc chắn chặt chẽ",
    dimension: "TF",
  },
  {
    id: 34,
    question: "Bạn có sắp xếp mọi thứ",
    a: "Trật tự ngăn nắp",
    b: "Để chúng thoải mái, tự do",
    dimension: "JP",
  },
  {
    id: 35,
    question: "Bạn thấy điều gì có giá trị hơn",
    a: "Điều chắc chắn, đã xác định",
    b: "Điều chưa chắc chắn, còn thay đổi",
    dimension: "JP",
  },
  {
    id: 36,
    question: "Những mối quan hệ giao tiếp mới với người khác",
    a: "Khuyến khích và thúc đẩy bạn",
    b: "Làm bạn cảm thấy bạn cần tìm một chỗ khác để nghỉ và suy nghĩ",
    dimension: "EI",
  },
  {
    id: 37,
    question: "Bạn thường xuyên là người",
    a: "Gắn với thực tế",
    b: "Gắn với ý tưởng trừu tượng",
    dimension: "SN",
  },
  {
    id: 38,
    question: "Bạn bị cuốn hút vào việc gì nhiều hơn",
    a: "Xem xét và hiểu các sự kiện",
    b: "Phát triển ý tưởng mới",
    dimension: "SN",
  },
  {
    id: 39,
    question: "Điều gì làm bạn thỏa mãn hơn",
    a: "Thảo luận mọi khía cạnh của một vấn đề",
    b: "Tiến tới thỏa thuận về một vấn đề",
    dimension: "TF",
  },
  {
    id: 40,
    question: "Điều gì thúc đẩy bạn nhiều hơn",
    a: "Trí óc của bạn",
    b: "Trái tim của bạn",
    dimension: "TF",
  },
  {
    id: 41,
    question: "Bạn thấy thoải mái hơn với những công việc",
    a: "Theo hợp đồng",
    b: "Theo phong thái thoải mái tự nhiên",
    dimension: "JP",
  },
  {
    id: 42,
    question: "Bạn thích công việc được",
    a: "Chuẩn xác và ngăn nắp",
    b: "Mở cho nhiều giải thích khác nhau",
    dimension: "JP",
  },
  {
    id: 43,
    question: "Bạn thích",
    a: "Nhiều bạn bè với những cuộc trao đổi ngắn",
    b: "Một bạn mới với cuộc nói chuyện dài",
    dimension: "EI",
  },
  {
    id: 44,
    question: "Bạn bị cuốn hút bởi",
    a: "Nhiều thông tin",
    b: "Những giả thiết tuyệt vời",
    dimension: "SN",
  },
  {
    id: 45,
    question: "Bạn quan tâm nhiều hơn tới",
    a: "Sản xuất",
    b: "Nghiên cứu",
    dimension: "SN",
  },
  {
    id: 46,
    question: "Bạn cảm thấy thoải mái hơn khi bạn",
    a: "Khách quan",
    b: "Tính tới tình cảm cá nhân",
    dimension: "TF",
  },
  {
    id: 47,
    question: "Bạn tự đánh giá mình là người",
    a: "Rõ ràng và chắc chắn",
    b: "Sẵn sàng hy sinh",
    dimension: "TF",
  },
  {
    id: 48,
    question: "Bạn cảm thấy thoải mái hơn với",
    a: "Lời phát ngôn cuối cùng",
    b: "Những ý kiến kiến nghị, thảo luận",
    dimension: "JP",
  },
  {
    id: 49,
    question: "Bạn cảm thấy thoải mái hơn",
    a: "Sau một quyết định",
    b: "Trước một quyết định",
    dimension: "JP",
  },
  {
    id: 50,
    question: "Bạn có",
    a: "Nói được nhiều chuyện, dễ dàng, với người lạ",
    b: "Thấy chẳng có gì nhiều để nói với người lạ cả",
    dimension: "EI",
  },
  {
    id: 51,
    question: "Bạn có thường quan tâm tới",
    a: "Dữ liệu, sự kiện của một tình huống cụ thể",
    b: "Các tình huống chung",
    dimension: "SN",
  },
  {
    id: 52,
    question: "Bạn có cảm thấy mình là người",
    a: "Chân chất hơn là khéo léo",
    b: "Khéo léo hơn là chân chất",
    dimension: "SN",
  },
  {
    id: 53,
    question: "Bạn thực sự là người của",
    a: "Những luận giải rõ ràng",
    b: "Cảm nhận tình cảm mạnh mẽ",
    dimension: "TF",
  },
  {
    id: 54,
    question: "Bạn có thiên hướng hơn về",
    a: "Suy luận vô tư, công minh",
    b: "Cảm thông",
    dimension: "TF",
  },
  {
    id: 55,
    question: "Điều hoàn hảo nói chung là",
    a: "Đảm bảo rằng mọi việc đều được sắp xếp có quy củ",
    b: "Cứ để mọi việc xảy ra tự nhiên",
    dimension: "JP",
  },
  {
    id: 56,
    question: "Có phải cách làm việc của bạn là",
    a: "Mọi việc cần được giải quyết đúng hạn",
    b: "Trì hoãn giải quyết công việc",
    dimension: "JP",
  },
  {
    id: 57,
    question: "Khi chuông điện thoại reo, bạn có",
    a: "Trả lời điện thoại trước",
    b: "Hy vọng ai đó sẽ trả lời",
    dimension: "EI",
  },
  {
    id: 58,
    question: "Điều gì có giá trị hơn? nếu có",
    a: "Cảm nhận tốt về hiện thực",
    b: "Trí tưởng tượng phong phú",
    dimension: "SN",
  },
  {
    id: 59,
    question: "Bạn có thiên hướng về",
    a: "Sự kiện, dữ liệu",
    b: "Suy luận",
    dimension: "SN",
  },
  {
    id: 60,
    question: "Khi đánh giá bạn thường",
    a: "Trung lập",
    b: "Độ lượng, khoan dung",
    dimension: "TF",
  },
  {
    id: 61,
    question: "Bạn có thấy mình thiên về bên nào hơn",
    a: "Suy nghĩ rõ ràng, cẩn trọng",
    b: "Có ý chí mạnh mẽ",
    dimension: "TF",
  },
  {
    id: 62,
    question: "Bạn có",
    a: "Lập thời gian biểu cho các công việc",
    b: "Việc gì đến thì làm",
    dimension: "JP",
  },
  {
    id: 63,
    question: "Bạn là người có thiên hướng nào nhiều hơn",
    a: "Làm việc theo nền nếp hàng ngày",
    b: "Tự do",
    dimension: "JP",
  },
  {
    id: 64,
    question: "Bạn là người",
    a: "Dễ tiếp xúc, làm quen",
    b: "Kín đáo",
    dimension: "EI",
  },
  {
    id: 65,
    question: "Bạn thấy vui sướng với",
    a: "Những kinh nghiệm được người khác trao đổi",
    b: "Những ý tưởng kỳ quặc",
    dimension: "SN",
  },
  {
    id: 66,
    question: "Khi viết, bạn thích",
    a: "Sự rõ ràng, trong sáng",
    b: "Những ý tưởng thông minh",
    dimension: "SN",
  },
  {
    id: 67,
    question: "Bạn thường",
    a: "Không định kiến",
    b: "Thương người",
    dimension: "TF",
  },
  {
    id: 68,
    question: "Bạn thực sự là người",
    a: "Công minh hơn là nhân hậu",
    b: "Nhân hậu hơn là công minh",
    dimension: "TF",
  },
  {
    id: 69,
    question: "Bạn là người",
    a: "Hay đưa ra những đánh giá bất ngờ",
    b: "Trì hoãn việc đánh giá",
    dimension: "JP",
  },
  {
    id: 70,
    question: "Bạn có xu hướng",
    a: "Cẩn trọng, chín chắn hơn là tự do",
    b: "Tự do hơn là cẩn trọng, chín chắn",
    dimension: "JP",
  },
];

const choiceMap = [
  { a: 5, b: 0 },
  { a: 4, b: 1 },
  { a: 3, b: 2 },
  { a: 2, b: 3 },
  { a: 1, b: 4 },
  { a: 0, b: 5 },
];

const mbtiDescriptions = {
  ISTJ: {
    code: "ISTJ",
    name: "Người Thanh tra (The Inspector)",
    overview: "Trung thực, trách nhiệm, thực tế và có nguyên tắc rõ ràng.",
  },
  ISFJ: {
    code: "ISFJ",
    name: "Người Bảo vệ (The Protector)",
    overview: "Chu đáo, tận tâm, trung thành và quan tâm đến người khác.",
  },
  INFJ: {
    code: "INFJ",
    name: "Người Cố vấn (The Counselor)",
    overview: "Trực giác sâu sắc, quan tâm người khác và có lý tưởng mạnh mẽ.",
  },
  INTJ: {
    code: "INTJ",
    name: "Nhà Chiến lược (The Mastermind)",
    overview: "Chiến lược, độc lập, định hướng mục tiêu và có tầm nhìn xa.",
  },
  ISTP: {
    code: "ISTP",
    name: "Người Thợ Cơ khí (The Crafter)",
    overview: "Thực tế, khéo tay, thích khám phá và hành động thực tiễn.",
  },
  ISFP: {
    code: "ISFP",
    name: "Người Nghệ sĩ (The Artist)",
    overview: "Sáng tạo, hòa nhã, quan tâm trải nghiệm và tự do cá nhân.",
  },
  INFP: {
    code: "INFP",
    name: "Người Hòa giải (The Mediator)",
    overview: "Lý tưởng, sáng tạo, trung thành và sống theo giá trị nội tâm.",
  },
  INTP: {
    code: "INTP",
    name: "Nhà Tư duy (The Thinker)",
    overview: "Phân tích logic, tò mò, yêu thích khám phá tri thức.",
  },
  ESTP: {
    code: "ESTP",
    name: "Người Thực thi (The Dynamo)",
    overview: "Năng động, thực tế, thích hành động và đối mặt thử thách.",
  },
  ESFP: {
    code: "ESFP",
    name: "Người Biểu diễn (The Performer)",
    overview: "Hòa đồng, vui vẻ, sống trong hiện tại và yêu thích trải nghiệm.",
  },
  ENFP: {
    code: "ENFP",
    name: "Người Truyền cảm hứng (The Inspirer)",
    overview: "Nhiệt huyết, sáng tạo, hướng ngoại và yêu tự do.",
  },
  ENTP: {
    code: "ENTP",
    name: "Người Sáng tạo (The Inventor)",
    overview: "Tư duy nhanh, thích thử thách, ham học hỏi và linh hoạt.",
  },
  ESTJ: {
    code: "ESTJ",
    name: "Người Quản lý (The Supervisor)",
    overview: "Tổ chức tốt, quyết đoán, thực tế và thích kiểm soát trật tự.",
  },
  ESFJ: {
    code: "ESFJ",
    name: "Người Chăm sóc (The Caregiver)",
    overview: "Quan tâm người khác, chu đáo, hòa đồng và đáng tin cậy.",
  },
  ENFJ: {
    code: "ENFJ",
    name: "Người Lãnh đạo (The Teacher)",
    overview: "Lãnh đạo cảm xúc, truyền cảm hứng và luôn hỗ trợ người khác.",
  },
  ENTJ: {
    code: "ENTJ",
    name: "Nhà Điều hành (The Commander)",
    overview: "Lãnh đạo mạnh mẽ, chiến lược, quyết đoán và có tầm nhìn.",
  },
};

const ITEMS_PER_PAGE = 7;

export function MBTITest({ onFinish }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // refs cho từng câu hỏi
  const questionRefs = useRef({});

  const start = currentPage * ITEMS_PER_PAGE;
  const end = Math.min(start + ITEMS_PER_PAGE, questions.length);
  const currentQuestions = questions.slice(start, end);

  const handleSelect = (qId, idx) => {
    setAnswers((prev) => ({ ...prev, [qId]: idx }));

    // tìm index của câu tiếp theo
    const currentIndex = questions.findIndex((q) => q.id === qId);
    const nextQ = questions[currentIndex + 1];

    if (nextQ && questionRefs.current[nextQ.id]) {
      const element = questionRefs.current[nextQ.id];
      const y = element.getBoundingClientRect().top + window.scrollY;

      const offset = 252; // 👈 chỉnh theo chiều cao navbar
      window.scrollTo({
        top: y - offset,
        behavior: "smooth",
      });
    }
  };

  const completedQuestions = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const mbtiProgress = Math.round((completedQuestions / totalQuestions) * 100);

  const handleNext = () => {
    for (let i = start; i < end; i++) {
      const qid = questions[i].id;
      if (answers[qid] === undefined) {
        alert(`Bạn chưa chọn câu số ${qid}`);
        if (questionRefs.current[qid]) {
          questionRefs.current[qid].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        return;
      }
    }

    if ((currentPage + 1) * ITEMS_PER_PAGE >= questions.length) {
      calculateResult();
    } else {
      setCurrentPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const calculateResult = () => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    for (const q of questions) {
      const selected = answers[q.id];
      if (selected !== undefined) {
        const score = choiceMap[selected];
        const [first, second] = q.dimension.split("");
        scores[first] += score.a;
        scores[second] += score.b;
      }
    }

    const resultKey = [
      scores.E >= scores.I ? "E" : "I",
      scores.S >= scores.N ? "S" : "N",
      scores.T >= scores.F ? "T" : "F",
      scores.J >= scores.P ? "J" : "P",
    ].join("");

    const percent = {
      EI: Math.round(
        scores.E + scores.I ? (scores.E / (scores.E + scores.I)) * 100 : 50
      ),
      SN: Math.round(
        scores.S + scores.N ? (scores.S / (scores.S + scores.N)) * 100 : 50
      ),
      TF: Math.round(
        scores.T + scores.F ? (scores.T / (scores.T + scores.F)) * 100 : 50
      ),
      JP: Math.round(
        scores.J + scores.P ? (scores.J / (scores.J + scores.P)) * 100 : 50
      ),
    };

    const finalResult = { key: resultKey, percent, scores };
    setResult(finalResult);

    // lấy mô tả từ object bằng resultKey (không dùng result.name)
    const desc = mbtiDescriptions[resultKey] || {
      name: "Không xác định",
      overview: "",
    };

    const MBTIResult = {
      "Mã tính cách": resultKey,
      "Tên tính cách": desc.name,
      "Tổng điểm": scores,
    };

    console.log(MBTIResult);

    if (onFinish) onFinish(MBTIResult);

    window.scrollTo({ top: 0, behavior: "smooth" });

    return MBTIResult
  };

  const restart = () => {
    setAnswers({});
    setCurrentPage(0);
    setResult(null);
  };

  if (result) {
    const desc = mbtiDescriptions[result.key] || {
      code: result.key,
      overview: "Không có mô tả.",
    };
    return (
      <div className="py-6">
        <div className="card w-full p-6 bg-[var(--card)] border border-[var(--border)] hover:border-[var(--secondary)] rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-[var(--muted-foreground)]">
                Kết quả MBTI
              </h3>
              <h1 className="text-3xl font-bold text-[var(--primary)]">
                {result.key}
              </h1>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {desc.overview}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={restart}
                className="px-4 py-2 rounded bg-[var(--primary)] text-white"
              >
                Làm lại
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-4" id="trait-bars">
            {[
              { key: "EI", left: "Hướng ngoại", right: "Hướng nội" },
              { key: "SN", left: "Thực tế", right: "Trực giác" },
              { key: "TF", left: "Lý trí", right: "Cảm xúc" },
              { key: "JP", left: "Có tổ chức", right: "Linh hoạt" },
            ].map((t) => {
              const leftPercent = result.percent[t.key];
              const rightPercent = 100 - leftPercent;
              return (
                <div key={t.key} className="trait-group">
                  <div className="flex justify-between text-sm text-[var(--muted-foreground)] mb-1">
                    <div>
                      {t.left} <span className="font-bold">{leftPercent}%</span>
                    </div>
                    <div>
                      <span className="font-bold">{rightPercent}%</span>{" "}
                      {t.right}
                    </div>
                  </div>

                  <div className="w-full h-4 rounded-full bg-[var(--foreground-light)] overflow-hidden">
                    <div
                      className="h-4 float-left"
                      style={{
                        width: `${leftPercent}%`,
                        background: "var(--primary)",
                      }}
                    />
                    <div
                      className="h-4 float-right"
                      style={{
                        width: `${rightPercent}%`,
                        background: "var(--secondary)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // sizes for the 6 options (index 0..5)
  const sizeClass = [
    "w-10 h-10",
    "w-8 h-8",
    "w-7 h-7",
    "w-7 h-7",
    "w-8 h-8",
    "w-10 h-10",
  ];

  return (
    <div className="mt-6 mb-16">
      {/* 👉 progress section */}
      <div className="border border-[var(--border)] bg-[var(--card)] rounded-[var(--radius)] p-4 mt-8 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--bg-chart-1)] rounded-[var(--radius)] flex items-center justify-center">
            <Brain className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="text-[var(--primary)]">
              Test MBTI - Khám phá tính cách của bạn
            </h2>
            <p className="text-[var(--muted-foreground)]">
              Khám phá tính cách và cách bạn nhìn nhận thế giới
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-[var(--muted-foreground)] flex justify-between">
          <p>
            Câu {completedQuestions} / {totalQuestions}
          </p>
          <p>{mbtiProgress}%</p>
        </div>
        <div className="bg-[var(--bg-progress)] w-full h-3 rounded-full">
          <div
            className="h-3 rounded-full bg-[var(--primary)]"
            style={{ width: `${mbtiProgress}%` }}
          ></div>
        </div>
      </div>

      {/* danh sách câu hỏi */}
      {currentQuestions.map((q) => (
        <div
          key={q.id}
          ref={(el) => (questionRefs.current[q.id] = el)}
          className="card transition-all duration-500 border border-[var(--border)] w-full p-6 flex flex-col gap-4 bg-[var(--card)] rounded-[var(--radius)] mt-6"
        >
          <p className="text-[var(--muted-foreground)] text-lg">
            {q.id}. {q.question}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-[var(--primary)] text-center w-56 break-words">
              {q.a}
            </p>

            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const selected = answers[q.id] === idx;
                const isLeft = idx < 3;
                const baseBorder = isLeft
                  ? "border-[var(--primary)]"
                  : "border-[var(--secondary)]";
                const bgSelected = isLeft
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--secondary)] text-white";

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(q.id, idx)}
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

            <p className="text-[var(--secondary)] text-center w-56 break-words">
              {q.b}
            </p>
          </div>
        </div>
      ))}

      <div className="mt-6 flex flex-wrap gap-4 justify-between">
        {/* Quay lại */}
        {currentPage > 0 && (
          <button
            onClick={() => {
              if (currentPage > 0) {
                setCurrentPage((p) => p - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="px-6 py-2 bg-gray-300 text-black rounded-lg cursor-pointer disabled:opacity-50"
            disabled={currentPage === 0}
          >
            Quay lại
          </button>
        )}

        {/* Random fill */}
        <button
          onClick={() => {
            const newAnswers = { ...answers };
            for (let i = start; i < end; i++) {
              const qid = questions[i].id;
              if (newAnswers[qid] === undefined) {
                newAnswers[qid] = Math.floor(Math.random() * 6); // random 0..5
              }
            }
            setAnswers(newAnswers);
          }}
          className="flex items-center gap-2 px-6 py-2 bg-yellow-500 text-white rounded-lg cursor-pointer"
        >
          <Shuffle className="w-4 h-4" />
          <p>Random Fill</p>
        </button>

        {/* Tiếp tục / Xem kết quả */}
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg cursor-pointer"
        >
          {end === questions.length ? "Xem kết quả" : "Tiếp tục"}
        </button>
      </div>
    </div>
  );
}
