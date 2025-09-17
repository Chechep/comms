import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Glow only in dark mode
  const glowStyle = darkMode
    ? { boxShadow: "0 0 10px var(--color-brand), 0 0 20px var(--color-brand)" }
    : {};

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Solutions", path: "/solutions" },
    { name: "Contact", path: "/contact" },
  ];

  const buttonClass =
    "px-4 py-2 text-sm font-medium rounded-lg border transition transform duration-200 focus:outline-none hover:scale-110 hover:animate-shake";

  return (
    <nav className="fixed w-full z-50 top-0 backdrop-blur-md bg-[var(--color-bg)]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold drop-shadow-lg"
            style={{ color: "var(--color-text)" }}
          >
            Comms
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="transition font-medium hover:scale-110 hover:animate-shake"
                style={{ color: "var(--color-text)" }}
              >
                {item.name}
              </Link>
            ))}

            {/* Login */}
            <Link
              to="/login"
              className={`${buttonClass}`}
              style={{
                color: "var(--color-text)",
                borderColor: "var(--color-text)",
                ...glowStyle,
              }}
            >
              Login
            </Link>

            {/* Signup */}
            <Link
              to="/signup"
              className={`${buttonClass}`}
              style={{
                color: "var(--color-text)",
                borderColor: "var(--color-text)",
                ...glowStyle,
              }}
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none hover:scale-110 hover:animate-shake"
              style={{ color: "var(--color-text)" }}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden shadow-lg px-4 pb-4 space-y-2 rounded-b-xl transition bg-[var(--color-bg)]/90 backdrop-blur-md">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block py-2 rounded transition font-medium hover:scale-110 hover:animate-shake"
              style={{ color: "var(--color-text)" }}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex flex-col space-y-2 mt-2">
            <Link
              to="/login"
              className={`${buttonClass} text-center`}
              style={{
                color: "var(--color-text)",
                borderColor: "var(--color-text)",
                ...glowStyle,
              }}
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`${buttonClass} text-center`}
              style={{
                color: "var(--color-text)",
                borderColor: "var(--color-text)",
                ...glowStyle,
              }}
              onClick={() => setIsOpen(false)}
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
