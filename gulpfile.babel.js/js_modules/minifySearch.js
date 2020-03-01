const { src, dest } = require('gulp');
import { paths, cacheBustNames } from "../variables"

const minifyJS = require('gulp-uglify');
const sourcemaps = require("gulp-sourcemaps");
const rename = require('gulp-rename');
const babel = require("gulp-babel");

const { searchname } = cacheBustNames;

const {
    scripts: {
        search: search,
        testing: test,
        dist: dist
    }
} = paths;

function minifySearch() {
    return src(search)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(rename(searchname))
    .pipe(minifyJS())
    .pipe(sourcemaps.write("."))
    .pipe(dest(test))
    .pipe(dest(dist))
}

exports.minifySearch = minifySearch;