/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        travo: {
          orange: '#F59B24',
          'orange-light': '#FFF1D9',
          'orange-dark': '#C67812',
          lemon: '#F59B24',
          'lemon-light': '#FFF1D9',
          'lemon-dark': '#C67812',
          black: '#102B48',
          'black-light': '#244C70',
          white: '#FFFFFF',
          gray: {
            50: '#F7F8F6',
            100: '#EEF3F5',
            200: '#E5E9E8',
            300: '#D5DDDE',
            400: '#9AA5AF',
            500: '#667483',
            600: '#52616F',
            700: '#354657',
            800: '#20384F',
            900: '#101927',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'travo': '0 4px 20px rgba(255, 107, 0, 0.15)',
        'travo-lg': '0 8px 40px rgba(255, 107, 0, 0.2)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'pulse-orange': 'pulse-orange 2s infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        'pulse-orange': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 107, 0, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(255, 107, 0, 0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
