// Input.jsx
import { useState } from "react";
import { Search, Lock, User, Eye, EyeOff, Mail } from "lucide-react";

export function Input({
  label,
  forgotPassword,
  type = "text",
  name,
  placeholder = "Nhập...",
  variant = "primary",
  iconLeft,
  iconRight,
  disabled,
  error,
  rows = 4,
  value, // thêm
  onChange, // thêm
}) {
  const [showPassword, setShowPassword] = useState(false);

  const base =
    "w-full px-3 py-2 rounded-lg border outline-none transition text-[var(--input-foreground)] placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center gap-2";

  const variants = {
    primary:
      "border-[var(--border)] focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
    secondary:
      "border-[var(--border)] focus:border-orange-500 focus:ring-2 focus:ring-orange-200",
  };

  const errorStyle = "border-red-500 focus:border-red-500 focus:ring-red-200";

  const IconLeft = iconLeft;
  const IconRight = iconRight;

  const isPassword = type === "password";
  const isTextarea = type === "textarea";

  return (
    <div className="flex flex-col w-full mb-2">
      {label && (
        <label
          htmlFor={name}
          className={`mb-1 text-sm font-medium ${
            error ? "text-red-500" : "text-[var(--primary)]"
          } flex justify-between`}
        >
          {label}
          {forgotPassword && (
            <a href="/" className="text-sm hover:underline">
              Quên mật khẩu?
            </a>
          )}
        </label>
      )}

      <div className="relative flex items-center bg-[var(--input)] border-[var(--border)] text-[var(--input-foreground)] rounded-lg">
        {IconLeft && !isTextarea && (
          <IconLeft className="absolute left-3 text-gray-400 w-4 h-4 pointer-events-none" />
        )}

        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            value={value} // bind value
            onChange={onChange} // bind onChange
            className={`${base} ${
              error ? errorStyle : variants[variant]
            } resize-none`}
          />
        ) : (
          <>
            <input
              id={name}
              name={name}
              type={isPassword ? (showPassword ? "text" : "password") : type}
              placeholder={placeholder}
              disabled={disabled}
              value={value} // bind value
              onChange={onChange} // bind onChange
              className={`${base} ${error ? errorStyle : variants[variant]} ${
                IconLeft ? "pl-10" : ""
              } ${IconRight || isPassword ? "pr-10" : ""}`}
            />
            {isPassword ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 hover:text-[var(--secondary)] cursor-pointer" />
                ) : (
                  <Eye className="w-4 h-4 hover:text-[var(--secondary)] cursor-pointer" />
                )}
              </button>
            ) : (
              IconRight && (
                <IconRight className="absolute right-3 text-gray-400 w-5 h-5 pointer-events-none" />
              )
            )}
          </>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function SearchBar({ onSearch }) {
  return (
    <div className="flex items-center w-full max-w-xl bg-[var(--card)] border border-[var(--border)] rounded-2xl px-4 py-2 mb-10 mx-auto">
      <Search className="text-[var(--muted-foreground)] w-5 h-5 mr-2" />
      <input
        type="text"
        placeholder="Tìm kiếm theo tên hoặc mã trường..."
        className="w-full outline-none"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}

// ✅ StudentLevelRadio.jsx
export function StudentLevelRadio({ value, onChange, error }) {
  const baseStyle =
    "px-4 py-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-all";
  const activeStyle = "text-[var(--primary)]";
  const inactiveStyle =
    "bg-[var(--input)] border-[var(--border)] text-[var(--input-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]";
  const errorStyle = "border-red-500 text-red-500";

  return (
    <div className="flex flex-col w-full mb-2">
      <label
        className={`mb-1 text-sm font-medium ${
          error ? "text-red-500" : "text-[var(--primary)]"
        }`}
      >
        Bạn là học sinh{" "}
        <span className={error ? "text-red-500" : "text-[var(--primary)]"}>
          *
        </span>
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Học sinh cấp 2 */}
        <label
          className={`${baseStyle} ${
            value === "cap2" ? activeStyle : inactiveStyle
          } ${error ? errorStyle : ""}`}
        >
          <input
            type="radio"
            name="hoc-sinh"
            value="cap2"
            checked={value === "cap2"}
            onChange={() => onChange?.("cap2")}
            className="w-4 h-4"
          />
          Học sinh cấp 2
        </label>

        {/* Học sinh cấp 3 */}
        <label
          className={`${baseStyle} ${
            value === "cap3" ? activeStyle : inactiveStyle
          } ${error ? errorStyle : ""}`}
        >
          <input
            type="radio"
            name="hoc-sinh"
            value="cap3"
            checked={value === "cap3"}
            onChange={() => onChange?.("cap3")}
            className="w-4 h-4"
          />
          Học sinh cấp 3
        </label>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

// ✅ Radio.jsx
export function Radio({ label, options, value, name, onChange, error }) {
  const baseStyle =
    "px-4 py-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-all";
  const activeStyle = "text-[var(--primary)]";
  const inactiveStyle =
    "bg-[var(--input)] border-[var(--border)] text-[var(--input-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]";
  const errorStyle = "border-red-500 text-red-500";

  return (
    <div className="flex flex-col w-full mb-2">
      <label
        className={`mb-1 text-sm font-medium ${
          error ? "text-red-500" : "text-[var(--primary)]"
        }`}
      >
        {label}{" "}
        <span className={error ? "text-red-500" : "text-[var(--primary)]"}>
          *
        </span>
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        {options.map((opt) => (
          <label
            key={opt.key}
            className={`${baseStyle} ${
              value === opt.key ? activeStyle : inactiveStyle
            } ${error ? errorStyle : ""}`}
          >
            <input
              type="radio"
              name={name || label}
              value={opt.key}
              checked={value === opt.key}
              onChange={() => onChange?.(opt.key)}
              className="w-4 h-4"
            />
            {opt.value}
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function Demo() {
  return (
    <div className="space-y-4 max-w-md mx-auto p-4">
      {/* Text Input Primary */}
      <Input
        type="text"
        placeholder="Họ và tên"
        variant="primary"
        iconLeft={User}
      />

      {/* Mail Input */}
      <Input
        type="email"
        placeholder="Địa chỉ email"
        variant="primary"
        iconLeft={Mail}
      ></Input>

      {/* Password Input Secondary */}
      <Input
        type="password"
        placeholder="Mật khẩu"
        variant="primary"
        iconLeft={Lock}
      />

      {/* Search Input Primary */}
      <Input
        type="search"
        placeholder="Tìm kiếm..."
        variant="primary"
        iconRight={Search}
      />

      {/* Disabled Input */}
      <Input
        type="text"
        placeholder="Không nhập được"
        disabled
        variant="secondary"
      />

      {/* ✅ Radio Input */}
      <StudentLevelRadio />
    </div>
  );
}
