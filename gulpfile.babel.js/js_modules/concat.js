const { src, dest } = require('gulp');
import { paths, cacheBustNames } from "../variables"
const { filename, scriptname } = cacheBustNames;

// const eslint = require('gulp-eslint');
const sourcemaps = require("gulp-sourcemaps");
const concat = require('gulp-concat');
const minifyJS = require('gulp-uglify');
const replace = require('gulp-replace');

const {
    scripts: {
        input: input,
        inline: inline,
        exclude: exclude,
        testing: test,
        dist: dist
    }
} = paths;

function concatJs() {
    return src([input, `!${inline}`, `!${exclude}`])
        .pipe(sourcemaps.init())
        // .pipe(babel())
        .pipe(concat(scriptname)) // renames to file w/ todays date for cachebusting
        .pipe(replace(/this\.loadCSS.*/g, `this.loadCSS('/css/${filename}');`)) // adds cachebusted name of css to css lazyload
        .pipe(minifyJS())
        .pipe(sourcemaps.write("."))
        .pipe(dest(test))
        .pipe(dest(dist));
}

exports.concatJs = concatJs;

