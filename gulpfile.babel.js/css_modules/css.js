const { src, dest } = require('gulp');
import { paths, cacheBustNames } from "../variables"

const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require("gulp-sourcemaps");
const scsslint = require('gulp-scss-lint');
// postcss plugins
const postcss = require('gulp-postcss');
const pixelstorem = require('postcss-pixels-to-rem');
const gradient = require('postcss-easing-gradients');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const { filename } = cacheBustNames;

const {
    styles: {
        input: input,
        exclude: exclude,
        testing: test,
        dist: dist
    }
} = paths;

// lints and minifies css, moves to testing and dist
function css() {
    var plugins = [
        autoprefixer({ overrideBrowserslist:['last 2 version','>1%','ios 7'] }),
        gradient(),
        pixelstorem({
            base: 16,
            unit: "rem",
            exclude: ['border', 'border-left', 'border-right', 'border-top', 'border-bottom', 'background-size'],
            mediaQueries: true
        }),
        cssnano()
    ];
    return src([input, exclude])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(rename(filename))
        .pipe(sourcemaps.write("."))
        .pipe(dest(test))
        .pipe(dest(dist));
}

exports.css = css;