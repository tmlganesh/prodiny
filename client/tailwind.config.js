/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        reddit: {
          orange: '#FF4500',
          blue: '#0079D3',
          lightblue: '#24A0ED',
          dark: '#1A1A1B',
          gray: '#878A8C',
          lightgray: '#DAE0E6',
          background: '#030303',
          card: '#FFFFFF'
        }
      }
    },
  },
  plugins: [],
}
