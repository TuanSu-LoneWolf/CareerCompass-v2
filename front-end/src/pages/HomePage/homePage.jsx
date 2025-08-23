import {
  Button,
  FloatingButton,
} from "../../components/library/buttons/button.jsx";

export function HomePage({ Headline, SubHeadLine, img }) {
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
            <Button type="primary" className="rounded-full" start>
              Bắt đầu ngay
            </Button>
          </a>
        </div>

        {/* Cột ảnh */}
        <div className="flex gap-4 items-center justify-center w-full lg:w-1/2 p-0 lg:p-6">
          <div className="bg-[linear-gradient(to_bottom_right,rgba(33,99,235,0.1),rgba(245,158,11,0.1))] rounded-2xl w-full">
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
      <div className="w-full min-h-screen bg-[var(--feature-background)]"></div>
    </>
  );
}
