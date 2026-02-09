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
        carbon: '#0F1419',
        steel: '#1B2A4A',
        machinery: '#D4740E',
        'slate-panel': '#2D3748',
        fog: '#A0AEC0',
        'alert-red': '#E53E3E',
        operational: '#38A169',
        caution: '#ECC94B',
      },
    },
  },
  plugins: [],
};

export default config;
