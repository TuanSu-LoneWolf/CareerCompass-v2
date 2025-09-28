import {
  Button,
  FloatingButton,
} from "../../components/library/buttons/button.jsx";
import { InfoCard } from "../../components/library/cards/card.jsx";
import { GraduationCap, Compass, MessageCircle, FileText, Bot } from "lucide-react";
export function HomePage({ Headline, SubHeadLine, FeatureTitle, FeatureSubTitle, img }) {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto px-4 items-center justify-center h-auto lg:min-h-screen pt-20 lg:pt-0 pb-10 lg:pb-0">
        {/* Cột text */}
        <div className="flex flex-col gap-8 items-start justify-center w-full lg:w-1/2 text-center lg:text-left">
          <div className="flex flex-col items-center lg:items-start justify-center gap-4">
            <h1 className="text-3xl lg:text-5xl leading-tight">{Headline}</h1>
            <p className="text-base lg:text-lg text-[var(--muted-foreground)]">
              {SubHeadLine}
            </p>
          </div>
          <a href="/career-guidance">
            <Button type="primary" className="rounded-full zoom" start>
              Bắt đầu ngay
            </Button>
          </a>
        </div>

        {/* Cột ảnh */}
        <div className="flex gap-4 items-center justify-center w-full lg:w-1/2 p-0 lg:p-6">
          <div className="zoom bg-[linear-gradient(to_bottom_right,rgba(33,99,235,0.1),rgba(245,158,11,0.1))] rounded-2xl w-full">
            <div className="relative z-10">
              <img src={img} className="rounded-2xl p-2 w-full" alt="Hero" />

              {/* Nút bên trái */}
              <div className="absolute bottom-6 left-6 flex flex-col gap-3">
                <FloatingButton
                  icon="🎯"
                  text="Hướng nghiệp"
                  color="text-pink-600"
                />
              </div>

              {/* Nút bên phải */}
              <div className="absolute top-6 right-6">
                <FloatingButton text="AI Tư vấn" dotColor="#2563EB" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-[var(--feature-background)]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col justify-center items-center max-w-3xl mx-auto mt-4 mb-12">
            <h1 className="text-3xl text-[var(--card-foreground)] group-hover:text-[var(--secondary)] mb-2">{FeatureTitle}</h1>
            <p className="text-[var(--muted-foreground)]">{FeatureSubTitle}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <InfoCard
              link="/universities-majors"
              icon={GraduationCap}
              title="Danh sách Đại học"
              subTitle="Khám phá hơn 500 trường đại học với thông tin chi tiết về ngành học."
              button="Xem chi tiết"
              color="text-[var(--chart-1)] bg-[var(--bg-chart-1)]"
            />
            <InfoCard
              link="/career-guidance"
              icon={Compass}
              title="Hướng nghiệp"
              subTitle="Tìm ra con đường sự nghiệp phù hợp thông qua bài test MBTI, RIASEC"
              button="Bắt đầu làm test"
              color="text-[var(--chart-3)] bg-[var(--bg-chart-3)]"
            />
            <InfoCard
              link="/interview-practice"
              icon={MessageCircle}
              title="Luyện phỏng vấn"
              subTitle="Rèn luyện kỹ năng phỏng vấn với AI chatbot thông minh, mô phỏng các tình huống thực tế."
              button="Luyện phỏng vấn ngay"
              color="text-[var(--chart-4)] bg-[var(--bg-chart-4)]"
            />
            <InfoCard
              link="/cv-check"
              icon={FileText}
              title="Kiểm tra CV"
              subTitle="Phân tích và đánh giá CV của bạn với AI, đưa ra gợi ý cải thiện để tăng cơ hội tuyển dụng."
              button="Tải CV & kiểm tra"
              color="text-[var(--chart-5)] bg-[var(--bg-chart-5)]"
            />
            <InfoCard
              link="/"
              icon={Bot}
              title="Chatbot Tư vấn"
              subTitle="Nhận tư vấn cá nhân hóa 24/7 về lộ trình học tập và phát triển sự nghiệp."
              button="Mở Chatbot"
              color="text-[var(--chart-6)] bg-[var(--bg-chart-6)]"
            />
          </div>
        </div>
      </div>
    </>
  );
}
