/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1a3f86',
          soft: '#f2f5ff',
          card: '#dde1f4',
          muted: '#c3cce3',
          action: '#1a3ffd',
        },
      },
      fontFamily: { sans: ['Arial', 'Helvetica', 'sans-serif'] },
    },
  },
  plugins: [],
}
