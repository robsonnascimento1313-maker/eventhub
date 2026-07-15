/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        // Direção A — Tech Premium: violeta elétrico sobre preto-azulado
        primary: {
          50:  '#f4f1ff',
          100: '#ece7fe',
          200: '#ddd3fe',
          300: '#c4b0fd',
          400: '#a78bfa',
          500: '#8b6ef9',
          600: '#7c5cfa',
          700: '#6847f0',
          800: '#5636cc',
          900: '#452aa8',
        },
        ground: '#0a0b10',
        surface: {
          DEFAULT: '#14161f',
          2: '#101218',
          3: '#1b1e2b',
        },
        edge: {
          DEFAULT: '#262a38',
          soft: '#1f2230',
        },
        ink: {
          900: '#08090f',
          800: '#10121c',
          700: '#1a1d2b',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.35)',
        'card-hover': '0 2px 4px rgba(0,0,0,.5), 0 16px 40px rgba(0,0,0,.55), 0 0 0 1px rgba(124,92,250,.18)',
      },
    },
  },
  plugins: [],
};
