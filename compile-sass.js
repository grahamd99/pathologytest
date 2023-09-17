const sass = require('node-sass');
const fs = require('fs');

// Input and output file paths
const inputFile = 'src/scss/styles.scss';
const outputFile = 'src/scss/styles.css';

// Compile Sass to CSS
sass.render(
  {
    file: inputFile,
    outFile: outputFile,
  },
  (error, result) => {
    if (!error) {
      // Write the compiled CSS to the output file
      fs.writeFileSync(outputFile, result.css);
      console.log('Sass compilation successful.');
    } else {
      console.error('Sass compilation error:', error);
    }
  }
);
