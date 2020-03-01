import { deploy } from "./deploy"
import { layouts } from "./html_modules/layouts"
import { concatJs } from "./js_modules/concat"
import { pages } from "./html_modules/pages"
import { includes } from "./html_modules/includes"
import { animations } from "./animations"
import { cachebustScripts } from "./js_modules/cachebustscripts"
import { lintJS } from "./js_modules/lintjs"
import { minifyScripts } from "./js_modules/minifyScripts"
import { minifySearch } from "./js_modules/minifySearch"
import { cleanJS } from "./cleaners/cleanjs"
import { minifyInlineScripts } from "./js_modules/minifyinlinescripts"
import { css } from "./css_modules/css"
import { cssInline } from "./css_modules/cssinline"
import { svg } from "./visuals/svg"
import { bower } from "./movers/bower"
import { collections } from "./movers/collections"
import { cleanFolders } from "./cleaners/cleanfolders"
import { blogImages } from "./visuals/blogimages"
import { heroImages } from "./visuals/heroimages"
import { heroIndex } from "./visuals/heroimagesindex"
import { cleanCSS } from "./cleaners/cleanCSS"
import { cleanPages } from "./cleaners/cleanPages"

import { paths } from "./variables"

const { src, dest, parallel, series } = require('gulp');



exports.default = series(layouts, pages, includes);
exports.deploy = deploy;
exports.layouts = layouts;
exports.concatJs = concatJs;
exports.pages = pages;
exports.includes = includes;
exports.animations = animations;
exports.cachebustScripts = cachebustScripts;
exports.lintJS = lintJS;
exports.minifyScripts = minifyScripts;
exports.minifySearch = minifySearch;
exports.cleanJS = cleanJS;
exports.minifyInlineScripts = minifyInlineScripts;
exports.css = css;
exports.cssInline = cssInline;
exports.svg = svg;
exports.bower = bower;
exports.collections = collections;
exports.cleanFolders = cleanFolders;
exports.blogImages = blogImages;
exports.heroImages = heroImages;
exports.heroIndex = heroIndex;
exports.cleanCSS = cleanCSS;
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



