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
    "hover:bg-gray-300",
    "text-gray-700",
    "text-yellow-600",
    "text-red-600",
    "hover:bg-gray-100",
    "touch-manipulation",
    "cursor-move",
    "border-blue-500",
    "bg-blue-50",
    "touch-none",
    "z-50",
    "border-red-500",
    "bg-red-50",
    "border-gray-300",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
