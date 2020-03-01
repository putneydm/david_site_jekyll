const { src, dest} = require('gulp');
import { paths } from "../variables"

const clean = require('gulp-rimraf');

const {
    images: {
        input: input,
        output: output
    }
} = paths;

function cleanImages(cb) {
    src(input)
    .pipe(clean())
    .pipe(dest(output));
    cb();
}

exports.cleanImages = cleanImages;