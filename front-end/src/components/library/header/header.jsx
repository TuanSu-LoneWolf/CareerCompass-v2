import { Link } from "react-router-dom";
import Button from "../buttons/button.jsx";
import { Menu, X } from "lucide-react"; //icon Menu
import { useState } from "react"; 
import "./header.css";
import Logo from "../../../../public/Logo_CC_tron_co_chu copy.svg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <img src={Logo} alt="CareerCompass" className="h-10" />
        </Link>

        {/* Navigation */}
        <nav className="header-nav">
          <Link to="/about" className="header-link">
            About
          </Link>
          <Link to="/services" className="header-link">
            Services
          </Link>
          <Link to="/contact" className="header-link">
            Contact
          </Link>
        </nav>

        {/* Buttons (desktop only) */}
        <div className="header-actions hidden md:flex">
          <Link to="/LoginPage">
            <Button type="outline">Login</Button>
          </Link>
          <Link to="/SignUpPage">
            <Button type="primary">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="header-menu-btn md:hidden"
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
          <Link to="/about" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link to="/services" onClick={() => setIsOpen(false)}>
            Services
          </Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
        </nav>

        {/* Buttons (mobile only) */}
        <div className="flex flex-col gap-3 mt-8">
          <Button type="outline">Login</Button>
          <Button type="primary">Sign Up</Button>
        </div>
      </div>
    </header>
  );
};


export default Header;
