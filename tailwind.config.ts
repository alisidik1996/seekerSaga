import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        occult: {
          900: "#07090e",
          800: "#0d1117",
          700: "#161b22",
          600: "#21262d",
          crimson: "#8a0303",
          blood: "#e63946",
          emerald: "#10b981",
          gold: "#d4af37",
          abyss: "#030712",
        },
      },
      fontFamily: {
        serif: ["Cinzel", "Georgia", "serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
