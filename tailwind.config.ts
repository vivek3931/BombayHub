import type { Config } from "tailwindcss";

export default {
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
                "taxi-yellow": "#FFD600",
                "asphalt-black": "#111111",
                "sea-blue": "#004E64",
            },
            fontFamily: {
                sans: ["var(--font-inter)"],
                heading: ["var(--font-bebas-neue)"],
            },
            backgroundImage: {
                'noise': "url('/noise.png')", // We will rely on CSS or a file for this
            }
        },
    },
    plugins: [],
} satisfies Config;
