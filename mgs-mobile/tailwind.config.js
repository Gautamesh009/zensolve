/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./shared/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f4ff',
                    100: '#e0e9fe',
                    200: '#c1d3fe',
                    300: '#92b3fd',
                    400: '#5d88f6',
                    500: '#2563eb', // Main brand color
                    600: '#2557eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                surface: {
                    50: '#fafafa',
                    100: '#f4f4f5',
                    200: '#e4e4e7',
                    900: '#09090b',
                },
                accent: '#f59e0b', // Amber for highlights/alerts
            },
            borderRadius: {
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
        },
    },
    plugins: [],
};

