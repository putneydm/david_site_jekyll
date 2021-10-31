const { src, dest, parallel, series } = require('gulp');
import { paths } from "../variables"
import { moveImages } from "../movers/moveImages"

//images
const imagemin = require('gulp-imagemin');
const jpegtran = require('imagemin-jpegtran');
const gm = require('gulp-gm');
const rename = require('gulp-rename');

const {
    images: {
        input: input,
        testing: test,
        dist: dist,
    }
} = paths;

exports.moveImages = moveImages;

// Large heros
function heroLarge() {
    return src(input)
        .pipe(gm(function (gmfile) {
            return gmfile.setFormat('jpg'),
                gmfile.resample(72, 72),
                gmfile.thumbnail(2300, '856^'),
                gmfile.quality(82),
                gmfile.filter('triangle'),
                gmfile.unsharp('0.25x0.25+8+0.065'),
                gmfile.interlace('none'),
                gmfile.colorspace('sRGB'),
                gmfile.crop(2300, 856, 0, 0);
        }, {
            imageMagick: true
        }))

        // Crunches images
        .pipe(imagemin({
            progressive: true,
            use: [jpegtran()]
        }))

        // Renames images
        .pipe(rename({
            prefix: 'hero_'
        }))

        .pipe(dest(test))
        .pipe(dest(dist));
}

// Medium
function heroMedium() {     
    return src(paths.images.input)
        .pipe(gm(function (gmfile) {
            return gmfile.setFormat('jpg'),
                gmfile.resample(72, 72),
                gmfile.thumbnail(1500, '558^'),
                gmfile.quality(82),
                gmfile.filter('triangle'),
                gmfile.unsharp('0.25x0.25+8+0.065'),
                gmfile.interlace('none'),
                gmfile.colorspace('sRGB'),
                gmfile.crop(1500, 558, 0, 0);
        }, {
            imageMagick: true
        }))

        // Crunches images
        .pipe(imagemin({
            progressive: true,
            use: [jpegtran()]
        }))

        // Renames images
        .pipe(rename({
            prefix: 'med_hero_'
        }))

        .pipe(dest(test))
        .pipe(dest(dist));
}

// Small
function heroSmall() {
    return src(paths.images.input)
        .pipe(gm(function (gmfile) {
            return gmfile.setFormat('jpg'),
                gmfile.resample(72, 72),
                gmfile.thumbnail(1000, '372^'),
                gmfile.quality(82),
                gmfile.filter('triangle'),
                gmfile.unsharp('0.25x0.25+8+0.065'),
                gmfile.interlace('none'),
                gmfile.colorspace('sRGB'),
                gmfile.crop(1000, 372, 0, 0);
        }, {
            imageMagick: true
        }))

        // Crunches images
        .pipe(imagemin({
            progressive: true,
            use: [jpegtran()]
        }))

        // Renames images
        .pipe(rename({
            prefix: 'sm_hero_'
        }))

        .pipe(dest(test))
        .pipe(dest(dist));
}

// Large PL
function plLarge() {
    return src(input)
        .pipe(gm(function (gmfile) {
            return gmfile.setFormat('jpg'),
                gmfile.resample(20, 20),
                gmfile.thumbnail(700, '260^'),
                gmfile.quality(10),
                gmfile.filter('triangle'),
                gmfile.unsharp('0.25x0.25+8+0.065'),
                gmfile.interlace('none'),
                gmfile.colorspace('sRGB'),
                gmfile.crop(700, 261, 0, 0);
        }, {
            imageMagick: true
        }))

        // Crunches images
        .pipe(imagemin({
            progressive: true,
            use: [jpegtran()]
        }))

        // Renames Images
        .pipe(rename({
            prefix: 'pl_hero_'
        }))

        .pipe(dest(test))
        .pipe(dest(dist));
}

    // Small PL
function plSmall() { 
    return src(input)
        .pipe(gm(function (gmfile) {
            return gmfile.setFormat('jpg'),
                gmfile.resample(20, 20),
                gmfile.thumbnail(300, '112^'),
                gmfile.quality(10),
                gmfile.filter('triangle'),
                gmfile.unsharp('0.25x0.25+8+0.065'),
                gmfile.interlace('none'),
                gmfile.colorspace('sRGB'),
                gmfile.crop(300, 112, 0, 0);
        }, {
            imageMagick: true
        }))

        // Crunches images
        .pipe(imagemin({
            progressive: true,
            use: [jpegtran()]
        }))

        // Renames images
        .pipe(rename({
            prefix: 'pl_hero_small_'
        }))
        .pipe(dest(test))
        .pipe(dest(dist));
}

exports.heroImages = series(parallel(heroLarge, heroMedium, heroSmall, plLarge, plSmall), series(moveImages));
