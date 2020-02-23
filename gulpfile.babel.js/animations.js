const { src, dest } = require('gulp');
import { paths } from "./variables"

const {
    styles: {
        outputInline: output,
    }
} = paths;

function animations() {
    src("src/sass/inline_styles/search_animations.css")
        .pipe(dest(output));
};

exports.animations = animations;