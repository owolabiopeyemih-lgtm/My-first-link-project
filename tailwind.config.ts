import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-serif)", "Georgia", "serif"],
        mono:    ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        brand: {
          50:  "#fef9ee",
          100: "#fdf0d0",
          200: "#fada9a",
          300: "#f7c063",
          400: "#f4a430",
          500: "#f28c18",
          600: "#e06a0e",
          700: "#b94d0f",
          800: "#943d14",
          900: "#783413",
        },
        forest: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          600: "#16a34a",
          700: "#15803d",
          800: "#1B3A2D",
          900: "#0f2a1e",
          950: "#091a12",
        },
        ivory: {
          50:  "#FDFCF7",
          100: "#F7F4EC",
          200: "#EDE8DA",
          300: "#DED7C5",
        },
      },
      screens: {
        xs: "320px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
