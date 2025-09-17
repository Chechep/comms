import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Solutions", path: "/solutions" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            Comms
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-700 hover:text-indigo-600"
              >
                {item.name}
              </Link>
            ))}

            {/* Auth Buttons */}
            <Link
              to="/login"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="ml-4 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg px-4 pb-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block py-2 text-gray-700 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Auth Buttons in Mobile */}
          <Link
            to="/login"
            className="block py-2 text-gray-700 hover:text-indigo-600"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            onClick={() => setIsOpen(false)}
          >
            Start Free Trial
          </Link>
        </div>
      )}
    </nav>
  );
}
