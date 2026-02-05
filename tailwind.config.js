export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        neon: {
          cyan: '#00f5ff',
          pink: '#ff006e',
          lime: '#39ff14',
          orange: '#ff6600',
          purple: '#b537f2',
          teal: '#00d9d9',
        },
        tropical: {
          dark: '#0a0e27',
          darker: '#050810',
          surface: '#1a1f3a',
          accent: '#2d3561',
        }
      },
      backgroundImage: {
        'gradient-civic': 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        'gradient-neon-cyan-pink': 'linear-gradient(135deg, #00f5ff 0%, #ff006e 100%)',
        'gradient-neon-lime-orange': 'linear-gradient(135deg, #39ff14 0%, #ff6600 100%)',
        'gradient-tropical': 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
        'gradient-neon-glow': 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(255, 0, 110, 0.1) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 0.15s infinite',
        'slide-in-up': 'slide-in-up 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'neon-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'slide-in-up': {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 245, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 245, 255, 0.6)' },
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
