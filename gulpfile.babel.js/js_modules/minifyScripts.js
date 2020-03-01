const { src, dest } = require('gulp');
import { paths, cacheBustNames } from "../variables"

const minifyJS = require('gulp-uglify');
const sourcemaps = require("gulp-sourcemaps");
const rename = require('gulp-rename');

const { adminname } = cacheBustNames;

const {
    scripts: {
        admin: admin,
        testing: test,
        dist: dist
    }
} = paths;

function minifyScripts() {
    src(admin)
    .pipe(sourcemaps.init())
    //  .pipe(babel())
    .pipe(rename(adminname))
    .pipe(minifyJS())
    .pipe(sourcemaps.write("."))
    .pipe(dest(test))
    .pipe(dest(dist));
}

exports.minifyScripts = minifyScripts;