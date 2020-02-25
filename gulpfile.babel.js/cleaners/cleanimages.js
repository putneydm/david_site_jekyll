const { src, dest} = require('gulp');
import { paths } from "../variables"

const clean = require('gulp-rimraf');

const {
    images: {
        input: input,
        output: output
    }
} = paths;

function cleanImages() {
    src(input)
    .pipe(clean())
    .pipe(dest(output));
}

exports.cleanImages = cleanImages;