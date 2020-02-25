const { src, dest } = require('gulp');
import { paths } from "../variables"

const {
    collections: {
        input: input,
        output: output
    }
} = paths;

function collections() {
    return src(input)
    .pipe(dest(output))
}

exports.collections = collections;