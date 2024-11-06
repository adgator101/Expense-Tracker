/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      fontFamily: {
        pop: ["Poppins", "sans-serif"],
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "40%": { transform: "translateX(-10%)" },
          "80%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-10px)" },
        },
        slideOut: {
          "0%": { transform: "translateX(-2%)" },
          "40%": { transform: "translateX(0%)" },
          "80%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        slideIn: "slideIn 0.6s ease-in-out",
        slideOut: "slideOut 0.6s ease-out",
      },
    },
  },
  plugins: [],
};
