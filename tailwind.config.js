/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // Base colors
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    // Hover colors
    "hover:bg-red-400",
    "hover:bg-green-400",
    "hover:bg-blue-400",
    // Text colors
    "text-red-500",
    "text-green-500",
    "text-blue-500",
    // Command colors in functions
    "bg-gray-100",
    "hover:bg-gray-200",
    "bg-gray-700",
    "bg-gray-200",
    "hover:bg-blue-600",
    "disabled:opacity-50",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
