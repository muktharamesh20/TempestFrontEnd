/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#F9F8F5',
        secondary: '#0E2433',
        priority: {
          100:'#ED4756',
          200:'#FF8C3A',
          300: '#F0BB00',
          400: '3898F3',
        },
        light: {
          100: "DADADA",
          200: '#C4C4C4',
          300: '#ADB5BA',
        },
        darkBlues: {
          100: '3898F3',
          200: '21598C',
          300: '#1A466D',
        },
        accent: '#21598B',

      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
