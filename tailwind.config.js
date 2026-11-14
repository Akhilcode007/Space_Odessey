/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nothing: {
          black: '#08080a',
          dark: '#0f0f12',
          card: 'rgba(18, 18, 22, 0.65)',
          border: 'rgba(255, 255, 255, 0.12)',
          borderGlow: 'rgba(255, 255, 255, 0.25)',
          red: '#eb2e2e',
          accent: '#e2e8f0',
          silver: '#94a3b8',
          subtle: '#64748b'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
        sans: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '24px',
        '3xl': '40px',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.12)',
        'glass-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255, 255, 255, 0.25)',
        'liquid-glow': '0 0 25px rgba(255, 255, 255, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
        'red-beacon': '0 0 15px rgba(235, 46, 46, 0.6)',
      }
    },
  },
  plugins: [],
}
