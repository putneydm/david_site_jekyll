import { deploy } from "./deploy"
import { layouts } from "./layouts"
import { concatJs } from "./concat"
import { pages } from "./pages"
import { includes } from "./includes"
import { animations } from "./animations"

const { src, dest, parallel, series } = require('gulp');

exports.default = series(layouts, pages, includes);
exports.deploy = deploy;
exports.layouts = layouts;
exports.concatJs = concatJs;
exports.pages = pages;
exports.includes = includes;
exports.animations = animations;