import { useState, useEffect, useMemo } from "react";
import { Button } from "../../components/library/buttons/button.jsx";
import FilterBar from "../../components/library/searchBar + filter/filter.jsx";
import {
  InfoCard,
  UniversityCard,
  UniversityDetailCard,
  MajorDetailCard
} from "../../components/library/cards/card";
import { GraduationCap, BookOpen } from "lucide-react";
import { SearchBar } from "../../components/library/searchBar + filter/searchBar.jsx";

export function UniversityPage() {
  const [view, setView] = useState("entry");
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false); // ← state mới
  const [majors, setMajors] = useState([]);
  const [majorGroups, setMajorGroups] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedMajorGroup, setSelectedMajorGroup] = useState(null);
  const [query, setQuery] = useState("");
  const [detailQuery, setDetailQuery] = useState("");
  const [filters, setFilters] = useState({
    score: "",
    subject: "",
    method: "",
    year: "",
  });

  useEffect(() => {
    setQuery("");
    setDetailQuery("");
    setFilters({
      score: "",
      subject: "",
      method: "",
      year: "",
    });
  }, [view]);

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

  const majorFilterConfig = useMemo(
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
        ].filter(Boolean),
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
                      s.method?.replace(/\b(năm\s*)?20\d{2}\b/, "").trim()
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
                ? m.scores.map((s) => extractYear(s.method)).filter(Boolean)
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
    const name = (s.school_name || "").toLowerCase();
    const code = (s.school_code || "").toLowerCase();
    return name.includes(q) || code.includes(q);
  });

  const backMap = {
    universitiesDetail: "universities",
    universities: "entry",
    majorGroup: "entry",
  };

  const goBack = () => {
    setView(backMap[view] ?? "entry");
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (view === "universitiesDetail") {
      setMajors([]);
      setSelectedSchool(null);
    }
  };

  // chỉ fetch 1 lần khi component mount
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/universities")
      .then((res) => res.json())
      .then((data) => {
        setSchools(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []); // ← [] thay vì [view]

  useEffect(() => {
    fetch("http://localhost:5001/major-groups")
      .then((res) => res.json())
      .then((data) => setMajorGroups(data))
      .catch((err) => console.error("Lỗi khi load nhóm ngành:", err));
  }, []);

  console.log("VIEW:", view);
  console.log("MAJOR GROUPS:", majorGroups);

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
              onClick={() => {
                setView("universities");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
            <InfoCard
              icon={BookOpen}
              color="text-[var(--chart-1)] bg-[var(--bg-chart-1)]"
              title="Nhóm ngành đào tạo"
              subTitle="Khám phá các nhóm ngành & cơ hội học tập theo lĩnh vực chuyên môn phù hợp với sở thích"
              button="Khám phá ngay"
              onClick={() => {
                setView("majorGroup");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
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
                            window.scrollTo({ top: 0, behavior: "smooth" });
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
                const q = (detailQuery || "").toLowerCase();
                const name = (m.name || "").toLowerCase();
                const code = (m.code || "").toLowerCase();

                return name.includes(q) || code.includes(q);
              })
              // lọc theo filter
              .filter((m) => {
                // --- Điểm ---
                const matchesScore = filters.score
                  ? m.scores.some((s) => {
                      const score = parseFloat(s.score) || 0; // ép số cho chắc
                      return filters.score === "Cao (>=27)"
                        ? score >= 27
                        : filters.score === "Trung bình (24-27)"
                        ? score >= 24 && score < 27
                        : filters.score === "Thấp (<24)"
                        ? score < 24
                        : true;
                    })
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

              .map((major, i) => {
                const safeName = (major.name || "")
                  .replace(/\s+/g, "_")
                  .slice(0, 80);
                const yearPart =
                  (major.scores && major.scores[0] && major.scores[0].year) ||
                  "";
                const majorKey = `${safeName}-${yearPart}-${i}`;

                return (
                  <UniversityDetailCard
                    key={majorKey}
                    name={major.name}
                    subjects={major.subjects}
                    scores={major.scores}
                    method={major.method}
                    year={major.year}
                  />
                );
              })}
          </div>
        </div>
      )}

      {/* MajorGroup */}
      {/* MajorGroup: danh sách nhóm ngành */}
      {view === "majorGroup" && (
        <div className="pb-20">
          <h1 className="text-3xl text-[var(--card-foreground)] text-center mb-2">
            Nhóm ngành đào tạo
          </h1>
          <p className="text-[var(--muted-foreground)] text-center mb-8">
            Chọn một nhóm ngành để xem các ngành học chi tiết
          </p>

          {majorGroups.length === 0 ? (
            <div className="text-center py-10 text-[var(--muted-foreground)]">
              Đang tải dữ liệu...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {majorGroups.map((group) => (
                <InfoCard
                  icon={BookOpen}
                  color="text-[var(--primary)] bg-[var(--bg-chart-1)]"
                  key={group.nhom_nganh}
                  title={group.nhom_nganh}
                  subTitle="Xem các ngành đào tạo"
                  button="Khám phá"
                  onClick={() => {
                    setLoading(true);
                    fetch(
                      `http://localhost:5001/major-groups/${encodeURIComponent(
                        group.nhom_nganh
                      )}`
                    )
                      .then((res) => res.json())
                      .then((data) => {
                        setMajors(data.danh_sach_nganh || []);
                        setSelectedMajorGroup(data.nhom_nganh);
                        setView("majorList");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      })
                      .catch((err) => console.error(err))
                      .finally(() => setLoading(false));
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* MajorList: danh sách ngành trong nhóm */}
      {view === "majorList" && selectedMajorGroup && (
        <div className="pb-20">
          <h1 className="text-3xl text-[var(--card-foreground)] text-center mb-4">
            {selectedMajorGroup}
          </h1>

          {/* Thanh tìm kiếm ngành */}
          <SearchBar
            placeholder="Tìm theo tên ngành..."
            onSearch={setDetailQuery}
            className="mx-auto mb-6 max-w-3xl"
          />

          {/* Bộ lọc ngành */}
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            config={majorFilterConfig}
            data={majors}
          />

          {/* Grid danh sách ngành */}
          {loading ? (
            <div className="text-center py-10 text-[var(--muted-foreground)]">
              Đang tải danh sách ngành...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {majors
                // Search theo tên ngành
                .filter((m) =>
                  (m.ten_nganh || "")
                    .toLowerCase()
                    .includes((detailQuery || "").toLowerCase())
                )
                // Filter theo score, subject, method, year
                .filter((m) => {
                  const matchesScore = filters.score
                    ? m.scores?.some((s) => {
                        const score = parseFloat(s.score) || 0;
                        return filters.score === "Cao (>=27)"
                          ? score >= 27
                          : filters.score === "Trung bình (24-27)"
                          ? score >= 24 && score < 27
                          : filters.score === "Thấp (<24)"
                          ? score < 24
                          : true;
                      })
                    : true;

                  const matchesSubject = filters.subject
                    ? m.subjects?.includes(filters.subject)
                    : true;

                  const matchesMethod = filters.method
                    ? m.scores?.some((s) =>
                        s.method
                          ?.toLowerCase()
                          .includes(filters.method.toLowerCase())
                      )
                    : true;

                  const matchesYear = filters.year
                    ? m.scores?.some((s) => s.method?.includes(filters.year))
                    : true;

                  return (
                    matchesScore &&
                    matchesSubject &&
                    matchesMethod &&
                    matchesYear
                  );
                })
                .map((major, i) => (
                  <InfoCard
                    key={i}
                    color="text-[var(--primary)] bg-[var(--bg-chart-1)]"
                    title={major.ten_nganh}
                    subTitle={`${major.tong_so_truong} trường`}
                    button="Xem trường"
                    icon={BookOpen}
                    onClick={() => {
                      setLoading(true);
                      fetch(
                        `http://localhost:5001/majors/${encodeURIComponent(
                          selectedMajorGroup
                        )}/${encodeURIComponent(major.ten_nganh)}`
                      )
                        .then((res) => res.json())
                        .then((data) => {
                          setSchools(data.truong || []);
                          setView("schoolList");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        })
                        .catch((err) => console.error(err))
                        .finally(() => setLoading(false));
                    }}
                  />
                ))}
            </div>
          )}
        </div>
      )}

      {/* SchoolList: danh sách trường theo ngành */}
      {view === "schoolList" && (
        <div className="pb-20">
          <h1 className="text-3xl text-[var(--card-foreground)] text-center mb-8">
            Danh sách trường
          </h1>

          {loading ? (
            <div className="text-center py-10 text-[var(--muted-foreground)]">
              Đang tải danh sách trường...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schools.map((school, i) => (
                <MajorDetailCard
                  key={i}
                  name={school.ten_truong}
                  subjects={school.to_hop_mon}
                  score={school.diem_chuan_2024}
                  score2={school.diem_chuan_2023}
                />
              ))}
            </div>
          )}
        </div>
      )}

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
