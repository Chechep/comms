import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin } from "lucide-react";

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
      className="py-12 px-4 mt-20 backdrop-blur-md"
      style={{ backgroundColor: "var(--color-bg)/0.3", color: "var(--color-text)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo */}
        <div className="text-2xl font-bold mb-4 md:mb-0" style={{ color: "var(--color-brand)" }}>
          Comms
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="hover:opacity-80 transition"
              style={{ color: "var(--color-text)" }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="#" style={{ color: "var(--color-text)" }}>
            <Facebook size={24} />
          </a>
          <a href="#" style={{ color: "var(--color-text)" }}>
            <Twitter size={24} />
          </a>
          <a href="#" style={{ color: "var(--color-text)" }}>
            <Linkedin size={24} />
          </a>
        </div>
      </div>

      <div className="mt-8 text-center text-sm" style={{ color: "var(--color-text)" }}>
        © {new Date().getFullYear()} Comms. All rights reserved.
      </div>
    </footer>
  );
}
