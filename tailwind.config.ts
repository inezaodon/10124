import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#3b82f6",
          600: "#2563eb"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
