/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
    // "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "solar-blue-dark": "#154295",
        "solar-blue-light": "#29ABE2",
        "solar-yellow-dark": "#F18800",
        "solar-yellow-light": "#FFD100",
        "solar-gray-dark": "#F1F1F1",
        "solar-gray-middle": "#F8F8F8",
        "solar-gray-light": "#FAFAFA",
        "solar-orange-middle": "#F5B025",
        "solar-orange-dark": "#EC6608",
      },
      fontFamily: {
        Poppins_300Light: ["Poppins_300Light"],
        Poppins_300Light_Italic: ["Poppins_300Light_Italic"],
        Poppins_400Regular: ["Poppins_400Regular"],
        Poppins_400Regular_Italic: ["Poppins_400Regular_Italic"],
        Poppins_500Medium: ["Poppins_500Medium"],
        Poppins_500Medium_Italic: ["Poppins_500Medium_Italic"],
        Poppins_700Bold: ["Poppins_700Bold"],
        Poppins_700Bold_Italic: ["Poppins_700Bold_Italic"],
      }
    },
  },
  plugins: [],
}