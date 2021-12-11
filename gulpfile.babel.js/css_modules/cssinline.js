const { src, dest } = require('gulp');
import { paths } from "../variables"

const sass = require('gulp-sass');
// postcss plugins
const postcss = require('gulp-postcss');
const pixelstorem = require('postcss-pixels-to-rem');
const gradient = require('postcss-easing-gradients');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

// const { filename } = cacheBustNames;

const {
    styles: {
        inputInline: input,
        outputInline: output,
    }
} = paths;


function cssInline() {
    const plugins = [
        autoprefixer({ overrideBrowserslist:['last 2 version','>1%','ios 7'] }),
        cssnano(),
        gradient(),
        pixelstorem({
            base: 16,
            unit: "rem",
            exclude: ['border', 'border-left', 'border-right', 'border-top', 'border-bottom', 'background-size'],
            mediaQueries: true
        })
    ];
    return src(input)
        // .pipe(scsslint())
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(dest(output))
}

exports.cssInline = cssInline;