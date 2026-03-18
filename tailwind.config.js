/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#FAFAFA',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B7280',
        'accent': '#1E40AF',
        'accent-hover': '#1E3A8A',
        'border': '#E5E5E5',
        'success': '#059669',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
