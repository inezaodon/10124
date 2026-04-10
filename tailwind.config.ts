import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8"
        }
      },
      boxShadow: {
        pop: "0 12px 40px -12px rgba(139, 92, 246, 0.35)",
        "pop-pink": "0 12px 40px -12px rgba(236, 72, 153, 0.3)"
      }
    }
  },
  plugins: []
} satisfies Config;
