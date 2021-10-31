const { src, dest, series } = require('gulp');
import { paths } from "../variables"

const cleanFiles = require('gulp-clean');

const {
    images: {
        input: input,
        output: output
    }
} = paths;

function moveImages() {
    console.log("move")
    return src(input)
    .pipe(dest(output))
}

function cleanImages(cb) {
    return src(input, { read: false })
        .pipe(cleanFiles())
        cb();
}

exports.moveImages = series(moveImages, cleanImages);




