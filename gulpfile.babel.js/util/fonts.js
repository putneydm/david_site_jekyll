const { src, dest } = require('gulp');
import { paths } from "../variables"

const cssBase64 = require('gulp-css-base64');
const minifyCSS = require('gulp-clean-css'); // Add var prefix for consistency

const {
    fonts: {
        input: input,
        testing: test,
        dist: dist
    }
} = paths;

function fonts() {
    return src(input)
        .pipe(cssBase64({
            maxImageSize: 8 * 10024 // bytes
        }))
        .pipe(dest(test))
        .pipe(minifyCSS({
            keepBreaks: false
        }))
        .pipe(dest(dist));
}


exports.fonts = fonts;
