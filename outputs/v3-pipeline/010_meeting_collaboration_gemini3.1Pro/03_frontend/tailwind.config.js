/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F9FA",
        surface: "#FFFFFF",
        primary: "#2D3748",
        accent: {
          amber: "#D97706",
          blue: "#3182CE"
        }
      }
    },
  },
  plugins: [],
}