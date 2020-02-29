const { src } = require('gulp');
import { paths, cacheBustNames } from "../variables"
const { scriptname } = cacheBustNames;

const replace = require('gulp-replace');

const {
    pageLayouts: { 
        links: links
    }
} = paths;


//adds cachebusted
function cachebustScripts() {
    return src(links)
    .pipe(replace(/\*cachebustthis\*/g, scriptname)) // adds cachebusted name of scripts to js links file
}

exports.cachebustScripts = cachebustScripts;
