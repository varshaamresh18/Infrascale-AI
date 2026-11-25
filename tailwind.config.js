/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#090D16',
        card: {
          DEFAULT: '#111827',
          elevated: '#151E2E',
          hover: '#1E293B',
        },
        border: {
          DEFAULT: '#273449',
          subtle: '#1E293B',
          glow: '#06B6D4',
        },
        primary: {
          DEFAULT: '#06B6D4', // Electric Cyan
          hover: '#0891B2',
          light: '#22D3EE',
        },
        emerald: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        amber: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        rose: {
          DEFAULT: '#F43F5E',
          light: '#FB7185',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px -5px rgba(6, 182, 212, 0.25)',
        'emerald-glow': '0 0 20px -5px rgba(16, 185, 129, 0.25)',
        'card-glow': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(6, 182, 212, 0.7)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 8px rgba(6, 182, 212, 0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(6, 182, 212, 0)' },
        },
      },
      animation: {
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
