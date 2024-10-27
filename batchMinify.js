const fs = require('fs');
const path = require('path');
const uglify = require('uglify-js');

// Define the input and output directories
const inputDir = './src';
const outputDir = './dist';

// UglifyJS options
const options = {
  mangle: true,
  compress: true
};

// Function to minify a single file
const minifyFile = (inputFilePath, outputFilePath) => {
  const input = fs.readFileSync(inputFilePath, 'utf8');
  const output = uglify.minify(input, options);

  if (output.error) {
    console.error(`Error minifying ${inputFilePath}:`, output.error);
    return;
  }

  fs.writeFileSync(outputFilePath, output.code, 'utf8');
  console.log(`Minified ${inputFilePath} to ${outputFilePath}`);
};

// Read all files in the input directory
fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error('Error reading input directory:', err);
    return;
  }

  files.forEach(file => {
    const inputFilePath = path.join(inputDir, file);
    const outputFilePath = path.join(outputDir, file.replace('.js', '.js')); //'.min.js'


    // Minify each file
    minifyFile(inputFilePath, outputFilePath);
  });
});
