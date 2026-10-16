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
          950: '#020408',
          900: '#040814',
          850: '#070f23',
          800: '#0b1636',
          700: '#11224f',
        },
        cyan: {
          glow: '#00f0ff',
          neon: '#22d3ee',
          dim: '#0e7490',
        },
        violet: {
          glow: '#a855f7',
          neon: '#c084fc',
          dim: '#6b21a8',
        },
        amber: {
          warning: '#f59e0b',
          dim: '#b45309',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['Rajdhani', 'Orbitron', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'reverse-spin': 'reverseSpin 25s linear infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        reverseSpin: {
          'from': { transform: 'rotate(360deg)' },
          'to': { transform: 'rotate(0deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
