const { src } = require('gulp');
import { paths } from "../variables"

const cleanFiles = require('gulp-clean');

const {
    styles: {
        testing: test,
        dist: dist
    }
} = paths;

function cleanCss() {
    return src([
        `${test}/*.css`, `${dist}/*.css`, `${test}/*.css.map`, `${dist}/*.css.map`,
    ], { read: false })
        .pipe(cleanFiles())
}

exports.cleanCSS = cleanCss;

