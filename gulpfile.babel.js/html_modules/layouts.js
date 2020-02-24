const { src, dest } = require('gulp');
import { paths, cacheBustNames } from "../variables"

const fileinclude = require('gulp-file-include');
const replace = require('gulp-replace');
const { scriptname, searchname, adminname } = cacheBustNames;
const {
    pageLayouts: {
        input: input,
        testing: test,
    }
} = paths;

// moves page templates from src to testing
function layouts() {
    return src(input)
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(replace(/\*cachebustthis\*/g, scriptname)) // adds cachebusted name of scripts to js links file
    .pipe(replace(/\*cachebustsearch\*/g, searchname)) // adds cachebusted name of scripts to js links file
    .pipe(replace(/\*cachebustadmin\*/g, adminname)) // adds cachebusted name of scripts to js links file

    .pipe(dest(test))
}

exports.layouts = layouts;