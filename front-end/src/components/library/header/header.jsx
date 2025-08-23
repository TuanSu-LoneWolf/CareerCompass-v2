import { NavLink, Link } from "react-router-dom";
import { Button } from "../buttons/button.jsx";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react"; 
import "./header.css";
import Logo from "../../../assets/Logo_CC_tron_co_chu.svg";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Dark mode: mặc định sync với system
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia &&
           window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Add/remove class "dark" vào <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Lắng nghe system theme thay đổi
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setDarkMode(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <header className="header sticky top-0 z-50">
      <div className="header-container">
        {/* Logo */}
        <NavLink to="/" className="header-logo">
          <img src={Logo} alt="CareerCompass" className="h-10" />
        </NavLink>

        {/* Navigation */}
        <nav className="header-nav">
          <NavLink to="/" className="header-link">Trang chủ</NavLink>
          <NavLink to="/universities-majors" className="header-link">Danh sách Đại học</NavLink>
          <NavLink to="/career-guidance" className="header-link">Hướng nghiệp</NavLink>
          <NavLink to="/interview-practice" className="header-link">Luyện phỏng vấn</NavLink>
          <NavLink to="/cv-check" className="header-link">Kiểm tra CV</NavLink>
        </nav>

        {/* Actions (desktop) */}
        <div className="header-actions hidden lg:flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full transition cursor-pointer"
          >
            {darkMode
              ? <Sun className="w-5 h-5 text-yellow-400" />
              : <Moon className="w-5 h-5 text-gray-700" />}
          </button>
          <Link to="/signup">
            <Button type="outline">Đăng ký</Button>
          </Link>
          <Link to="/login">
            <Button type="primary">Đăng nhập</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full transition cursor-pointer"
          >
            {darkMode
              ? <Sun className="w-5 h-5 text-yellow-400" />
              : <Moon className="w-5 h-5 text-gray-700" />}
          </button>
          <button
            className="header-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen
              ? <X className="w-6 h-6 text-[--foreground]" />
              : <Menu className="w-6 h-6 text-[--foreground]" />}
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="header-backdrop md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Off-canvas mobile menu */}
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

        {/* Actions (mobile) */}
        <div className="flex flex-col gap-3 mt-8">
          <Link to="/signup">
            <Button type="outline" className="w-full">Đăng ký</Button>
          </Link>
          <Link to="/login">
            <Button type="primary" className="w-full">Đăng nhập</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
