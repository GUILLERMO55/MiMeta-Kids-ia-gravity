/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#818cf8', // Indigo 400
                    DEFAULT: '#6366f1', // Indigo 500
                    dark: '#4f46e5', // Indigo 600
                },
                secondary: {
                    light: '#fbbf24', // Amber 400
                    DEFAULT: '#f59e0b', // Amber 500
                    dark: '#d97706', // Amber 600
                },
                success: '#10b981', // Emerald 500
                danger: '#ef4444', // Red 500
                background: '#f8fafc', // Slate 50
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'bounce-short': 'bounce 1s infinite',
            }
        },
    },
    plugins: [],
}
