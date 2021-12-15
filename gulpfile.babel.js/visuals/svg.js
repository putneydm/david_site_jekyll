const { src, dest } = require('gulp');
import { paths } from "../variables"

//svg
const svgSprite = require('gulp-svg-sprites');

const {
    svg: {
        input: input,
        output: output,
    }
} = paths;

// creates svg sprite and moves it to testing and dist
const config = {
    mode: "symbols", 
    preview: false, 
    baseSize: 18,
    svg: {
      symbols: "svgsprite.svg"
  },
  }
  // creates svg sprite and moves it to testing and dist
  function svg() {
      return src(input)
      .pipe(svgSprite(config))
      .pipe(dest(output))
  }

exports.svg = svg;