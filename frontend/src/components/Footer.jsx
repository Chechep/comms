import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Solutions", path: "/solutions" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer
      className="py-12 px-6 mt-20 backdrop-blur-md"
      style={{
        background: "rgba(0,0,0,0.05)",
        color: "var(--color-text)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo */}
        <div
          className="text-2xl font-extrabold mb-4 md:mb-0 bg-clip-text text-transparent animate-gradient-y"
          style={{
            backgroundImage: "linear-gradient(to bottom, #000, #fff, #000)",
            backgroundSize: "200% 200%",
          }}
        >
          Comms
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm sm:text-base">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="hover:opacity-80 hover:scale-105 transition"
              style={{ color: "var(--color-text)" }}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Social Icons */}
        <div className="flex gap-5">
          {[Facebook, Twitter, Instagram].map((Icon, idx) => (
            <a
              key={idx}
              href="#"
              className="transition transform hover:scale-110"
              style={{ color: "var(--color-text)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-brand)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
            >
              <Icon size={22} />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom text */}
      <div
        className="mt-8 text-center text-xs sm:text-sm opacity-80"
        style={{ color: "var(--color-text)" }}
      >
        © {new Date().getFullYear()} Comms. All rights reserved.
      </div>

      {/* Gradient Animation Keyframes */}
      <style>
        {`
          @keyframes gradientY {
            0% { background-position: top; }
            50% { background-position: bottom; }
            100% { background-position: top; }
          }
          .animate-gradient-y {
            animation: gradientY 5s ease-in-out infinite;
          }
        `}
      </style>
    </footer>
  );
}
