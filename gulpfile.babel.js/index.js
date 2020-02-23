import { paths, cacheBustNames } from "./variables"
import { deploy } from "./deploy"
import { layouts } from "./layouts"
import { concatJs } from "./concat"
import { pages } from "./pages"
import { includes } from "./includes"

const { src, dest, parallel, series } = require('gulp');

//scripts
// const concat = require('gulp-concat');
// const minifyJS = require('gulp-uglify');
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


//  compiles pages from partials
// function pages() {
//   return src(['!' + paths.pages.exclude, paths.pages.input])
//     .pipe(fileinclude({
//       prefix: '@@',
//       basepath: '@file'
//     }))
//     .pipe(replace(/\*cachebustthis\*/g, scriptname)) // adds cachebusted name of scripts to js links file
//     .pipe(dest(paths.pages.testing))
// }
// function includes() {
//   return src(paths.includes.input)
//     .pipe(fileinclude({
//       prefix: '@@',
//       basepath: '@file'
//     }))
//     .pipe(replace(/cachebustthiscss/g, filename)) // adds cachebusted name of css to js links file
//     .pipe(dest(paths.includes.testing))
// }

function animations() {
  src("src/sass/inline_styles/search_animations.css")
    .pipe(dest(paths.styles.outputInline));
};




exports.default = series(layouts, pages, includes);
exports.deploy = deploy;
exports.layouts = layouts;

exports.concatJs = concatJs;

exports.pages = pages;

exports.includes = includes;