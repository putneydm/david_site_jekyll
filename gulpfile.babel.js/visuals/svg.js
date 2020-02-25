const { src, dest } = require('gulp');
import { paths } from "../variables"

//svg
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');

const {
    svg: {
        input: input,
        output: output,
    }
} = paths;

// creates svg sprite and moves it to testing and dist
function svg() {
    return src(input)
        .pipe(svgmin())
        .pipe(svgstore())
        .pipe(rename({
            basename: 'svgsprite',
            extname: '.svg'
        }))
        .pipe(dest(output))
}

exports.svg = svg;