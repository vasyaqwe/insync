/** @type {import('tailwindcss').Config} */

import plugin from "tailwindcss/plugin"

module.exports = {
   darkMode: ["class"],
   content: [
      "./pages/**/*.{ts,tsx}",
      "./components/**/*.{ts,tsx}",
      "./app/**/*.{ts,tsx}",
      "./src/**/*.{ts,tsx}",
   ],
   theme: {
      container: {
         center: true,
         padding: "var(--container-padding-inline)",
         screens: {
            md: "768px",
            lg: "1024px",
            "2xl": "1400px",
         },
      },
      extend: {
         gridTemplateColumns: {
            fluid: "repeat(auto-fit, minmax(15rem, 1fr))",
            fixed: "repeat(auto-fill, minmax(18rem, 1fr))",
            "full-width-split-screen":
               "minmax(var(--container-padding-inline), 1fr) minmax(0, calc(var(--container-width) / 2)) minmax(0, calc(var(--container-width) / 2)) minmax(var(--container-padding-inline), 1fr)",
         },
         fontSize: {
            sm: "0.925rem",
         },
         fontFamily: {
            "primary-en": "var(--font-geist-sans)",
            "primary-uk": "var(--font-inter-latin)",
         },
         colors: {
            border: "hsl(var(--border))",
            input: "hsl(var(--input))",
            ring: "hsl(var(--ring))",
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
            primary: {
               DEFAULT: "hsl(var(--primary))",
               foreground: "hsl(var(--primary-foreground))",
            },
            secondary: {
               DEFAULT: "hsl(var(--secondary))",
               foreground: "hsl(var(--secondary-foreground))",
            },
            destructive: {
               DEFAULT: "hsl(var(--destructive))",
               foreground: "hsl(var(--destructive-foreground))",
            },
            muted: {
               DEFAULT: "hsl(var(--muted))",
               foreground: "hsl(var(--muted-foreground))",
            },
            accent: {
               DEFAULT: "hsl(var(--accent))",
               foreground: "hsl(var(--accent-foreground))",
            },
            popover: {
               DEFAULT: "hsl(var(--popover))",
               foreground: "hsl(var(--popover-foreground))",
            },
            card: {
               DEFAULT: "hsl(var(--card))",
               foreground: "hsl(var(--card-foreground))",
            },
         },
         borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
         },
         keyframes: {
            blink: {
               "0%": {
                  opacity: "0.2",
               },
               "20%": {
                  opacity: "1",
               },
               "100%": {
                  opacity: " 0.2",
               },
            },
            "accordion-down": {
               from: { height: 0 },
               to: { height: "var(--radix-accordion-content-height)" },
            },
            "accordion-up": {
               from: { height: "var(--radix-accordion-content-height)" },
               to: { height: 0 },
            },
         },
         animation: {
            blink: "blink 1.4s infinite both",
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out",
         },
      },
   },
   plugins: [
      require("tailwindcss-animate"),
      require("@tailwindcss/typography"),
      plugin(({ matchUtilities, theme }) => {
         matchUtilities(
            {
               "animation-delay": (value) => {
                  return {
                     "animation-delay": value,
                  }
               },
            },
            {
               values: theme("transitionDelay"),
            }
         )
      }),
   ],
}
