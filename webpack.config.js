const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require("glob");

module.exports = {
  entry: glob.sync("./src/js/*.js").reduce((acc, file) => {
    const name = path.basename(file, ".js"); // Get file name without extension
    acc[name] = file; // Add to Webpack entry object
    return acc;
  }, {}),
  output: {
    filename: "[name].bundle.js", // Generates a separate bundle for each file
    path: path.resolve(__dirname, "dist"),
    clean: true // Cleans the /dist folder before each build
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"] // Extracts and bundles CSS
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "styles.css" }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html"
    })
  ],
  mode: "production"
};



