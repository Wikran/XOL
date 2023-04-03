const fs = require('fs');
const uglify = require('uglify-js');

const options = {
  mangle: true,
  compress: true,
};

const inputFilePath = 'C:/HTML/XOL/index.js'; 
const outputFilePath = 'C:/HTML/XOL/index.min.js';

const input = fs.readFileSync(inputFilePath, 'utf8');
const output = uglify.minify(input, options);

fs.writeFileSync(outputFilePath, output.code, 'utf8');
