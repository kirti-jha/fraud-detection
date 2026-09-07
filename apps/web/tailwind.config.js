/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          base: '#0B0F0E',
          sidebar: '#101615',
          surface: '#151C1A',
          elevated: '#1C2522',
          border: '#26332E',
          borderHover: '#344740',
        },
        brand: {
          DEFAULT: '#10B981',
          hover: '#34D399',
          soft: 'rgba(16,185,129,0.10)',
          border: 'rgba(16,185,129,0.25)',
        },
        status: {
          approve: '#34D399',
          review: '#F59E0B',
          block: '#F87171',
          info: '#60A5FA',
        },
        txt: {
          primary: '#F1F5F2',
          secondary: '#9AA9A2',
          muted: '#6B7A72',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
        'elevated': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'emerald-glow': '0 0 20px -5px rgba(16, 185, 129, 0.2)',
      },
      borderRadius: {
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
      }
    },
  },
  plugins: [],
};
