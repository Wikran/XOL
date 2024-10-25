const path = require('path');

module.exports = {
  entry: './src/NISD456.js', // Entry point
  output: {
    filename: 'NISD456s.js', // Output file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  mode: 'development', // Mode can be 'development' or 'production'
};