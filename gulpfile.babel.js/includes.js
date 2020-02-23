const { src, dest } = require('gulp');
import { paths, cacheBustNames } from "./variables"

const { filename } = cacheBustNames;

const {
    includes: {
        input: input,
        testing: test,
    }
} = paths;

const replace = require('gulp-replace');
const fileinclude = require('gulp-file-include');

function includes() {
    return src(input)
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(replace(/cachebustthiscss/g, filename)) // adds cachebusted name of css to js links file
    .pipe(dest(test))
}

exports.includes = includes;