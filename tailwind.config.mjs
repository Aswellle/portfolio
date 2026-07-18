/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        bg: {
          DEFAULT: '#F5F5F7',
          surface: '#FFFFFF',
          elevated: '#F0F0F5',
          muted: '#EBEBF0',
        },
        accent: {
          DEFAULT: '#2563EB',
          purple: '#7C3AED',
          light: '#3B82F6',
          muted: 'rgba(37,99,235,0.08)',
        },
        border: {
          DEFAULT: '#E4E4E7',
          strong: '#D1D1D6',
        },
        text: {
          DEFAULT: '#1D1D1F',
          secondary: '#3F3F46',
          muted: '#71717A',
          dim: '#A1A1AA',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10), 0 12px 32px rgba(0,0,0,0.06)',
        'accent-glow': '0 0 32px rgba(37,99,235,0.15)',
      },
      animation: {
        'fade-up': 'fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'float': 'float 6s ease-in-out infinite',
        'gradient-x': 'gradientX 8s ease infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradientX: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
