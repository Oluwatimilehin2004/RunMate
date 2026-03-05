/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { 
          50: "#000000",      // black
          100: "#C92925",     // scarlett red
          200: "#280B08",     // black bean
        },
        secondary: { 
          50: "#F9EFC9",      // champagne
          100: "#FBFBFB",     // very light gray
          200: "#E5E5E5",     // more light gray
        },
        accent: "#657786",
      },
      fontFamily: {
        sans: ["Urbanist", "Inter", "system-ui", "sans-serif"],
        heading: ["Actor", "Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
