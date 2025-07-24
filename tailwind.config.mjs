/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // Use class-based strategy to avoid conflicts with custom styling
    }),
  ],
};
