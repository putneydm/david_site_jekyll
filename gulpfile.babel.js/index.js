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