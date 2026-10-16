/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#03060d',
          900: '#070c18',
          850: '#0c1322',
          800: '#111b2e',
          700: '#1a2742',
        },
        noir: {
          base: '#03060d',
          surface: '#070c18',
          elevated: '#0c1322',
          border: 'rgba(255, 255, 255, 0.08)',
          subtle: 'rgba(255, 255, 255, 0.04)',
        },
        cyan: {
          DEFAULT: '#00f0ff',
          glow: 'rgba(0, 240, 255, 0.4)',
          dim: 'rgba(0, 240, 255, 0.15)',
        },
        violet: {
          DEFAULT: '#8b5cf6',
          glow: 'rgba(139, 92, 246, 0.4)',
          dim: 'rgba(139, 92, 246, 0.15)',
        },
        amber: {
          DEFAULT: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.4)',
          dim: 'rgba(245, 158, 11, 0.15)',
        },
        emerald: {
          DEFAULT: '#10b981',
          glow: 'rgba(16, 185, 129, 0.4)',
          dim: 'rgba(16, 185, 129, 0.15)',
        },
        signal: {
          cyan: '#00f0ff',
          violet: '#8b5cf6',
          amber: '#f59e0b',
          emerald: '#10b981',
          text: '#e2e8f0',
          muted: '#94a3b8',
          dim: '#64748b',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '1px',
        md: '4px',
        lg: '6px',
        xl: '8px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 24s linear infinite',
        'reverse-spin': 'reverseSpin 28s linear infinite',
      },
      keyframes: {
        reverseSpin: {
          'from': { transform: 'rotate(360deg)' },
          'to': { transform: 'rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
};
