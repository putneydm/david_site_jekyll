const { src } = require('gulp');
import { paths } from "../variables"

const cleanFiles = require('gulp-clean');

const {
    scripts: {
        dist: dist,
        testing: test
    }
} = paths;

function cleanJS() {
    return src([
        `${test}/*.js`, `${dist}/*.js`, `${test}/*.js.map`, `${dist}/*.js.map`
    ], { read: false })
        .pipe(cleanFiles())
        cb();
}

exports.cleanJS = cleanJS;