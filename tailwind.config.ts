import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'Arial', 'sans-serif'],
      },
      colors: {
        background: '#F5F5F5',
        foreground: '#333',
        primary: {
          DEFAULT: '#4857EC', // main blue
          foreground: '#FFFFFF', // white text on primary
          dark: '#3A46C8', // hover blue
        },
        secondary: {
          DEFAULT: '#E8EAFF', // light blue for icons
          foreground: '#4857EC', // icon color
        },
        muted: {
          DEFAULT: '#666',
          foreground: '#FFFFFF',
        },
        card: '#FFFFFF', // white background for cards, hero, header, footer
        border: '#EEE', // border color in footer
        heading: '#222', // heading color
      },
      boxShadow: {
        DEFAULT: '0 2px 10px rgba(0, 0, 0, 0.1)', // header shadow
        md: '0 4px 10px rgba(0, 0, 0, 0.05)', // card shadow
        lg: '0 8px 20px rgba(0, 0, 0, 0.1)', // card hover shadow
      },
      borderRadius: {
        lg: "16px", // hero, cta, footer
        md: "12px", // feature card, icon background
        sm: "8px", // buttons
      }
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config; 