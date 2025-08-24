import "./card.css";
import { Button } from "../buttons/button.jsx";
import { Link } from "react-router-dom";
import { School } from "lucide-react";

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
            className="text-[var(--secondary)] border-[var(--secondary)] hover:bg-amber-100"
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
  icon, title, subTitle, button, color, link, onClick, className = "" 
}) {
  if (!icon) return null;
  const Icon = icon;

  // Nội dung card chung
  const content = (
    <>
      <div>
        <div className="flex gap-1.5">
          <div className={`flex justify-center items-center rounded-xl w-12 h-12 mb-4 ${color}`}>
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

