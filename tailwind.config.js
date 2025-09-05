/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
      heading: ["var(--font-nunito)", "sans-serif"],
      para: ["var(--font-quicksand)", "sans-serif"],  
    }
    },
  },
plugins: [require("@tailwindcss/line-clamp")],
};
