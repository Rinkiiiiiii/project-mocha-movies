import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0b0e14",
          900: "#10141d",
          850: "#141926",
          800: "#1a2032",
          700: "#232a40",
          600: "#323b57",
        },
        accent: {
          DEFAULT: "#3db4f2",
          soft: "#5ec7ff",
          muted: "#2d8dc0",
        },
        favorite: "#f25dab",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "banner-fade":
          "linear-gradient(180deg, rgba(11,14,20,0.15) 0%, rgba(11,14,20,0.85) 70%, rgba(11,14,20,1) 100%)",
      },
      boxShadow: {
        card: "0 4px 14px rgba(0,0,0,0.35)",
      },
      borderRadius: {
        xl2: "0.875rem",
      },
    },
  },
  plugins: [],
};

export default config;
