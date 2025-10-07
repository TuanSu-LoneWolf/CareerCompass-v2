import { Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/library/buttons/button.jsx";

export function CheckCVPage() {
  const [view, setView] = useState("result");

  const result =
    "Cảm ơn bạn đã lắng ngheCV của bạn được trình bày khá rõ ràng và có cấu trúc hợp lý, tuy nhiên phần nội dung còn thiếu điểm nhấn. AI nhận thấy phần Kinh nghiệm làm việc mới chỉ dừng lại ở việc mô tả nhiệm vụ, chưa thể hiện được kết quả hoặc tác động cụ thể mà bạn đã tạo ra trong công việc. Bạn nên bổ sung các số liệu hoặc ví dụ minh họa để tăng tính thuyết phục, chẳng hạn như “tăng doanh thu 20%” hoặc “giảm 30% thời gian xử lý quy trình”. Bên cạnh đó, phần Kỹ năng có thể được chia nhóm theo chuyên môn để người đọc dễ theo dõi hơn. Tổng thể, CV thể hiện một nền tảng tốt nhưng cần thêm yếu tố cá nhân hóa để gây ấn tượng mạnh hơn. Cảm ơn bạn đã lắng ngheCV của bạn được trình bày khá rõ ràng và có cấu trúc hợp lý, tuy nhiên phần nội dung còn thiếu điểm nhấn. AI nhận thấy phần Kinh nghiệm làm việc mới chỉ dừng lại ở việc mô tả nhiệm vụ, chưa thể hiện được kết quả hoặc tác động cụ thể mà bạn đã tạo ra trong công việc. Bạn nên bổ sung các số liệu hoặc ví dụ minh họa để tăng tính thuyết phục, chẳng hạn như “tăng doanh thu 20%” hoặc “giảm 30% thời gian xử lý quy trình”. Bên cạnh đó, phần Kỹ năng có thể được chia nhóm theo chuyên môn để người đọc dễ theo dõi hơn. Tổng thể, CV thể hiện một nền tảng tốt nhưng cần thêm yếu tố cá nhân hóa để gây ấn tượng mạnh hơn. Cảm ơn bạn đã lắng ngheCV của bạn được trình bày khá rõ ràng và có cấu trúc hợp lý, tuy nhiên phần nội dung còn thiếu điểm nhấn. AI nhận thấy phần Kinh nghiệm làm việc mới chỉ dừng lại ở việc mô tả nhiệm vụ, chưa thể hiện được kết quả hoặc tác động cụ thể mà bạn đã tạo ra trong công việc. Bạn nên bổ sung các số liệu hoặc ví dụ minh họa để tăng tính thuyết phục, chẳng hạn như “tăng doanh thu 20%” hoặc “giảm 30% thời gian xử lý quy trình”. Bên cạnh đó, phần Kỹ năng có thể được chia nhóm theo chuyên môn để người đọc dễ theo dõi hơn. Tổng thể, CV thể hiện một nền tảng tốt nhưng cần thêm yếu tố cá nhân hóa để gây ấn tượng mạnh hơn.";

  return (
    <div className="flex flex-col items-center justify-center pb-16 sm:min-h-screen w-full max-w-6xl mx-auto px-2">
      <div className="flex flex-col justify-center items-center max-w-3xl mx-auto">
        <div className="sm:px-16 pt-8">
          <h1 className="text-3xl text-[var(--card-foreground)] text-center mb-2">
            Phân tích & tối ưu CV
          </h1>
          <p className="text-[var(--muted-foreground)] text-center mb-4 md:mb-10">
            Hệ thống AI đọc hiểu CV của bạn như một nhà tuyển dụng thật sự —
            phân tích điểm mạnh, điểm yếu, mức độ chuyên nghiệp, và đề xuất cách
            tối ưu hóa để CV ghi điểm ngay từ lần đầu tiên.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 w-full justify-center">
        <div className="flex flex-col h-fit items-center gap-4 p-4 sm:p-6 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)]">
          <div className="flex justify-center items-center w-12 h-12 text-[var(--primary)] bg-[var(--bg-chart-1)] rounded-[var(--radius)]">
            <Upload className="w-6 h-6"></Upload>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-[var(--primary)]">
              Tải lên CV để AI bắt đầu phân tích
            </h3>
            <p className="text-[var(--muted-foreground)]">
              Hỗ trợ file PDF, dung lượng tối đa 10MB
            </p>
          </div>
          <label className="group flex flex-col items-center gap-4 border-2 w-full p-6 border-dashed border-[var(--border-dashed)] rounded-[var(--radius)] cursor-pointer hover:bg-[var(--bg-chart-1)] transition-tranform duration-300">
            <div className="flex justify-center items-center w-12 h-12 text-[var(--primary)] bg-[var(--bg-chart-1)] rounded-full group-hover:bg-[var(--bg-chart-top)] duration-300">
              <Upload className="w-6 h-6"></Upload>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-[var(--muted-foreground)]">
                <span className="text-[var(--primary)] font-bold">
                  Chọn file
                </span>{" "}
                CV của bạn
              </p>
              <p className="text-[var(--muted-foreground)] text-[12px]">
                Chỉ chấp nhận PDF
              </p>
            </div>
            <input type="file" accept="application/pdf" className="hidden" />
          </label>
        </div>
        <div className="flex flex-col gap-4 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] h-150 w-full max-w-2xl p-4 sm:p-6">
          <div className="flex gap-1 justify-end top-6 right-6 w-full">
            <Button
              onClick={() => setView("result")}
              type="outline border-[var(--primary)] text-[var(--primary)]"
              className=""
            >
              Kết quả
            </Button>
            <Button
              onClick={() => setView("ask")}
              type="outline border-[var(--primary)] text-[var(--primary)]"
              className=""
            >
              Hỏi AI
            </Button>
          </div>
          {view === "result" && (
            <div className="overflow-y-auto hide-scrollbar text-[var(--muted-foreground)] text-justify p-4 border-2 border-dashed border-[var(--border-dashed)] rounded-[var(--radius)] w-full h-full">
                {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
