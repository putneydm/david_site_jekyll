const { src, dest, series } = require('gulp');
import { paths } from "../variables"

const cleanFiles = require('gulp-clean');

const {
    slides: {
        input: input,
        output: output
    }
} = paths;

function moveSlides() {
    return src(input)
    .pipe(dest(output))
}

function cleanImages(cb) {
    return src(input, { read: false })
        .pipe(cleanFiles())
        cb();
}

exports.moveSlides = series(moveSlides, cleanImages);