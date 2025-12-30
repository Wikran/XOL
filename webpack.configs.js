const path = require('path');
const glob = require('glob');

module.exports = {
  entry: glob.sync('./src/**/*.js').reduce((entries, file) => {
    const entry = path.basename(file, path.extname(file));
    entries[entry] = './' + file.replace(/\\/g, '/');
    return entries;
  }, {}),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  stats: {
    errorDetails: true
  }
};


