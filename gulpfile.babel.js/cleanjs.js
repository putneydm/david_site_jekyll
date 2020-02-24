const { src } = require('gulp');
import { paths } from "./variables"

const cleanFiles = require('gulp-clean');

const {
    scripts: {
        dist: dist,
        testing: test
    }
} = paths;

function cleanJS() {
    return src([
        `${test}/*.js`, `${dist}/*.js`
    ], { read: false })
        .pipe(cleanFiles())
}

exports.cleanJS = cleanJS;