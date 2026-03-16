/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090B',
        surface: 'rgba(24, 24, 27, 0.6)',
        'surface-elevated': 'rgba(39, 39, 42, 0.7)',
        primary: '#FAFAFA',
        secondary: '#A1A1AA',
        muted: '#71717A',
        accent: '#38BDF8',
        'scene-home': '#34D399',
        'scene-leave': '#F87171',
        'scene-sleep': '#818CF8',
        'scene-movie': '#F472B6',
        'status-online': '#10B981',
        'status-offline': '#52525B',
        'status-error': '#EF4444'
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        mono: ['Inter', 'monospace'],
      }
    },
  },
  plugins: [],
}
