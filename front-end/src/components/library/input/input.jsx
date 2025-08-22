// Input.jsx
import { useState } from "react";
import { Search, Lock, User, Eye, EyeOff, Mail } from "lucide-react";

export function Input({
  label,
  forgotPassword,
  type = "text",
  name,
  placeholder = "Nhập...",
  variant = "primary", // "primary" | "secondary"
  iconLeft,
  iconRight,
  disabled,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const base =
    "w-full px-3 py-2 rounded-lg border outline-none transition text-gray-700 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center gap-2";

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

  return (
    <div className="flex flex-col w-full mb-2">
      {label && (
        <label htmlFor={name} className={`mb-1 text-sm font-medium ${error ? "text-red-500" : "text-[var(--primary)]"} flex justify-between`}>
          {label}
          {forgotPassword && (
            <a
              href="/"
              className="text-sm hover:underline"
            >
              Quên mật khẩu?
            </a>
          )}
        </label>
      )}

      <div className="relative flex items-center bg-[var(--input)] border-[var(--border)] rounded-lg">
        {IconLeft && (
          <IconLeft className="absolute left-3 text-gray-400 w-4 h-4 pointer-events-none" />
        )}
        <input
          id={name}
          name={name}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          disabled={disabled}
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
              <EyeOff className="w-4 h-4 hover:text-[var(--secondary)]" />
            ) : (
              <Eye className="w-4 h-4 hover:text-[var(--secondary)]" />
            )}
          </button>
        ) : (
          IconRight && (
            <IconRight className="absolute right-3 text-gray-400 w-5 h-5 pointer-events-none" />
          )
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}


export function Demo() {
  return (
    <div className="space-y-4 max-w-md mx-auto p-4">
      {/* Text Input Primary */}
      <Input type="text" placeholder="Họ và tên" variant="primary" iconLeft={User} />

      {/* Mail Input */}
      <Input type="email" placeholder="Địa chỉ email" variant="primary" iconLeft={Mail}></Input>

      {/* Password Input Secondary */}
      <Input type="password" placeholder="Mật khẩu" variant="primary" iconLeft={Lock} />

      {/* Search Input Primary */}
      <Input type="search" placeholder="Tìm kiếm..." variant="primary" iconRight={Search} />

      {/* Disabled Input */}
      <Input type="text" placeholder="Không nhập được" disabled variant="secondary" />
    </div>
  );
}

