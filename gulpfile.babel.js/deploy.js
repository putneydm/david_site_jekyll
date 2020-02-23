const { src, dest, series } = require('gulp');
import { paths, googleAnalytics } from "./variables"

const replace = require('gulp-replace');
const minifyHTML = require('gulp-minify-html');

function prepPages() {
    return src(paths.pages.site)
        .pipe(replace(/yygoogleanlyticsxx/g, googleAnalytics)) // google analytics number to site
        .pipe(minifyHTML())
        .pipe(dest(paths.pages.deploy));
}

function icons() {
    return src(paths.icons.input)
        .pipe(dest(paths.icons.output));
}

function sitemap() {
    return src(paths.sitemap.input)
        .pipe(dest(paths.sitemap.output));
}

exports.deploy = series(prepPages, icons, sitemap);