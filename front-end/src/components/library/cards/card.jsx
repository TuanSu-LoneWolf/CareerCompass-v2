import "./card.css"
import Button from "../buttons/button.jsx";
import { Link } from "react-router-dom";
import { School } from "lucide-react";

// CardBase
export function CardBase({ children, className ="" }) {
  return (
    <div className={`card-base ${className}`}>
      {children}
    </div>
  );
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
          <Button type="outline" class="text-[var(--secondary)] border-[var(--secondary)] hover:bg-amber-100">Xem chi tiết ngành đào tạo</Button>
        </Link>
      </div>
    </div>
  )
}