import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF6EE",
        parchment: "#F4ECDC",
        champagne: "#DFC38E",
        "champagne-dark": "#C7A667",
        clay: "#C98A5E",
        ink: "#3A2E22",
        sage: "#7C8567",
        "sage-light": "#EDEFE6",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "double-rule":
          "linear-gradient(#DFC38E, #DFC38E), linear-gradient(#DFC38E, #DFC38E)",
      },
      keyframes: {
        "card-in": {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "card-in": "card-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
