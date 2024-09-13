/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Lora will be used for headings -- using tailwind example "text-xl font-heading"
        heading: ["Lora", "serif"],
        // Roboto will be used for body text -- using tailwind example "text-sm font-body"
        body: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
