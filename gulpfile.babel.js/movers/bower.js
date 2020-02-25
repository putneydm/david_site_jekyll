const { src, dest } = require('gulp');
import { paths } from "../variables"

const mainBowerFiles = require('main-bower-files');

const {
    bower: {
        components: components,
        json: json,
        vendor: vendor
    }
} = paths;


function bower() {
    return src(mainBowerFiles({
        paths: {
            bowerDirectory: components,
            bowerJson: json
        }
    }))
    .pipe(dest(vendor))
}

exports.bower = bower;