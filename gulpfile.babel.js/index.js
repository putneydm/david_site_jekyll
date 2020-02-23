import { paths, cacheBustNames } from "./variables"
import { deploy } from "./deploy"
import { layouts } from "./layouts"

const { src, dest, parallel, series } = require('gulp');

//scripts
const concat = require('gulp-concat');
const minifyJS = require('gulp-uglify');
// const jshint = require('gulp-jshint');
// const babel = require("gulp-babel");
// const eslint = require('gulp-eslint');
const sourcemaps = require("gulp-sourcemaps");

// html
// const minifyHTML = require('gulp-minify-html');

// utility
const replace = require('gulp-replace');
const fileinclude = require('gulp-file-include');




const { filename, scriptname, searchname, adminname } = cacheBustNames;



function concatJs() {
  // return src([paths.scripts.input, '!' + paths.scripts.inline, '!' + paths.scripts.exclude])
  return src([paths.scripts.input])
    .pipe(sourcemaps.init())
    // .pipe(babel())
    .pipe(concat(scriptname)) // renames to file w/ todays date for cachebusting
    .pipe(replace(/this\.loadCSS.*/g, 'this.loadCSS(\'/css/' + filename + '\');')) // adds cachebusted name of css to css lazyload
    .pipe(minifyJS())
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.scripts.testing))
    .pipe(dest(paths.scripts.dist));
}


//  compiles pages from partials
function pages() {
  return src(['!' + paths.pages.exclude, paths.pages.input])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(replace(/\*cachebustthis\*/g, scriptname)) // adds cachebusted name of scripts to js links file
    .pipe(dest(paths.pages.testing))
}
function includes() {
  return src(paths.includes.input)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(replace(/cachebustthiscss/g, filename)) // adds cachebusted name of css to js links file
    .pipe(dest(paths.includes.testing))
}



function animations() {
  src("src/sass/inline_styles/search_animations.css")
    .pipe(dest(paths.styles.outputInline));
};




exports.default = series(layouts, pages, includes);
exports.deploy = deploy;
exports.layouts = layouts;