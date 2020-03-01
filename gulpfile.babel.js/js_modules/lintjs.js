const { src } = require('gulp');
import { paths } from "../variables"

const eslint = require('gulp-eslint');

const {
    scripts: {
        input: input,
        inline: inline,
        exclude: exclude,
        vendor: vendor
    }
} = paths;

function lintJS(cb) {
    return src([input, `!${inline}`, `!${exclude}`, `!${vendor}`])
        // .pipe(jshint())
        .pipe(eslint({
            "parser": "babel-eslint",
            rules: {
                'no-alert': 0,
                'no-bitwise': 0,
                'camelcase': 1,
                'curly': 1,
                'eqeqeq': 0,
                'no-eq-null': 0,
                'guard-for-in': 1,
                'no-empty': 1,
                'no-use-before-define': 1,
                'no-obj-calls': 2,
                'no-unused-vars': 1,
                'new-cap': 1,
                'no-shadow': 0,
                'strict': 1,
                'no-invalid-regexp': 2,
                'comma-dangle': 2,
                'no-undef': 1,
                'no-new': 1,
                'no-extra-semi': 1,
                'no-debugger': 2,
                'no-caller': 1,
                'semi': 1,
                'quotes': 1,
                'no-unreachable': 2,
                'jsx-quotes': 1
            },
            envs: [
                'browser', 'es6'
            ],
            // plugins: ["react"],
            extends: {
                eslint: "recommended"
            }
        }))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError())
    // .pipe(jshint.reporter(stylish));
    cb()
}

exports.lintJS = lintJS;