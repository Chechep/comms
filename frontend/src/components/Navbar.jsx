import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const glowStyle = darkMode
    ? { boxShadow: "0 0 10px var(--color-brand), 0 0 20px var(--color-brand)" }
    : {};

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const navItems = user
    ? [{ name: "About", path: "/about" }]
    : [
        { name: "Home", path: "/" },
        { name: "Get Started", path: "/about" },
        { name: "Services", path: "/services" },
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

            {!user ? (
              <>
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
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={`${buttonClass} flex items-center gap-1`}
                  style={{
                    color: "var(--color-text)",
                    borderColor: "var(--color-text)",
                  }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-full border transition hover:scale-110 hover:animate-shake flex items-center gap-1"
                  style={{
                    color: "var(--color-text)",
                    borderColor: "var(--color-text)",
                  }}
                >
                  <User size={20} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${buttonClass} flex items-center gap-1`}
                  style={{
                    color: "var(--color-text)",
                    borderColor: "var(--color-text)",
                  }}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
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
            {!user ? (
              <>
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
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={`${buttonClass} flex items-center gap-1 text-center`}
                  style={{
                    color: "var(--color-text)",
                    borderColor: "var(--color-text)",
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-full border transition hover:scale-110 hover:animate-shake flex items-center gap-1 text-center"
                  style={{
                    color: "var(--color-text)",
                    borderColor: "var(--color-text)",
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  <User size={20} />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className={`${buttonClass} flex items-center gap-1 justify-center`}
                  style={{
                    color: "var(--color-text)",
                    borderColor: "var(--color-text)",
                  }}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
