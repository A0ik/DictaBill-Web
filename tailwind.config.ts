import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1D9E75',
          50:  '#E8F7F2',
          100: '#C5EBD9',
          200: '#8FD5B8',
          300: '#59BF97',
          400: '#32AD83',
          500: '#1D9E75',
          600: '#178761',
          700: '#116F4E',
          800: '#0B573C',
          900: '#063F2A',
        },
        accent: '#EF9F27',
        surface: '#F5F7FA',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        bounceSoft: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
    },
  },
  plugins: [],
};

export default config;
