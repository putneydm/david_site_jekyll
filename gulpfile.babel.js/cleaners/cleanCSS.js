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
        test + '/*.css', dist + '/*.css'
    ], { read: false })
        .pipe(cleanFiles())
}

exports.cleanCSS = cleanCss;

