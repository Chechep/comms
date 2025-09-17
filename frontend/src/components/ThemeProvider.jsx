import { useEffect, useState } from "react";

const themes = {
  teal: {
    brand: "#14B8A6",
    gradient: "linear-gradient(135deg, #5eead4, #14b8a6)",
  },
  zinc: {
    brand: "#71717A",
    gradient: "linear-gradient(135deg, #d4d4d8, #71717a)",
  },
  cyan: {
    brand: "#06B6D4",
    gradient: "linear-gradient(135deg, #67e8f9, #06b6d4)",
  },
  rose: {
    brand: "#F43F5E",
    gradient: "linear-gradient(135deg, #fda4af, #f43f5e)",
  },
  light: {
    brand: "#000000", // black accent
    gradient: "#ffffff", // plain white bg
  },
};

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "teal";
  });

  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) return stored === "true";
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply theme + persist
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.style.setProperty("--color-bg", "#000000");
      root.style.setProperty("--color-text", "#ffffff");
      root.style.setProperty("--color-brand", themes[theme].brand);
    } else if (theme === "light") {
      root.style.setProperty("--color-bg", "#ffffff");
      root.style.setProperty("--color-text", "#000000");
      root.style.setProperty("--color-brand", themes[theme].brand);
    } else {
      root.style.setProperty("--color-bg", themes[theme].gradient);
      root.style.setProperty("--color-text", "#ffffff");
      root.style.setProperty("--color-brand", themes[theme].brand);
    }

    localStorage.setItem("theme", theme);
    localStorage.setItem("darkMode", darkMode);
  }, [theme, darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e) => {
      setDarkMode(e.matches);
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return (
    <>
      {children}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeSwitcher
          theme={theme}
          setTheme={setTheme}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </div>
    </>
  );
}

function ThemeSwitcher({ theme, setTheme, darkMode, setDarkMode }) {
  const [open, setOpen] = useState(false);

  const themeOptions = [
    { name: "teal", gradient: "bg-gradient-to-br from-teal-200 to-teal-500" },
    { name: "zinc", gradient: "bg-gradient-to-br from-zinc-200 to-zinc-600" },
    { name: "cyan", gradient: "bg-gradient-to-br from-cyan-200 to-cyan-500" },
    { name: "rose", gradient: "bg-gradient-to-br from-rose-200 to-rose-500" },
    { name: "light", gradient: "bg-gradient-to-br from-gray-200 to-gray-500" },
  ];

  const isLightTheme = theme === "light" && !darkMode;

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`p-3 rounded-full shadow-lg hover:scale-110 transition ${
          isLightTheme
            ? "text-black bg-white border border-gray-300"
            : "text-white"
        }`}
        style={{
          background: isLightTheme ? "#ffffff" : `var(--color-brand)`,
          boxShadow: isLightTheme
            ? "0 0 6px rgba(0,0,0,0.2)"
            : `0 0 10px var(--color-brand), 0 0 20px var(--color-brand)`,
        }}
      >
        🎨
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute bottom-14 right-0 shadow-xl rounded-xl p-4 space-y-3 w-44 transition ${
            isLightTheme ? "bg-white text-black" : "bg-white dark:bg-black"
          }`}
        >
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Select Theme
          </h3>

          {/* Theme choices */}
          <div className="flex space-x-3">
            {themeOptions.map((t) => (
              <button
                key={t.name}
                onClick={() => setTheme(t.name)}
                className={`w-8 h-8 rounded-full ${t.gradient} border-2 ${
                  theme === t.name
                    ? "ring-2 ring-offset-2 ring-[var(--color-brand)]"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Dark mode toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-700 dark:text-gray-200">
              Dark Mode
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-10 h-5 rounded-full flex items-center transition ${
                darkMode ? "bg-[var(--color-brand)]" : "bg-gray-300"
              }`}
            >
              <span
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                  darkMode ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeProvider;
