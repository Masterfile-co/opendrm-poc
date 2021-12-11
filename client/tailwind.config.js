module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "masterfile-purple": "#7544E0",
        "masterfile-gray-100": "#EDEDED",
        "masterfile-gray-200": "#D3D3D3",
        "masterfile-gray-300": "#8D8D8E",
        "masterfile-gray-400": "#D1D1D1",
        "masterfile-gray-600": "#313133",
        "masterfile-gray-900": "#232225",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
