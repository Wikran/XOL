const fs = require('fs');
const uglify = require('uglify-js');

const options = {
  mangle: true,
  compress: true
};

const inputFilePath = './src/EMOE701.js';
const outputFilePath = './dist/EMOE701.js';

const input = fs.readFileSync(inputFilePath, 'utf8');
const output = uglify.minify(input, options);

fs.writeFileSync(outputFilePath, output.code, 'utf8');
