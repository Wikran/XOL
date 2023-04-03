const fs = require('fs');
//const uglify = require('uglify-js');
const uglify = require('C:\\Users\\wikra\\node_modules\\uglify-js');

const options = {
  mangle: true,
  compress: true,
};

//const inputFilePath = './src/main.js';
//const outputFilePath = './dist/main.js';
const inputFilePath = 'C:/HTML/XOL/mains.js'; 
const outputFilePath = 'C:/HTML/XOL/main.js';



const input = fs.readFileSync(inputFilePath, 'utf8');
const output = uglify.minify(input, options);

fs.writeFileSync(outputFilePath, output.code, 'utf8');
