const { src, dest } = require('gulp');
import { paths, cacheBustNames } from "../variables"
const { scriptname } = cacheBustNames;

const replace = require('gulp-replace');
const fileinclude = require('gulp-file-include');

const { 
    pages: {
        input: input,
        exclude: exclude,
        testing: test
    }
} = paths;

//  compiles pages from partials
function pages() {
    return src(['!' + exclude, input])
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(replace(/\*cachebustthis\*/g, scriptname)) // adds cachebusted name of scripts to js links file
    .pipe(dest(test))
}

exports.pages = pages;