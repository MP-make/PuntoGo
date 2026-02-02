import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
        body: ['var(--font-jakarta)', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: "#2563EB", // Azul vibrante (Royal Blue)
          dark: "#1E40AF",
          light: "#60A5FA",
        },
        accent: {
          DEFAULT: "#F97316", // Naranja energético
          hover: "#EA580C",
        },
        surface: {
          glass: "rgba(255, 255, 255, 0.7)",
          glassDark: "rgba(15, 23, 42, 0.7)",
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glow': '0 0 20px rgba(37, 99, 235, 0.5)',
        'card': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'card-hover': '0 20px 50px -12px rgba(37, 99, 235, 0.25)', 
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.3) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;