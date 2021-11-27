const { src, dest, parallel, series } = require('gulp');
import { paths } from "../variables"
import { moveSlides } from "../movers/moveSlides"

//images
const imagemin = require('gulp-imagemin');
const jpegtran = require('imagemin-jpegtran');
const gm = require('gulp-gm');
const rename = require('gulp-rename');

const {
    slides: {
        input: input,
        testing: test,
        dist: dist,
    }
} = paths;

exports.moveSlides = moveSlides;

function slideImagesLarge(done) {
    return src(input)
        .pipe(gm(function (gmfile) {
            return gmfile.setFormat('jpg'),
                gmfile.resample(72, 72),
                gmfile.thumbnail(3600, '2120!'),
                gmfile.quality(82),
                gmfile.filter('triangle'),
                gmfile.unsharp('0.25x0.25+8+0.065'),
                gmfile.interlace('none'),
                gmfile.colorspace('sRGB'),
                gmfile.crop(1400, 824, 0, 0);
        }, {
            imageMagick: true
        }
        ))

        // Crunches Images
        .pipe(imagemin({
            progressive: true,
            use: [jpegtran()]
        }))

        // Renames Images
        .pipe(rename({
            prefix: 'large_'
        }))
        .pipe(dest(test))
        .pipe(dest(dist));
        done();
    }


// Large medium
function slideImagesMed(done) {
    return src(input)
        .pipe(gm(function (gmfile) {
            return gmfile.setFormat('jpg'),
                gmfile.resample(72, 72),
                gmfile.thumbnail(1800, '1060!'),
                gmfile.quality(82),
                gmfile.filter('triangle'),
                gmfile.unsharp('0.25x0.25+8+0.065'),
                gmfile.interlace('none'),
                gmfile.colorspace('sRGB'),
                gmfile.crop(1400, 824, 0, 0);
        }, {
            imageMagick: true
        }
        ))

        // Crunches Images
        .pipe(imagemin({
            progressive: true,
            use: [jpegtran()]
        }))

        // Renames Images
        .pipe(rename({
            prefix: 'med_'
        }))

        .pipe(dest(test))
        .pipe(dest(dist));
        done();
    }

// Small images
function slideImagesSmall(done) {
    src(input)
        .pipe(gm(function (gmfile) {
            return gmfile.setFormat('jpg'),
                gmfile.resample(72, 72),
                gmfile.thumbnail(900, '530!'),
                gmfile.quality(82),
                gmfile.filter('triangle'),
                gmfile.unsharp('0.25x0.25+8+0.065'),
                gmfile.interlace('none'),
                gmfile.colorspace('sRGB'),
                gmfile.crop(900, 530, 0, 0);
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
            prefix: 'small_'
        }))

        .pipe(dest(test))
        .pipe(dest(dist));
        done()
}

exports.slideImages = series(parallel(slideImagesLarge, slideImagesMed, slideImagesSmall), series(moveSlides));
