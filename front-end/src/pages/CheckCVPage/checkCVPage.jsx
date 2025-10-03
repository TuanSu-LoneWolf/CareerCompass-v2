export function CheckCVPage() {
  return (
    <div className="flex flex-col justify-center items-center max-w-3xl mx-auto pb-16">
      <div className="p-16">
        <h1 className="text-3xl text-[var(--card-foreground)] text-center mb-2">
          Khám phá cơ hội học tập
        </h1>
        <p className="text-[var(--muted-foreground)] text-center mb-4 md:mb-12">
          Tìm hiểu thông tin chi tiết về các trường đại học và nhóm ngành đào
          tạo để đưa ra lựa chọn phù hợp nhất
        </p>
      </div>
      <div className="max-w-lg border border-[var(--border)] bg-[var(--card)] rounded-[var(--radius)]"></div>
    </div>
  );
}
