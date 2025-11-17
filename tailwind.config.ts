import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E293B",
          light: "#F5F5FF",
          50: "#F5F5FF",
        },
        secondary: "#64748B",
        tertiary: "#94A3B8",
        bitcoin: "#F7931A",
        ethereum: "#627EEA",
        success: "#10B981",
        danger: "#EF4444",
      },
      backgroundImage: {
        "gradient-card": "linear-gradient(135deg, #FFA500 0%, #FF6B9D 50%, #C084FC 100%)",
        "gradient-blue": "linear-gradient(180deg, #3B82F6 0%, #1E40AF 100%)",
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "dark-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.5)",
        "dark-md": "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
        "dark-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
        "dark-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)",
      },
      spacing: {
        "card-padding": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;

