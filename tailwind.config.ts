import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        moveo: {
          bg: "#F7F8FA",
          card: "#FFFFFF",
          ink: "#1C2333",
          muted: "#6B7280",
          border: "#E5E8EF",
          primary: "#2B5CE6",
          primaryDark: "#1E44B8",
          primarySoft: "#EAF0FF",
          right: "#2B5CE6",
          left: "#12A594",
          warn: "#E6A62B",
          danger: "#E14B4B",
        },
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
