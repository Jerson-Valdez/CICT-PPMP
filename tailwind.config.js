/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ppmp-blue': '#1e3a8a', // Your professional project blue
      },
    },
  },
  plugins: [],
}