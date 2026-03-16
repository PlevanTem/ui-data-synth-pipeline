/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0D0F14',
          secondary: '#161921',
          tertiary: '#1C2030',
        },
        brand: {
          blue: '#4E9EFF',
          warm: '#FF8C42',
        },
        device: {
          light: '#FFD700',
          climate: '#60A5FA',
          security: '#34D399',
          entertainment: '#A78BFA',
          appliance: '#FB923C',
        },
        text: {
          primary: '#F0F4FF',
          secondary: '#8B9BB4',
          tertiary: '#4A5568',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"DM Sans"', 'sans-serif'],
        body: ['"Noto Sans SC"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        modal: '24px',
      },
      backdropBlur: {
        card: '16px',
        overlay: '24px',
        heavy: '40px',
      },
      animation: {
        'shimmer': 'shimmer 1.5s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
