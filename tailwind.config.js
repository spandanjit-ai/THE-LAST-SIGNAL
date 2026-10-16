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
        cyan: {
          DEFAULT: '#00f0ff',
          dim: 'rgba(0, 240, 255, 0.15)',
          glow: 'rgba(0, 240, 255, 0.4)',
        },
        violet: {
          DEFAULT: '#8b5cf6',
          dim: 'rgba(139, 92, 246, 0.15)',
          glow: 'rgba(139, 92, 246, 0.4)',
        },
        amber: {
          DEFAULT: '#f59e0b',
          dim: 'rgba(245, 158, 11, 0.15)',
          glow: 'rgba(245, 158, 11, 0.4)',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        display: ['Orbitron', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.98)' },
        },
        glitch: {
          '0%, 100%': { transform: 'none' },
          '20%': { transform: 'translate(-2px, 1px)' },
          '40%': { transform: 'translate(2px, -1px)' },
          '60%': { transform: 'translate(-1px, 2px)' },
          '80%': { transform: 'translate(1px, -2px)' },
        }
      },
      animation: {
        scanline: 'scanline 8s linear infinite',
        pulseSlow: 'pulseSlow 4s ease-in-out infinite',
        glitch: 'glitch 0.3s ease-in-out',
      }
    },
  },
  plugins: [],
}
