const { src } = require('gulp');
import { paths } from "../variables"

const cleanFiles = require('gulp-clean');

const {
    pages: {
        testing: test,
    }
} = paths;
 
function cleanPages(cb) {
    return src([`${test}/*.html`], { read: false })
        .pipe(cleanFiles())
        cb();
}

exports.cleanPages = cleanPages; 