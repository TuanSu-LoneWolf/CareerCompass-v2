import { NavLink, Link } from "react-router-dom";
import { Button } from "../buttons/button.jsx";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import "./header.css";
import Logo from "../../../assets/Logo_CC_tron_co_chu.svg";
import { useAuth } from "../../../context/AuthContext.jsx";

export function Header() {
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // avatar dropdown
  const dropdownRef = useRef(null);

  const { user, userDetails, logout } = useAuth();

  // avatar nguồn (fallbacks)
  const avatarSrc =
    user?.photoURL || userDetails?.photo || "/default-avatar.png";

  // Dark mode (giữ logic hiện tại của bạn)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header sticky top-0 z-50">
      <div className="header-container">
        {/* Logo app (trái) */}
        <NavLink
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          to="/"
          className="header-logo"
        >
          <img src={Logo} alt="CareerCompass" className="h-10" />
        </NavLink>

        {/* Navigation (giữa) */}
        <nav className="header-nav">
          <NavLink to="/" className="header-link">
            Trang chủ
          </NavLink>
          <NavLink to="/universities-majors" className="header-link">
            Danh sách Đại học
          </NavLink>
          <NavLink to="/career-guidance" className="header-link">
            Hướng nghiệp
          </NavLink>
          <NavLink to="/interview-practice" className="header-link">
            Luyện phỏng vấn
          </NavLink>
          <NavLink to="/cv-check" className="header-link">
            Kiểm tra CV
          </NavLink>
        </nav>

        {/* Actions (phải, desktop) */}
        <div className="header-actions hidden lg:flex items-center gap-3">
          {/* dark toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full transition cursor-pointer"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* Nếu đã login: hiện avatar + dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* avatar button */}
              <button
                onClick={() => setDropdownOpen((s) => !s)}
                className="flex items-center focus:outline-none"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                title={user.displayName || user.email}
              >
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
              </button>

              {/* dropdown: căn giữa theo avatar */}
              {dropdownOpen && (
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 mt-3 w-44 rounded-xl shadow-lg z-50
                    ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}
                >
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm rounded-t-xl ${
                      darkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    Trang cá nhân
                  </Link>
                  <button
                    onClick={() => {
                      logout?.();
                      setDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-b-xl ${
                      darkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            // nếu chưa login: show buttons
            <>
              <Link to="/signup">
                <Button type="outline">Đăng ký</Button>
              </Link>
              <Link to="/login">
                <Button type="primary">Đăng nhập</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full transition cursor-pointer"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          <button
            className="header-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6 text-[--foreground]" /> : <Menu className="w-6 h-6 text-[--foreground]" />}
          </button>
        </div>
      </div>

      {/* Backdrop (mobile) */}
      {isOpen && <div className="header-backdrop md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Mobile off-canvas */}
      <div className={`header-mobile ${isOpen ? "open" : ""} md:hidden`}>
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-[var(--border)]">
          <img src={Logo} alt="CareerCompass" className="h-10" />
          <button onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6 text-[--foreground]" />
          </button>
        </div>

        <nav className="flex flex-col gap-6">
          <NavLink to="/" className="header-link">Trang chủ</NavLink>
          <NavLink to="/universities-majors" className="header-link">Danh sách Đại học</NavLink>
          <NavLink to="/career-guidance" className="header-link">Hướng nghiệp</NavLink>
          <NavLink to="/interview-practice" className="header-link">Luyện phỏng vấn</NavLink>
          <NavLink to="/cv-check" className="header-link">Kiểm tra CV</NavLink>
        </nav>

        <div className="flex flex-col gap-3 mt-8">
          {user ? (
            <>
              <Link to="/profile">
                <Button type="outline" className="w-full">Trang cá nhân</Button>
              </Link>
              <Button type="primary" className="w-full" onClick={logout}>Đăng xuất</Button>
            </>
          ) : (
            <>
              <Link to="/signup"><Button type="outline" className="w-full">Đăng ký</Button></Link>
              <Link to="/login"><Button type="primary" className="w-full">Đăng nhập</Button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
