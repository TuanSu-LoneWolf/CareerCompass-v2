import { NavLink, Link } from "react-router-dom";
import Button from "../buttons/button.jsx";
import { Menu, X } from "lucide-react"; //icon Menu
import { useState } from "react"; 
import "./header.css";
import Logo from "../../../../public/Logo_CC_tron_co_chu copy.svg";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header fixed">
      <div className="header-container">
        {/* Logo */}
        <NavLink to="/" className="header-logo">
          <img src={Logo} alt="CareerCompass" className="h-10" />
        </NavLink>

        {/* Navigation */}
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

        {/* Buttons (desktop only) */}
        <div className="header-actions hidden lg:flex">
          <Link to="/signup">
            <Button type="outline">Đăng ký</Button>
          </Link>
          <Link to="/login">
            <Button type="primary">Đăng nhập</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="header-menu-btn lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
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
        <div className="flex justify-between items-center mb-8">
          <img src={Logo} alt="CareerCompass" className="h-10" />
          <button onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <nav className="flex flex-col gap-6">
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

        {/* Buttons (mobile only) */}
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
};