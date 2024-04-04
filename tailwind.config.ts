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
        primaryBlue: '#E3F5FF',
        secondaryBlue: '#A5CADF',
        darkMode: '#323232',
        darkModeGlass: "rgba(50,50,50,0.9)",
        darkModeBgColor: "#202020",
        darkBlue: "#00080D",
        infoTrackBlue: "#2F9FDD",
        infoBlue: "#B7E5FF",
        cautionTrackYellow: "#FFC645",
        cautionYellow: "#FFFAD0",
      },
      boxShadowColor: {
        blueShadow: '#489EDC',
      },
      boxShadow: {
        upShadow: '0px -3px 7px -1px rgba(0,0,0,0.2)',
        buttonShadowDark: "5px 5px 10px #262626, -5px -5px 10px #3a3a3a",
        buttonShadow: "5px 5px 8px #d8e9f2, -5px -5px 8px #eeffff",
      }
    },
  },
  plugins: [],
};
export default config;
