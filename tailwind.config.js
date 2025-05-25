/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily:{
        poppins: "'Poppins', sans-serif",
        roboto: "'Roboto', sans-serif",
        agbalumo: "'Agbalumo'",
        konten: "'edu tas beginner'",
        konten2: "'Oswald'"
      },
      colors: {
        primary: '#eab308',
      },
    },
  },
  plugins: [],
}
