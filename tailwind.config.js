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
          50: "#EFF6FF",   // very light blue
          100: "#DBEAFE",  // light blue
          200: "#BFDBFE",  // soft sky blue
          300: "#93C5FD",  // sky blue
          400: "#60A5FA",  // bright sky blue
          500: "#3B82F6",  // main brand blue
          600: "#2563EB",  // strong blue
          700: "#1D4ED8",  // deep blue
          800: "#1E3A8A",  // navy blue
          900: "#172554",  // dark navy
        },

        secondary: {
          50: "#F8FAFC",   // very light gray background
          100: "#F1F5F9",  // soft gray
          200: "#E2E8F0",  // light border gray
          300: "#CBD5E1",  // neutral gray
          400: "#94A3B8",  // medium gray
          500: "#64748B",  // dark gray text
        },

        accent: {
          400: "#FB923C",  // light orange
          500: "#F97316",  // main action orange
          600: "#EA580C",  // deep orange
        },

        success: "#22C55E", // green (delivered / success state)
        warning: "#F59E0B", // amber (attention / ready state)
        danger: "#EF4444",  // red (errors / failed orders)
      },

      fontFamily: {
        sans: ["Urbanist", "Inter", "system-ui", "sans-serif"], // body text
        heading: ["Poppins", "Inter", "system-ui", "sans-serif"], // headings
      },

      boxShadow: {
        card: "0 4px 14px rgba(0,0,0,0.08)", // soft card shadow
        soft: "0 8px 24px rgba(0,0,0,0.12)", // deeper modal shadow
      },
    },
  },
  plugins: [],
};
