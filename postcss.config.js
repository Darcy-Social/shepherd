module.exports = {
  plugins: [
    require('postcss-each'),
    require("tailwindcss")("./tailwind.config.js"),
    require("autoprefixer")(),
  ],
};