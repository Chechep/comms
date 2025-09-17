/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--color-brand)",
        },
        bgtheme: {
          DEFAULT: "var(--color-bg)",
        },
      },
    },
  },
  plugins: [],
}

