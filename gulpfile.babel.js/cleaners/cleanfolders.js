import { paths } from "../variables"
const del = require('del');

const {
    remove: {
        input: input,
        exclude: exclude
    }
} = paths;

function cleanFolders(cb) {
    return del([
        input, exclude
    ]);
    cb()
}

exports.cleanFolders = cleanFolders;