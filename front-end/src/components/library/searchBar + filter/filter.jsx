import { useState } from "react";
import { Filter, ChevronDown, Check } from "lucide-react";

export default function FilterBar({ filters, setFilters, config }) {
  const [openKey, setOpenKey] = useState(null);
  const [hoverValue, setHoverValue] = useState(null);

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setOpenKey(null);
    setHoverValue(null);
  };

  return (
    <div className="flex items-center flex-wrap gap-3 mb-6 relative">
      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
        <Filter className="w-4 h-4" />
        <span>Bộ lọc:</span>
      </div>

      {config.map((f) => (
        <div key={f.key} className="relative min-w-[160px]">
          <button
            onClick={() => setOpenKey(openKey === f.key ? null : f.key)}
            className="flex items-center justify-between gap-2 w-full px-4 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm"
          >
            {filters[f.key] || f.placeholder || `Tất cả ${f.label.toLowerCase()}`}
            <ChevronDown className="w-4 h-4" />
          </button>

          {openKey === f.key && (
            <div
              className="absolute z-20 mt-2 w-full bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden"
              onMouseLeave={() => setHoverValue(null)}
            >
              {/* Option mặc định */}
              <div
                onClick={() => handleChange(f.key, "")}
                onMouseEnter={() => setHoverValue("")}
                className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer
                  ${
                    hoverValue === "" || (filters[f.key] === "" && hoverValue === null)
                      ? "bg-[var(--secondary)] text-[var(--filter-hover)]"
                      : "bg-[var(--card)] text-[var(--muted-foreground)]"
                  }
                `}
              >
                {f.placeholder || `Tất cả ${f.label.toLowerCase()}`}
                {filters[f.key] === "" && <Check className="w-4 h-4" />}
              </div>

              {/* Các option khác */}
              {f.options?.map((opt, i) => {
                const isSelected = filters[f.key] === opt;
                const isHover = hoverValue === opt;

                return (
                  <div
                    key={i}
                    onClick={() => handleChange(f.key, opt)}
                    onMouseEnter={() => setHoverValue(opt)}
                    className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer
                      ${
                        isHover || (isSelected && hoverValue === null)
                          ? "bg-[var(--accent)] text-[var(--filter-hover)]"
                          : "bg-[var(--card)] text-[var(--muted-foreground)]"
                      }
                    `}
                  >
                    {opt}
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
