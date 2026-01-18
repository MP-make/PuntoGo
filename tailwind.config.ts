import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1e3a8a", // Azul
          dark: "#172554",
        },
        action: {
          DEFAULT: "#10b981", // Verde
          dark: "#059669",
        },
      },
    },
  },
  plugins: [],
};
export default config;