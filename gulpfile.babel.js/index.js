// cleaners
import { cleanJS } from "./cleaners/cleanjs"
import { cleanFolders } from "./cleaners/cleanfolders"
import { cleanCSS } from "./cleaners/cleanCSS"
import { cleanPages } from "./cleaners/cleanPages"
// css modules
import { css } from "./css_modules/css"
import { cssInline } from "./css_modules/cssinline"
// html 
import { layouts } from "./html_modules/layouts"
import { pages } from "./html_modules/pages"
import { includes } from "./html_modules/includes"
// scripts
import { cachebustScripts } from "./js_modules/cachebustscripts"
import { concatJs } from "./js_modules/concat"
import { lintJS } from "./js_modules/lintjs"
import { minifyScripts } from "./js_modules/minifyScripts"
import { minifySearch } from "./js_modules/minifySearch"
import { minifyInlineScripts } from "./js_modules/minifyinlinescripts"
// movers
import { bower } from "./movers/bower"
import { collections } from "./movers/collections"
// util

// visuals
import { svg } from "./visuals/svg"
import { portfolioSVG } from "./visuals/portfolioSVG"
import { blogImages } from "./visuals/blogimages"
import { heroImages } from "./visuals/heroimages"
import { heroIndex } from "./visuals/heroimagesindex"
import { slideImages } from "./visuals/slides"

// other
import { animations } from "./animations"
import { paths } from "./variables"
import { deploy } from "./deploy"

// variables
const { parallel, series, watch } = require('gulp');


// cleaners
exports.cleanJS = cleanJS;
exports.cleanFolders = cleanFolders;
exports.cleanCSS = cleanCSS;
exports.cleanPages = cleanPages; 
// css
exports.css = css;
exports.cssInline = cssInline;
// html
exports.layouts = layouts;
exports.pages = pages;
exports.includes = includes;
// scripts
exports.cachebustScripts = cachebustScripts;
exports.lintJS = lintJS;
exports.minifyScripts = minifyScripts;
exports.minifySearch = minifySearch;
exports.concatJs = concatJs;
exports.minifyInlineScripts = minifyInlineScripts;
// movers
exports.bower = bower;
exports.collections = collections;
// visuals
exports.svg = svg;
exports.portfolioSVG = portfolioSVG;
exports.blogImages = blogImages;
exports.heroImages = heroImages;
exports.heroIndex = heroIndex;
exports.slideImages = slideImages;
// other
exports.deploy = deploy;
exports.animations = animations;

// combined tasks
exports.default = series(parallel(cleanCSS, cleanJS, cleanPages), bower, svg, portfolioSVG, parallel(css, cssInline), parallel(concatJs, minifyInlineScripts), cachebustScripts, parallel(includes, layouts, pages, collections))

exports.rebuild = series(parallel(cleanCSS, cleanJS, cleanPages), parallel(css, cssInline), parallel(concatJs, minifyInlineScripts), cachebustScripts, parallel(includes, layouts, pages, collections))

// watcher
const {
  styles: {
    watch: inputCSS,
    inputInline: inputInlineCSS
  },
  scripts: {
    input: inputJS,
    inline: inlineJS
  },
  includes: {
    input: includesInput
  },
  pageLayouts: {
    input: layoutsInput
    },
  pages: {
    input: pagesInput
    },
} = paths;

function watchTask() {
  watch(
    [inputCSS, inputInlineCSS, inputJS, inlineJS, includesInput, layoutsInput, pagesInput],
    series(parallel(cleanCSS, cleanJS, cleanPages), parallel(css, cssInline), parallel(concatJs, minifyInlineScripts), cachebustScripts, parallel(includes, layouts, pages, collections))
  );
}

exports.watcher = watchTask;



