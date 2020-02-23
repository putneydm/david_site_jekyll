const { src, dest, series } = require('gulp');
import { paths, googleAnalytics } from "./variables"

const replace = require('gulp-replace');
const minifyHTML = require('gulp-minify-html');

const {
    pages: {
        site: pagesIn,
        deploy: pagesDeploy,
    },
    sitemap: {
        input: sitemapIn,
        output: sitemapOut
    },
        icons: {
        input: iconsIn,
        output: iconsOut
    }
} = paths;

function prepPages() {
    return src(pagesIn)
        .pipe(replace(/yygoogleanlyticsxx/g, googleAnalytics)) // google analytics number to site
        .pipe(minifyHTML())
        .pipe(dest(pagesDeploy));
}

function icons() {
    return src(iconsIn)
        .pipe(dest(iconsOut));
}

function sitemap() {
    return src(sitemapIn)
        .pipe(dest(sitemapOut));
}

exports.deploy = series(prepPages, icons, sitemap);