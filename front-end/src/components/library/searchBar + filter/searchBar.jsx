import { useState } from "react";
import { Search } from "lucide-react";

export function SearchBar({ placeholder = "Tìm kiếm...", onSearch, className = "" }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={`flex items-center w-full md:w-1/2 bg-[var(--card)] border border-[var(--border)] rounded-2xl px-4 py-2 mb-4 ${className}`}>
      <Search className="text-[var(--muted-foreground)] w-5 h-5 mr-2" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full outline-none"
        value={query}
        onChange={handleChange}
      />
    </div>
  );
}
