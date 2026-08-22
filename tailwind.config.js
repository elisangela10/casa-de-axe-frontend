/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        house: {
          ink: "#1c1917",
          clay: "#92400e",
          moss: "#166534",
          cream: "#fbf8f3",
        },
      },
      borderRadius: {
        card: "1rem",
      },
      boxShadow: {
        card: "0 8px 30px rgba(28, 25, 23, 0.06)",
      },
    },
  },
  plugins: [],
};
