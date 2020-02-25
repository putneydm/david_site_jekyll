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

// Large images
function blogImagesLarge(done) {
    return src(input)
        .pipe(gm(function (gmfile) {
            return gmfile.setFormat('jpg'),
                gmfile.resample(72, 72),
                gmfile.thumbnail(1400, '824!'),
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

// x-small images
function blogImagesXSmall(done) {
    return src(input)
        .pipe(gm(function (gmfile) {
            return gmfile.setFormat('jpg'),
                gmfile.resample(72, 72),
                gmfile.thumbnail(450, '265!'),
                gmfile.quality(82),
                gmfile.filter('triangle'),
                gmfile.unsharp('0.25x0.25+8+0.065'),
                gmfile.interlace('none'),
                gmfile.colorspace('sRGB'),
                gmfile.crop(450, 265, 0, 0);
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
            prefix: 'xsmall_'
        }))

        .pipe(dest(test))
        .pipe(dest(dist));
        done()
}

// Medium images
function blogImagesMed(done) {
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
            prefix: 'med_'
        }))

        .pipe(dest(test))
        .pipe(dest(dist));
        done()
}


exports.blogImages = parallel(blogImagesLarge, blogImagesXSmall, blogImagesMed);
