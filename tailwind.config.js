/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'camfrog-bg': '#1e2124',
        'camfrog-panel': '#282b30',
        'camfrog-panel-light': '#36393f',
        'camfrog-accent': '#7289da',
        'camfrog-text': '#dcddde',
        'camfrog-text-muted': '#72767d',
        'rank-admin': '#c084fc', // purple-400
        'rank-vip1': '#f9a8d4', // pink-300
        'rank-vip2': '#fb923c', // orange-400
        'rank-pro': '#f87171', // red-400
        'rank-user': '#60a5fa', // blue-400
      },
    },
  },
  plugins: [],
}
