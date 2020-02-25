import { paths } from "../variables"
const del = require('del');

const {
    remove: {
        input: input,
        exclude: exclude
    }
} = paths;

function cleanFolders() {
    return del([
        input, exclude
    ]);
}

exports.cleanFolders = cleanFolders;