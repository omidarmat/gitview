/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-100": "#C9DDE4",
        "primary-400": "#0891B2",
        "primary-700": "#0E7490",
        "text-heading": "#425266",
        "text-normal": "#64748B",
      },
    },
  },
  plugins: [],
};
