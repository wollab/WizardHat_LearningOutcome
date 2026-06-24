/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Kanit', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Official WoL CI (from wol-brand skill: visual-system.md)
        wizard: {
          teal: '#50C2C0',
          plum: '#2f9b99',
          ink: '#414141',
          gold: '#FEC566',
          orange: '#FEC566',
          mist: '#d9f1f0',
        },
      },
    },
  },
  plugins: [],
};
