/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1f3a',
        secondary: '#2d3561',
        accent: '#7c3aed',
        light: '#e0e7ff',
        dark: '#0f1119',
      },
      backgroundColor: {
        'primary': '#1a1f3a',
        'secondary': '#2d3561',
        'tertiary': '#1f2540',
      },
      textColor: {
        'light': '#e0e7ff',
        'muted': '#9ca3af',
      },
      borderColor: {
        'primary': '#7c3aed',
      }
    },
  },
  plugins: [],
}
