const { src, dest } = require('gulp');
import { paths, cacheBustNames } from "../variables"

const minifyJS = require('gulp-uglify');
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const replace = require('gulp-replace');

const { filename } = cacheBustNames;

const {
    scripts: {
        outputInline: output,
        inline: input,
    }
} = paths;

function minifyInlineScripts() {
    return src(input)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(replace(/this\.loadCSS.*/g, 'this.loadCSS(\'/css/' + filename + '\');')) // adds cachebusted name of css to css lazyload
    .pipe(minifyJS())
    .pipe(sourcemaps.write("."))
    .pipe(dest(output))
}

exports.minifyInlineScripts = minifyInlineScripts;