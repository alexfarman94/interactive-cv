/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#FAFAF9',
        'bg-secondary': '#F5F5F4',
        'text-primary': '#0C0A09',
        'text-secondary': '#78716C',
        'accent': '#4F46E5',
        'accent-hover': '#4338CA',
        'border': '#E7E5E4',
        'success': '#10B981',
        'hero-dark': '#0C0A09',
        'hero-accent': '#6366F1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
