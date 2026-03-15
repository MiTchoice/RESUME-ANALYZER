/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#f0f4ff',100:'#e0e9ff',500:'#6366f1',600:'#4f46e5',700:'#4338ca',900:'#1e1b4b' },
        accent:  { 400:'#34d399',500:'#10b981',600:'#059669' }
      },
      fontFamily: { sans: ['Inter','system-ui','sans-serif'] }
    }
  },
  plugins: []
}
