module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./build/**/*.{js,jsx,ts,tsx,pug,html}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
};