const { src, dest } = require('gulp');
import { paths } from "../variables"

//svg
// const svgstore = require('gulp-svgstore');
// const svgmin = require('gulp-svgmin');
const svgSprite = require('gulp-svg-sprites');
// const rename = require('gulp-rename');

const {
    portfolioSVG: {
        input: input,
        output: output,
    }
} = paths;

const config = {
  mode: "symbols", 
  preview: false, 
  baseSize: 18,
  svg: {
    symbols: "port_svgsprite.svg"
},
}
// creates svg sprite and moves it to testing and dist
function portfolioSVG() {
    return src(input)
    .pipe(svgSprite(config))
    .pipe(dest(output))
}

exports.portfolioSVG = portfolioSVG;