import "./card.css";
import { Button } from "../buttons/button.jsx";
import { Link } from "react-router-dom";
import { School, GraduationCap, BookOpen, Layers, MapPin } from "lucide-react";

// CardBase
export function CardBase({ children, className = "" }) {
  return <div className={`card-base ${className}`}>{children}</div>;
}

// SchoolCard
export function SchoolCard({ name, code, majorsCount }) {
  return (
    <div className="card-base flex flex-col gap-3 items-start w-fit justify-between min-h-[220px] max-w-[350px]">
      <div className="flex gap-4">
        <div className="flex items-center">
          <div className="flex justify-center items-center bg-amber-50 border-1 border-[--secondary] rounded-full w-15 h-15 text-[var(--secondary)] leading-none font-bold text-3xl">
            <School className="w-8 h-8"></School>
          </div>
        </div>
        <div>
          <h2 className="text-[var(--primary)]">{name}</h2>
          <p className="font-bold">Mã trường: {code}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <Button type="primary">{majorsCount} ngành đào tạo</Button>
        <Link to="/">
          <Button
            type="outline"
            className="text-[var(--secondary)] -[var(--secondary)] hover:bg-amber-100"
          >
            Xem chi tiết ngành đào tạo
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Info card
export function InfoCard({
  icon,
  title,
  subTitle,
  button,
  color,
  link,
  onClick,
  className = "",
}) {
  if (!icon) return null;
  const Icon = icon;

  // Nội dung card chung
  const content = (
    <>
      <div>
        <div className="flex gap-1.5">
          <div
            className={`flex justify-center items-center rounded-xl w-12 h-12 mb-4 ${color}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h4 className="text-[var(--card-foreground)] group-hover:text-[var(--secondary)] mb-2">
            {title}
          </h4>
          <p className="text-[var(--muted-foreground)]">{subTitle}</p>
        </div>
      </div>
      <Button type="primary" className="z-20 w-full" start>
        {button}
      </Button>
    </>
  );

  // Ưu tiên link > onClick > fallback
  if (link) {
    return (
      <Link
        to={link}
        className={`card zoom justify-between cursor-pointer hover:shadow-xl transition-all flex flex-col gap-6 p-6 border border-[var(--border)] rounded-xl group hover:border-[rgb(245,158,11,0.3)] bg-[var(--card)] z-10 ${className}`}
      >
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div
        onClick={onClick}
        className={`card zoom justify-between cursor-pointer hover:shadow-xl transition-all flex flex-col gap-6 p-6 border border-[var(--border)] rounded-xl group hover:border-[rgb(245,158,11,0.3)] bg-[var(--card)] z-10 ${className}`}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={`card zoom flex flex-col gap-6 p-6 border rounded-xl ${className}`}
    >
      {content}
    </div>
  );
}

// University detail cards
export function UniversityDetailCard({
  name,
  subjects,
  scores,
  className = "",
}) {
  return (
    <div
      className={`card zoom justify-between cursor-pointer hover:shadow-xl transition-all flex flex-col gap-2 p-6 border border-[var(--border)] rounded-xl group hover:border-[rgb(245,158,11,0.3)] bg-[var(--card)] z-10 ${className}`}
    >
      <div className="flex shrink-0 gap-4 items-center mb-4">
        <div className="flex shrink-0 grow-0 justify-center items-center rounded-xl w-12 h-12 text-[var(--chart-1)] bg-[var(--bg-chart-1)] leading-none">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-[var(--card-foreground)] group-hover:text-[var(--secondary)] leading-tight">
            {name}
          </h4>
          {scores.map(
            (s, i) =>
              s.note && (
                <p
                  key={`note-${s.year}-${i}`}
                  className="text-[var(--muted-foreground)]"
                >
                  {s.note || "-"}
                </p>
              )
          )}
        </div>
      </div>
      <div>
        {Array.isArray(subjects) && subjects.some((s) => s.trim() !== "") && (
          <p className="text-[var(--muted-foreground)]">
            <strong>Tổ hợp môn:</strong>{" "}
            {subjects.filter((s) => s.trim() !== "").join(", ")}
          </p>
        )}

        {scores.map((s, i) => (
          <div key={`score-${s.year}-${s.method}-${i}`}>
            <p className="text-[var(--muted-foreground)]">
              <strong>Điểm chuẩn:</strong> {s.score}
            </p>
            <p className="text-[var(--muted-foreground)]">
              <strong>Phương thức:</strong> {s.method}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// University cards
export function UniversityCard({
  name,
  code,
  subjects,
  location,
  onClick,
  className = "",
}) {
  return (
    <div
      onClick={onClick}
      className={`card zoom justify-between cursor-pointer hover:shadow-xl transition-all flex flex-col gap-6 p-6 border border-[var(--border)] rounded-xl group hover:border-[rgb(245,158,11,0.3)] bg-[var(--card)] z-10 ${className}`}
    >
      <div className="flex flex-col justify-between">
        <div className="flex shrink-0 gap-4 items-center mb-4">
          <div className="flex shrink-0 grow-0 justify-center items-center rounded-xl w-12 h-12 text-[var(--chart-1)] bg-[var(--bg-chart-1)] leading-none">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-[var(--card-foreground)] group-hover:text-[var(--secondary)] leading-tight">
              {name}
            </h4>
            <p className="text-[var(--muted-foreground)]">{code}</p>
          </div>
        </div>
        <div>
          {subjects && (
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--muted-foreground)]"></Layers>
              <p className="text-[var(--muted-foreground)]">{subjects}</p>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--muted-foreground)]"></MapPin>
              <p className="text-[var(--muted-foreground)]">{subjects}</p>
            </div>
          )}
        </div>
      </div>
      <Button type="primary" className="z-20 w-full" start>
        Xem các ngành đào tạo
      </Button>
    </div>
  );
}

// MBTI cards
export function MBTICard() {
  return (
    <div className="mt-6">
      <div className="card w-full p-6 flex flex-col gap-4 bg-[var(--card)] rounded-[var(--radius)] mt-6">
        <div>
          <p className="text-[var(--muted-foreground)] text-lg">
            1. Ở bữa tiệc bạn thường
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[var(--primary)] text-center max-w-56">
            Nói chuyện với nhiều người, kể cả người lạ
          </p>
          <div className="">
            <div className="flex items-center gap-2">
              <button className="flex-none flex justify-center items-center border-2 border-[var(--primary)] w-10 h-10 rounded-full"></button>
              <button className="flex-none flex justify-center items-center border-2 border-[var(--primary)] w-8 h-8 rounded-full"></button>
              <button className="flex-none flex justify-center items-center border-2 border-[var(--primary)] w-6 h-6 rounded-full"></button>
              <button className="flex-none flex justify-center items-center border-2 border-[var(--secondary)] w-6 h-6 rounded-full"></button>
              <button className="flex-none flex justify-center items-center border-2 border-[var(--secondary)] w-8 h-8 rounded-full"></button>
              <button className="flex-none flex justify-center items-center border-2 border-[var(--secondary)] w-10 h-10 rounded-full"></button>
            </div>
          </div>
          <p className="text-[var(--secondary)] text-center max-w-56">
            Nói chuyện với số ít những người quen thân
          </p>
        </div>
      </div>
    </div>
  );
}

// Method card
export function MethodCard({
  icon,
  bgColor,
  textColor,
  title,
  subTitle,
  benefits,
  onClick,
  key,
  isSelected
}) {
  const Icon = icon;

  return (
    <div
      key={key}
      onClick={onClick}
      className={`cursor-pointer zoom card bg-[var(--card)] rounded-[var(--radius)] max-w-sm p-6 flex flex-col gap-4 items-center border border-[var(--border)] justify-between ${isSelected ? "scale-105 border-[var(--secondary)]" : ""}`}
    >
      <div
        className={`flex justify-center items-center w-12 h-12 rounded-[var(--radius)] bg-[var(${bgColor})] text-[var(${textColor})]`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex gap-2 flex-col items-center">
        <h3 className={`text-[var(${textColor})] text-center`}>{title}</h3>
        <p className="text-[var(--muted-foreground)] text-center">{subTitle}</p>
      </div>
      <div
        className={`flex flex-col gap-1 bg-[var(${bgColor})] w-full p-4 rounded-[var(--radius)]`}
      >
        <h4 className={`text-[var(${textColor})] text-[14px]`}>
          Những lợi ích:
        </h4>
        <ul className="list-disc list-inside">
          {benefits.map((benefit, index) => (
              <li key={index} className={`text-[var(${textColor})]`}>
                {benefit}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
