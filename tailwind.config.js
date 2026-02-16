/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'screen-safe': '100dvh',
        'dvh': '100dvh',
      },
      minHeight: {
        'screen-safe': '100dvh',
        'dvh': '100dvh',
      },
      maxHeight: {
        'screen-safe': '100dvh',
        'dvh': '100dvh',
      },
    },
  },
  plugins: [],
}

