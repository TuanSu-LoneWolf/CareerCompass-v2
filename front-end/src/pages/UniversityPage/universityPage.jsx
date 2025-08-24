import { useState } from "react";
import { Button } from "../../components/library/buttons/button.jsx";
import { InfoCard } from "../../components/library/cards/card";
import { GraduationCap, BookOpen } from "lucide-react";

export function UniversityPage() {
  const [view, setView] = useState("entry");
  // const [selectedUniversity, setSelectedUniverity] = useState("null");
  // const [selectedGroup, setSelectedGroup] = useState("null");

  const backMap = {
    universitiesDetail: "universities",
    universities: "entry",
    majorGroup: "entry",
  };

  const goBack = () => {
    setView(backMap[view] ?? "entry");
  };

  return (
    <div
      className={`max-w-6xl mx-auto px-4 ${
        view === "entry" ? "lg:min-h-screen" : " "
      }`}
    >
      {/* Back Button */}
      {view !== "entry" && (
        <Button className="rounded-full top-2 left-2" onClick={goBack} back>
          Quay lại
        </Button>
      )}

      {/* Entry */}
      {view === "entry" && (
        <div className="'flex flex-col justify-center items-center max-w-3xl mx-auto pb-16">
          <div className="p-16">
            <h1 className="text-3xl text-[var(--card-foreground)] group-hover:text-[var(--secondary)] text-center mb-2">
              Khám phá cơ hội học tập
            </h1>
            <p className="text-[var(--muted-foreground)] text-center mb-4 md:mb-12">
              Tìm hiểu thông tin chi tiết về các trường đại học và nhóm ngành
              đào tạo để đưa ra lựa chọn phù hợp nhất
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard 
              icon={GraduationCap}
              color="text-[var(--chart-1)] bg-[var(--bg-chart-1)]"
              title="Danh sách trường Đại học"
              subTitle="Khám phá thông tin các trường & ngành học với dữ liệu cập nhật về điểm chuẩn, phương thức xét tuyển"
              button="Khám phá ngay"
              onClick={() => setView("universities")}
            />
            <InfoCard 
              icon={BookOpen}
              color="text-[var(--chart-1)] bg-[var(--bg-chart-1)]"
              title="Nhóm ngành đào tạo"
              subTitle="Khám phá các nhóm ngành & cơ hội học tập theo lĩnh vực chuyên môn phù hợp với sở thích"
              button="Khám phá ngay"
              onClick={() => setView("majorGroup")}
            />
          </div>
        </div>
      )}

      {/* Universities */}
      {view === "universities" && <div></div>}

      {/* UniversitiesDetail */}
      {view === "universitiesDetail" && <div></div>}

      {/* MajorGroup */}
      {view === "majorGroup" && <div></div>}
    </div>
  );
}

