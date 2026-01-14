import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "fade-out": { "0%": { opacity: "1" }, "100%": { opacity: "0" } },
        "blurred-fade-in": {
          "0%": { filter: "blur(5px)", opacity: "0" },
          "100%": { filter: "blur(0)", opacity: "1" },
        },
        "zoom-in": {
          "0%": { opacity: "0", transform: "scale(.5)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "zoom-out": {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(.5)" },
        },
        "slide-in-top": {
          "0%": { transform: "translateY(-20px)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-bottom": {
          "0%": { transform: "translateY(20px)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-20px)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(20px)" },
          "100%": { transform: "translateX(0)" },
        },
        "swing-drop-in": {
          "0%": { transform: "rotate(-30deg) translateY(-50px)", opacity: "0" },
          "100%": { transform: "rotate(0deg) translateY(0)", opacity: "1" },
        },
        "jelly": {
          "0%": { transform: "scale(1, 1)" },
          "20%": { transform: "scale(1.25, 0.75)" },
          "40%": { transform: "scale(0.75, 1.25)" },
          "60%": { transform: "scale(1.15, 0.85)" },
          "100%": { transform: "scale(1, 1)" },
        },
        "pulse-fade-in": {
            "0%": { transform: "scale(0.9)", opacity: "0" },
            "50%": { transform: "scale(1.05)", opacity: "0.5" },
            "100%": { transform: "scale(1)", opacity: "1" },
        },
        "tada": {
          "0%": { transform: "scale(1)" },
          "10%": { transform: "scale(0.9) rotate(-3deg)" },
          "20%": { transform: "scale(0.9) rotate(-3deg)" },
          "30%": { transform: "scale(1.1) rotate(3deg)" },
          "40%": { transform: "scale(1.1) rotate(-3deg)" },
          "50%": { transform: "scale(1.1) rotate(3deg)" },
          "60%": { transform: "scale(1.1) rotate(-3deg)" },
          "70%": { transform: "scale(1.1) rotate(3deg)" },
          "80%": { transform: "scale(1.1) rotate(3deg)" },
          "90%": { transform: "scale(1.1) rotate(3deg)" },
          "100%": { transform: "scale(1) rotate(0)" },
        },
        "bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-in both",
        "fade-out": "fade-out 0.6s ease-out both",
        "blurred-fade-in": "blurred-fade-in 0.9s ease-in-out both",
        "zoom-in": "zoom-in 0.6s ease-out both",
        "zoom-out": "zoom-out 0.6s ease-out both",
        "slide-in-top": "slide-in-top 0.6s ease-out both",
        "slide-in-bottom": "slide-in-bottom 0.6s ease-out both",
        "slide-in-left": "slide-in-left 0.6s ease-out both",
        "slide-in-right": "slide-in-right 0.6s ease-out both",
        "swing-drop-in": "swing-drop-in 0.6s ease-out both",
        "jelly": "jelly 0.6s ease-in-out both",
        "pulse-fade-in": "pulse-fade-in 0.6s ease-out both",
        "tada": "tada 1s ease-in-out both",
        "bounce": "bounce 1s ease-in-out infinite",
        "shake": "shake 0.5s ease-in-out both",
      },
    },
  },
  plugins: [
    function({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          'animate-delay': (value: string) => ({
            'animation-delay': value,
          }),
        },
        { values: theme('transitionDelay') }
      );
      matchUtilities(
        {
          'animate-duration': (value: string) => ({
            'animation-duration': value,
          }),
        },
        { values: theme('transitionDuration') }
      );
    },
  ],
};
export default config;
