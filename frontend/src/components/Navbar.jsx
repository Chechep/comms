import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Glow only in dark mode
  const glowStyle = darkMode
    ? { boxShadow: "0 0 10px #fff, 0 0 20px #fff" }
    : {};

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Solutions", path: "/solutions" },
    { name: "Contact", path: "/contact" },
  ];

  const buttonClass =
    "px-4 py-2 text-sm font-medium rounded-lg border border-white text-white transition transform duration-200 focus:outline-none hover:scale-110 hover:animate-shake";

  return (
    <nav className="fixed w-full z-50 top-0 backdrop-blur-md bg-transparent text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white drop-shadow-lg">
            Comms
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="transition font-medium text-white hover:scale-110 hover:animate-shake"
              >
                {item.name}
              </Link>
            ))}

            {/* Login */}
            <Link
              to="/login"
              className={buttonClass}
              style={glowStyle}
            >
              Login
            </Link>

            {/* Signup */}
            <Link
              to="/signup"
              className={buttonClass}
              style={glowStyle}
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none text-white hover:scale-110 hover:animate-shake"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden shadow-lg px-4 pb-4 space-y-2 bg-black/80 rounded-b-xl">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block py-2 rounded transition font-medium text-white hover:scale-110 hover:animate-shake"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex flex-col space-y-2 mt-2">
            <Link
              to="/login"
              className={`${buttonClass} text-center`}
              style={glowStyle}
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`${buttonClass} text-center`}
              style={glowStyle}
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
