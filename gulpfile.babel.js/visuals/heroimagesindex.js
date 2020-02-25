const { src, dest, parallel } = require('gulp');
import { paths } from "../variables"

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

// Large hero
function largeHeroIndex(done) {
    src(input)
        .pipe(gm(function (gmfile) {
            return gmfile.setFormat('jpg'),
                gmfile.resample(72, 72),
                gmfile.thumbnail(2300, '1040!'),
                gmfile.quality(82),
                gmfile.filter('triangle'),
                gmfile.unsharp('0.25x0.25+8+0.065'),
                gmfile.interlace('none'),
                gmfile.colorspace('sRGB')
            gmfile.crop(2300, 1040, 0, 0);

            // gulp // Again, I don't think this belongs here
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
        done()
}


// Medium
function medHeroIndex(done) {
    return src(input)
        .pipe(gm(function (gmfile) {
            return gmfile.setFormat('jpg'),
                gmfile.resample(72, 72),
                gmfile.thumbnail(1500, '679^'),
                gmfile.quality(82),
                gmfile.filter('triangle'),
                gmfile.unsharp('0.25x0.25+8+0.065'),
                gmfile.interlace('none'),
                gmfile.colorspace('sRGB'),
                gmfile.crop(1500, 679, 0, 0);
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
        done()
}

    // Small
function smallHeroIndex(done) {
    return src(input)
        .pipe(gm(function (gmfile) {
            return gmfile.setFormat('jpg'),
                gmfile.resample(72, 72),
                gmfile.thumbnail(1000, '453^'),
                gmfile.quality(82),
                gmfile.filter('triangle'),
                gmfile.unsharp('0.25x0.25+8+0.065'),
                gmfile.interlace('none'),
                gmfile.colorspace('sRGB'),
                gmfile.crop(1000, 453, 0, 0);
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
        done()
}

    // Large PL
function largePlIndex(done) {
    return src(input)
        .pipe(gm(function (gmfile) {
            return gmfile.setFormat('jpg'),
                gmfile.resample(20, 20),
                gmfile.thumbnail(900, '407^'),
                gmfile.quality(10),
                gmfile.filter('triangle'),
                gmfile.unsharp('0.25x0.25+8+0.065'),
                gmfile.interlace('none'),
                gmfile.colorspace('sRGB'),
                gmfile.crop(900, 407, 0, 0);
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
        done()
}

// Small PL
function smallPlIndex(done) {
    return src(input)
        .pipe(gm(function (gmfile) {
            return gmfile.setFormat('jpg'),
                gmfile.resample(20, 20),
                gmfile.thumbnail(500, '227^'),
                gmfile.quality(82),
                gmfile.filter('triangle'),
                gmfile.unsharp('0.25x0.25+8+0.065'),
                gmfile.interlace('none'),
                gmfile.colorspace('sRGB'),
                gmfile.crop(500, 227, 0, 0);
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
        done()
}

exports.heroIndex = parallel(largeHeroIndex, medHeroIndex, smallHeroIndex, largePlIndex, smallPlIndex)