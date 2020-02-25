const { src, dest } = require('gulp');
import { paths } from "../variables"

const minifyCSS = require('gulp-clean-css'); // Add var prefix for consistency

const {
    mini: {
        input: input,
        output: output
    }
} = paths;

// update this if I ever need to change fonts
function minifyFonts() {
  src(input)
    .pipe(minifyCSS({
      keepBreaks:false
    }))
    .pipe(dest(output));
};

exports.minifyFonts = minifyFonts;
