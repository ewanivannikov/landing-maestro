// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Главный HTML-файл
    "./src/**/*.{js,ts,jsx,tsx}", // Все файлы с кодом в папке src
  ],
  darkMode: 'class', // или 'media' - важно для работы dark:
  theme: {
    extend: {},
  },
  plugins: [],
}