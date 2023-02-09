/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'opensans': ['Open Sans', 'sans-serif'],
        'codepro': ['Source Code Pro', 'monospace'],
        'ubuntu': ['Ubuntu', 'sans-serif'],
        'gloria': ['Gloria Hallelujah', 'cursive']
      }
    },
  },
  plugins: [],
}
