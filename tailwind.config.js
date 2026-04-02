/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        green: {
          400: '#4ade80',
          600: '#16a34a',
          700: '#15803d',
        },
        red: {
          300: '#fca5a5',
          400: '#f87171',
        },
        blue: {
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        yellow: {
          500: '#eab308',
        },
        purple: {
          500: '#a855f7',
        },
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        slideIn: {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
