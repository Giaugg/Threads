// File: tailwind.config.js

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        threadBg: "#000000",
        threadCard: "#121212",
        threadBorder: "#262626",
      },
    },
  },
  plugins: [],
};