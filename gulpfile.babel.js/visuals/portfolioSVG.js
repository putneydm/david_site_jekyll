const { src, dest } = require('gulp');
import { paths } from "../variables"

//svg
const svgSprite = require('gulp-svg-sprites');

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