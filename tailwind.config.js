/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: [
    "./app/**/*.{js,jsx,mdx}",
    "./components/**/*.{js,jsx,mdx}",
    "./lib/**/*.{js,jsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-heading)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(15, 23, 42, 0.22)",
        glow: "0 25px 80px -35px rgba(14, 165, 233, 0.45)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(to right, rgba(148, 163, 184, 0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.09) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
