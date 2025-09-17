import { useEffect, useState } from "react";

const themes = {
  teal: {
    brand: "#14B8A6",
    gradient: "linear-gradient(135deg, #5eead4, #14b8a6)", // light teal
  },
  zinc: {
    brand: "#71717A",
    gradient: "linear-gradient(135deg, #d4d4d8, #71717a)", // light zinc
  },
  cyan: {
    brand: "#06B6D4",
    gradient: "linear-gradient(135deg, #67e8f9, #06b6d4)", // aqua cyan
  },
  rose: {
    brand: "#F43F5E",
    gradient: "linear-gradient(135deg, #fda4af, #f43f5e)", // pinkish rose
  },
};

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("teal");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      // Dark mode → black bg + white text
      root.style.setProperty("--color-bg", "#000000");
      root.style.setProperty("--color-text", "#ffffff");
      root.style.setProperty("--color-brand", themes[theme].brand);
    } else {
      // Light mode → theme gradient + white text
      root.style.setProperty("--color-bg", themes[theme].gradient);
      root.style.setProperty("--color-text", "#ffffff");
      root.style.setProperty("--color-brand", themes[theme].brand);
    }
  }, [theme, darkMode]);

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
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-3 rounded-full text-white shadow-lg hover:scale-110 transition"
        style={{
          background: `var(--color-brand)`,
          boxShadow: `0 0 10px var(--color-brand), 0 0 20px var(--color-brand)`,
        }}
      >
        🎨
      </button>

      {open && (
        <div className="absolute bottom-14 right-0 bg-white dark:bg-black shadow-xl rounded-xl p-4 space-y-3 w-44">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Select Theme
          </h3>

          <div className="flex space-x-3">
            {themeOptions.map((t) => (
              <button
                key={t.name}
                onClick={() => setTheme(t.name)}
                className={`w-8 h-8 rounded-full ${t.gradient} border-2 ${
                  theme === t.name ? "ring-2 ring-offset-2 ring-brand" : "border-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-700 dark:text-gray-200">Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-10 h-5 rounded-full flex items-center transition ${
                darkMode ? "bg-brand" : "bg-gray-300"
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
