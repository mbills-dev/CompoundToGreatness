/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: '#ccff00',
        'neon-light': '#D4FF45',
      },
      fontFamily: {
        'inter-black': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
