/** @type {import('tailwindcss').Config} */
export default {
  // src/early-access has its own plain CSS and no Tailwind; excluding it keeps the main site's CSS unchanged.
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '!./src/early-access/**'],
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
