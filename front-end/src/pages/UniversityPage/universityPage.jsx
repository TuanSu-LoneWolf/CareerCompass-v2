import { useState, useEffect, useMemo } from "react";
import { Button } from "../../components/library/buttons/button.jsx";
import FilterBar from "../../components/library/searchBar + filter/filter.jsx";
import {
  InfoCard,
  UniversityCard,
  UniversityDetailCard,
} from "../../components/library/cards/card";
import { GraduationCap, BookOpen } from "lucide-react";
import { SearchBar } from "../../components/library/searchBar + filter/searchBar.jsx";

export function UniversityPage() {
  const [view, setView] = useState("entry");
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false); // ← state mới
  const [majors, setMajors] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [query, setQuery] = useState("");
  const [detailQuery, setDetailQuery] = useState("");
  const [filters, setFilters] = useState({
    score: "",
    subject: "",
    method: "",
    year: "",
  });

  useEffect(() => {
    // mỗi khi view thay đổi, scroll lên đầu trang
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  // helper: lấy năm từ chuỗi method (vd: "Xét học bạ 2023" => 2023)
  const extractYear = (method) => {
    if (!method) return null;
    const match = method.match(/\b(20\d{2})\b/); // tìm năm 20xx
    return match ? match[1] : null;
  };

  const filterConfig = useMemo(
    () => [
      {
        key: "score",
        label: "Điểm chuẩn",
        type: "select",
        options: ["Cao (>=27)", "Trung bình (24-27)", "Thấp (<24)"],
      },
      {
        key: "subject",
        label: "Tổ hợp môn",
        type: "select",
        options: [
          ...new Set(
            majors.flatMap((m) => (Array.isArray(m.subjects) ? m.subjects : []))
          ),
        ].filter(Boolean), // loại bỏ giá trị rỗng
      },
      {
        key: "method",
        label: "Phương thức",
        type: "select",
        options: [
          ...new Set(
            majors.flatMap((m) =>
              Array.isArray(m.scores)
                ? m.scores
                    .map((s) =>
                      s.method
                        ? s.method.replace(/\b(năm\s*)?20\d{2}\b/, "").trim()
                        : null
                    )
                    .filter(Boolean)
                : []
            )
          ),
        ],
      },
      {
        key: "year",
        label: "Năm",
        type: "select",
        options: [
          ...new Set(
            majors.flatMap((m) =>
              Array.isArray(m.scores)
                ? m.scores
                    .map((s) => extractYear(s.method))
                    .filter((year) => year !== null)
                : []
            )
          ),
        ],
      },
    ],
    [majors]
  );

  const totalSchools = schools.length;
  const totalMajors = schools.reduce((sum, s) => sum + s.major_count, 0);
  const displayedSchools = schools.filter((s) => s.major_count !== 0).length;

  // lọc theo tên và mã
  const filteredSchools = schools.filter((s) => {
    const q = query.toLowerCase();
    return (
      s.school_name.toLowerCase().includes(q) ||
      s.school_code.toLowerCase().includes(q)
    );
  });

  const backMap = {
    universitiesDetail: "universities",
    universities: "entry",
    majorGroup: "entry",
  };

  const goBack = () => {
    setView(backMap[view] ?? "entry");
    if (view === "universitiesDetail") {
      setMajors([]);
      setSelectedSchool(null);
    }
  };

  useEffect(() => {
    if (view === "universities") {
      setLoading(true); // bắt đầu tải
      fetch("http://localhost:5000/universities")
        .then((res) => res.json())
        .then((data) => {
          setSchools(data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false)); // kết thúc tải
    }
  }, [view]);

  return (
    <div
      className={`max-w-6xl mx-auto px-4 ${
        view === "entry" ? "lg:min-h-screen" : " "
      }`}
    >
      {/* Back Button */}
      {view !== "entry" && (
        <Button className="rounded-full my-6" onClick={goBack} back>
          Quay lại
        </Button>
      )}

      {/* Entry */}
      {view === "entry" && (
        <div className="flex flex-col justify-center items-center max-w-3xl mx-auto pb-16">
          <div className="p-16">
            <h1 className="text-3xl text-[var(--card-foreground)] text-center mb-2">
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
      {view === "universities" && (
        <>
          {loading ? (
            <div className="text-center py-20 text-lg text-[var(--muted-foreground)]">
              Đang tải danh sách trường...
            </div>
          ) : (
            <>
              {/* 3 thẻ nhỏ thống kê */}
              <div className="w-full flex flex-wrap justify-center gap-4 items-center my-10">
                <div className="flex flex-col justify-center items-center p-6 gap-2 border rounded-xl border-[var(--border)] bg-[var(--card)]">
                  <h2 className="text-[var(--primary)] text-2xl">
                    {totalSchools}
                  </h2>
                  <p className="text-[var(--muted-foreground)]">
                    Trường Đại học
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center p-6 gap-2 border rounded-xl border-[var(--border)] bg-[var(--card)]">
                  <h2 className="text-[var(--primary)] text-2xl">
                    {totalMajors}
                  </h2>
                  <p className="text-[var(--muted-foreground)]">
                    Ngành đào tạo
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center p-6 gap-2 border rounded-xl border-[var(--border)] bg-[var(--card)]">
                  <h2 className="text-[var(--primary)] text-2xl">
                    {displayedSchools}
                  </h2>
                  <p className="text-[var(--muted-foreground)]">
                    Kết quả hiển thị
                  </p>
                </div>
              </div>

              {/* Thanh tìm kiếm */}
              <SearchBar
                placeholder="Tìm theo tên hoặc mã trường..."
                onSearch={setQuery}
                className="mx-auto mb-10"
              />

              {/* Danh sách trường */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredSchools
                  .filter((school) => school.major_count !== 0)
                  .map((school) => (
                    <UniversityCard
                      key={school.school_code}
                      code={school.school_code}
                      name={school.school_name}
                      subjects={`${school.major_count} ngành đào tạo`}
                      onClick={() => {
                        fetch(
                          `http://localhost:5000/universities/${school.school_code}`
                        )
                          .then((res) => res.json())
                          .then((data) => {
                            setMajors(data);
                            setSelectedSchool(school);
                            setView("universitiesDetail");
                          });
                      }}
                    />
                  ))}
              </div>
            </>
          )}
        </>
      )}

      {view === "universitiesDetail" && selectedSchool && (
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex shrink-0 grow-0 justify-center items-center rounded-xl w-16 h-16 text-[var(--chart-1)] bg-[var(--bg-chart-1)] leading-none">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-[var(--card-foreground)] group-hover:text-[var(--secondary)] leading-tight">
                {selectedSchool.school_name}
                <span className="text-[var(--muted-foreground)] text-lg">{` (${selectedSchool.school_code})`}</span>
              </h1>
              <p className="text-[var(--muted-foreground)] text-lg">
                {`${selectedSchool.major_count} ngành đào tạo`}
              </p>
            </div>
          </div>

          {/* Thanh tìm kiếm ngành trong detail */}
          <SearchBar
            placeholder="Tìm theo tên ngành hoặc mã ngành..."
            onSearch={setDetailQuery}
          />

          {/* Thanh filter */}
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            config={filterConfig}
            data={majors}
          />

          {/* Danh sách ngành đã lọc */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {majors
              // lọc theo search
              .filter((m) => {
                const q = detailQuery.toLowerCase();
                return (
                  m.name.toLowerCase().includes(q) ||
                  (m.code && m.code.toLowerCase().includes(q))
                );
              })
              // lọc theo filter
              .filter((m) => {
                // --- Điểm ---
                const matchesScore = filters.score
                  ? m.scores.some((s) =>
                      filters.score === "Cao (>=27)"
                        ? s.score >= 27
                        : filters.score === "Trung bình (24-27)"
                        ? s.score >= 24 && s.score < 27
                        : filters.score === "Thấp (<24)"
                        ? s.score < 24
                        : true
                    )
                  : true;

                // --- Tổ hợp môn ---
                const matchesSubject = filters.subject
                  ? m.subjects.includes(filters.subject)
                  : true;

                // --- Phương thức ---
                const matchesMethod = filters.method
                  ? m.scores.some((s) =>
                      s.method
                        ?.toLowerCase()
                        .includes(filters.method.toLowerCase())
                    )
                  : true;

                // --- Năm ---
                const matchesYear = filters.year
                  ? m.scores.some((s) => s.method?.includes(filters.year))
                  : true;

                return (
                  matchesScore && matchesSubject && matchesMethod && matchesYear
                );
              })

              .map((major, i) => (
                <UniversityDetailCard
                  key={i}
                  name={major.name}
                  subjects={major.subjects}
                  scores={major.scores}
                  method={major.method}
                  year={major.year}
                />
              ))}
          </div>
        </div>
      )}

      {/* MajorGroup */}
      {view === "majorGroup" && <div></div>}

      {/* Back Button */}
      {view !== "entry" && (
        <Button
          type="outline"
          className="rounded-full mb-16 mx-auto"
          onClick={goBack}
          back
        >
          Quay lại
        </Button>
      )}
    </div>
  );
}
