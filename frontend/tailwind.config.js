/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animationDelay: {
        '0': '0ms',
        '200': '200ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const delays = theme('animationDelay');
      const newUtilities = Object.entries(delays).reduce((acc, [key, value]) => {
        acc[`.delay-${key}`] = { 'animation-delay': value };
        return acc;
      }, {});
      addUtilities(newUtilities, ['responsive']);
    },
  ],
};
