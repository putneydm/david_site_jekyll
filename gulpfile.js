
var gulp = require('gulp');

//scripts
var concat = require('gulp-concat'),
    minifyJS = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    babel = require("gulp-babel"),
    eslint = require('gulp-eslint'),
    sourcemaps = require("gulp-sourcemaps");

//css
var sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'), // Add var prefix for consistency
    scsslint = require('gulp-scss-lint'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano');

// html
 var minifyHTML = require('gulp-minify-html');

//images
var imagemin = require('gulp-imagemin'),
    jpegtran = require('imagemin-jpegtran'),
    gm = require('gulp-gm');

//fonts
var cssBase64 = require('gulp-css-base64');

//utility
var rename = require('gulp-rename'),
    clean = require('gulp-rimraf'),
    stylish = require('jshint-stylish'),
    rename = require('gulp-rename'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    fileinclude = require('gulp-file-include'),
    browserSync = require('browser-sync'),
    del = require('del'),
    replace = require('gulp-replace'),
    cleanFiles = require('gulp-clean');

//svg
var svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin');

//bower
var mainBowerFiles = require('main-bower-files');

// postcss
var postcss = require('gulp-postcss'),
    pixelstorem = require('postcss-pixels-to-rem');
    gradient = require('postcss-easing-gradients');

// gets today's date
var date = new Date(),
    rando = Math.floor((Math.random() * 1000000) + 1);

// creates file names based on date
var filename = 'styles-' + date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear() + 'xx.css';
var scriptname = 'script-' + date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear() + '.js';

var googleAnalytics = 'UA-56763803-1';

var paths = {
  pageLayouts: {
   input: 'src/layouts/**/{*.html,*shtml}',
   testing: 'test/_layouts/',
   watch: 'src/layouts/**/{*.html,*shtml}',
   dist: 'dist/'
  },
  pages: {
    input: 'src/pages/**/*',
    exclude: 'src/pages/{_partials,_partials/**}',
    testing: 'test/',
    watch: 'src/pages/**/*.html',
    site: 'test/_site/**/*html',
    deploy: 'dist/'
  },
  includes: {
   input: 'src/includes/*.html',
   testing: 'test/_includes/'
  },
  scripts: {
    input: 'src/scripts/**/*.js',
    exclude: 'src/scripts/exclude/*.js',
    inline: 'src/scripts/inline/*.js',
    outputInline: 'test/_includes',
    bower: 'src/scripts/bower_components/**/*.js',
    vendor: 'src/scripts/vendor/*.js',
    testing: 'test/scripts/',
    dist: 'dist/scripts/'
  },
  bower: {
   components: 'bower_components',
   json: 'bower.json',
   vendor: 'src/scripts/vendor/'
  },
  styles: {
    input: 'src/sass/styles.scss',
    inputInline: 'src/sass/inline_styles/{blog_embedded_styles.scss,index_embeded_styles.scss,main_embedded_styles.scss,error_page.scss}',
    outputInline: 'test/_includes',
    exclude: '!src/sass/partials/*.scss',
    testing: 'test/css/',
    dist: 'dist/css',
    watch: 'src/sass/**/*.scss'
  },
  remove: {
      input: 'test/css/*.css',
      exclude: '!test/css/styles.css'
  },
  images: {
    input: 'src/photos_in/{*.jpg,*.tiff,*.png}',
    output: 'src/photos_out/',
    testing: 'test/siteart/',
    dist: 'dist/siteart/'
  },
  svg: {
    input: 'src/svg/svg_in/*.svg',
    output: 'src/svg/'
  },
  fonts: {
    input: 'src/fonts/*.css',
    testing: 'test/fonts/',
    dist: 'dist/fonts/'
  },
  posts: {
    input: 'src/posts/**/*.markdown',
    output: 'test/_posts/'
  },
  collections: {
    input: 'src/collections/**/*.markdown',
    output: 'test/'
  },
  sitemap: {
    input: 'test/_site/sitemap.xml',
    output: 'dist/'
  },
  icons: {
    input: 'src/touch_icons/{*.ico,*.png}',
    output: 'dist/'
  }
};
// *** TASKS ***

// moves page templates from src to testing and dist
gulp.task('layouts', function() {
   gulp.src(paths.pageLayouts.input)
   .pipe(fileinclude({
     prefix: '@@',
     basepath: '@file'
   }))
  .pipe(replace(/\*cachebustthis\*/g,  scriptname )) // adds cachebusted name of scripts to js links file
   .pipe(gulp.dest(paths.pageLayouts.testing))
});
//  compiles pages from partials
gulp.task('pages', function() {
   gulp.src(['!' + paths.pages.exclude, paths.pages.input])
   .pipe(fileinclude({
     prefix: '@@',
     basepath: '@file'
   }))
  .pipe(replace(/\*cachebustthis\*/g,  scriptname )) // adds cachebusted name of scripts to js links file
   .pipe(gulp.dest(paths.pages.testing))
});
gulp.task('includes', function() {
   gulp.src(paths.includes.input)
   .pipe(fileinclude({
     prefix: '@@',
     basepath: '@file'
   }))
   .pipe(replace(/cachebustthiscss/g,  filename )) // adds cachebusted name of css to js links file
   .pipe(gulp.dest(paths.includes.testing))
});

// minifies and deploys pages to dist, moves sitemap and icons to dist
gulp.task('deploy', ['sitemap', 'icons'], function() {
   gulp.src(paths.pages.site)
   .pipe(replace(/yygoogleanlyticsxx/g,  googleAnalytics )) // google analytics number to site
    .pipe(minifyHTML())
   .pipe(gulp.dest(paths.pages.deploy));
});
// moves sitemap to dist
gulp.task('sitemap', function() {
   gulp.src(paths.sitemap.input)
   .pipe(gulp.dest(paths.sitemap.output));
});
// moves touch icons and favicon to dist
gulp.task('icons', function() {
  gulp.src(paths.icons.input)
  .pipe(gulp.dest(paths.icons.output));
});
// concatenates scripts, but not items in exclude folder. includes vendor folder
gulp.task('concat', function() {
   gulp.src([paths.scripts.input, '!' + paths.scripts.inline, '!' + paths.scripts.exclude])
   .pipe(sourcemaps.init())
   .pipe(babel())
   .pipe(concat(scriptname)) // renames to file w/ todays date for cachebusting
  //  .pipe(replace(/this\.loadCSS.*/g, 'this.loadCSS(\'/css/' + filename + '\');')) // adds cachebusted name of css to css lazyload
   .pipe(minifyJS())
   .pipe(sourcemaps.write("."))
   .pipe(gulp.dest(paths.scripts.testing))
   .pipe(gulp.dest(paths.scripts.dist));
});
//adds cachebusted
gulp.task('cachebustScripts', function() {
  return gulp.src('source/layouts/js_links.html')
  .pipe(replace(/\*cachebustthis\*/g,  scriptname )) // adds cachebusted name of scripts to js links file
});

// lints main javascript file for site
gulp.task('lint', function() {
  return gulp.src([paths.scripts.input, '!' + paths.scripts.inline, '!' +  paths.scripts.exclude, '!' + paths.scripts.vendor])
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
      'browser', 'es6', 'react'
    ],
    plugins: ["react"],
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
});

//minifies scripts in the exclude folder and moves unminified to testing and minified to dist
gulp.task('minifyScripts', function() {
   gulp.src(paths.scripts.exclude)
   .pipe(sourcemaps.init())
   .pipe(babel())
   .pipe(minifyJS())
   .pipe(sourcemaps.write("."))
   .pipe(gulp.dest(paths.scripts.testing))
   .pipe(gulp.dest(paths.scripts.dist));
});

gulp.task('minifyInlineScripts', function() {
   gulp.src(paths.scripts.inline)
   .pipe(sourcemaps.init())
   .pipe(babel())
   .pipe(replace(/this\.loadCSS.*/g, 'this.loadCSS(\'/css/' + filename + '\');')) // adds cachebusted name of css to css lazyload
   .pipe(minifyJS())
   .pipe(sourcemaps.write("."))
   .pipe(gulp.dest(paths.scripts.outputInline))
});

gulp.task('clean-js', function() {
  return gulp.src([
    paths.scripts.testing + '/*.js', paths.scripts.dist + '/*.js'
  ], {read: false})
		.pipe(cleanFiles())
})

// lints and minifies css, moves to testing and dist
gulp.task('css', function() {
  var plugins = [
    autoprefixer({browsers: ['last 2 versions']}),
    gradient(),
    pixelstorem({
      base: 16,
      unit: "rem",
      exclude: ['border', 'border-left', 'border-right', 'border-top', 'border-bottom', 'background-size','box-shadow' ],
      mediaQueries: true
    }),
    cssnano()
  ];
  gulp.src([paths.styles.input, paths.styles.exclude])
  .pipe(sourcemaps.init())
  .pipe(scsslint())
  .pipe(sass())
  .pipe(postcss(plugins))
  .pipe(rename(filename))
  .pipe(sourcemaps.write("."))
  .pipe(gulp.dest(paths.styles.testing))
  .pipe(gulp.dest(paths.styles.dist));
});

gulp.task('clean-css', function() {
  return gulp.src([
    paths.styles.testing + '/*.css', paths.styles.dist + '/*.css'
  ], {read: false})
		.pipe(cleanFiles())
})

gulp.task('css-inline', function() {
  var plugins = [
    autoprefixer({browsers: ['last 2 versions']}),
    cssnano(),
    gradient(),
    pixelstorem({
      base: 16,
      unit: "rem",
      exclude: ['border', 'border-left', 'border-right', 'border-top', 'border-bottom', 'background-size','box-shadow' ],
      mediaQueries: true
    })
  ];
  gulp.src([paths.styles.inputInline])
   .pipe(scsslint())
   .pipe(sass())
   .pipe(postcss(plugins))
    .pipe(gulp.dest(paths.styles.outputInline))
});

// creates svg sprite and moves it to testing and dist
gulp.task('svg', function () {
    return gulp
    .src(paths.svg.input)
    .pipe(svgmin())
    .pipe(svgstore())
    .pipe(rename ({
        basename: 'svgsprite',
        extname: '.svg'
    }))
     .pipe(gulp.dest(paths.svg.output))
});

// moves bower dependencies to vendor
gulp.task('bower', function() {
   return gulp.src(mainBowerFiles({
    paths: {
      bowerDirectory: paths.bower.components,
      bowerJson: paths.bower.json
    }
}))
    .pipe(gulp.dest(paths.bower.vendor))
});

gulp.task('collections', function() {
   gulp.src(paths.collections.input)
   .pipe(gulp.dest(paths.collections.output))
});

gulp.task('clean', function () {
  return del([
    paths.remove.input, paths.remove.exclude
  ]);
});

// creates blog images in four sizes, minifies, moves to testing and dist
gulp.task('blog-images', function () {

// Large images
gulp.src(paths.images.input)
  .pipe(gm(function (gmfile) {
     return gmfile.setFormat('jpg'),
  		gmfile.resample(72, 72),
      gmfile.thumbnail(1400, '824!'),
      gmfile.quality(82),
      gmfile.filter('triangle'),
      gmfile.unsharp('0.25x0.25+8+0.065'),
      gmfile.interlace('none'),
      gmfile.colorspace('sRGB'),
      gmfile.crop(1400, 824, 0, 0);
  }, {
    imageMagick: true
  }
))

  // Crunches Images
  .pipe(imagemin({
    progressive: true,
    use: [jpegtran()]
  }))

  // Renames Images
  .pipe(rename({
    prefix: 'large_'
  }))

  .pipe(gulp.dest(paths.images.testing))
  .pipe(gulp.dest(paths.images.dist));

  // x-small images
  gulp.src(paths.images.input)
    .pipe(gm(function (gmfile) {
         return gmfile.setFormat('jpg'),
      		 gmfile.resample(72, 72),
             gmfile.thumbnail(450, '265!'),
             gmfile.quality(82),
             gmfile.filter('triangle'),
             gmfile.unsharp('0.25x0.25+8+0.065'),
             gmfile.interlace('none'),
             gmfile.colorspace('sRGB'),
             gmfile.crop(450, 265, 0, 0);
    }, {
      imageMagick: true
    }))

    // Crunches images
    .pipe(imagemin({
      progressive: true,
      use: [jpegtran()]
    }))

    // Renames images
    .pipe(rename({
      prefix: 'xsmall_'
    }))

    .pipe(gulp.dest(paths.images.testing))
    .pipe(gulp.dest(paths.images.dist));

  // Medium images
  gulp.src(paths.images.input)
    .pipe(gm(function (gmfile){
      return gmfile.setFormat('jpg'),
      		 gmfile.resample(72, 72),
             gmfile.thumbnail(900, '530!'),
             gmfile.quality(82),
             gmfile.filter('triangle'),
             gmfile.unsharp('0.25x0.25+8+0.065'),
             gmfile.interlace('none'),
             gmfile.colorspace('sRGB'),
             gmfile.crop(900, 530, 0, 0);
    }, {
      imageMagick: true
    }))

    // Crunches images
    .pipe(imagemin({
      progressive: true,
      use: [jpegtran()]
    }))

    // Renames images
    .pipe(rename({
      prefix: 'med_'
    }))

    .pipe(gulp.dest(paths.images.testing))
    .pipe(gulp.dest(paths.images.dist));

    gulp.src(paths.images.input)
   .pipe(clean())
   .pipe(gulp.dest(paths.images.output));
});


gulp.task('hero', function () {

  // Large heros
  gulp.src(paths.images.input)
    .pipe(gm(function (gmfile){
      return gmfile.setFormat('jpg'),
       gmfile.resample(72, 72),
       gmfile.thumbnail(2300, '856^'),
       gmfile.quality(82),
       gmfile.filter('triangle'),
       gmfile.unsharp('0.25x0.25+8+0.065'),
       gmfile.interlace('none'),
       gmfile.colorspace('sRGB'),
       gmfile.crop(2300, 856, 0, 0);
    },{
      imageMagick: true
    }))

    // Crunches images
    .pipe(imagemin({
      progressive: true,
      use: [jpegtran()]
    }))

    // Renames images
    .pipe(rename({
      prefix: 'hero_'
    }))

    .pipe(gulp.dest(paths.images.testing))
    .pipe(gulp.dest(paths.images.dist));


  // Medium
  gulp.src(paths.images.input)
    .pipe(gm(function (gmfile){
         return gmfile.setFormat('jpg'),
             gmfile.resample(72, 72),
             gmfile.thumbnail(1500, '558^'),
             gmfile.quality(82),
             gmfile.filter('triangle'),
             gmfile.unsharp('0.25x0.25+8+0.065'),
             gmfile.interlace('none'),
             gmfile.colorspace('sRGB'),
             gmfile.crop(1500, 558, 0, 0);
    }, {
      imageMagick: true
    }))

    // Crunches images
    .pipe(imagemin({
      progressive: true,
      use: [jpegtran()]
    }))

    // Renames images
    .pipe(rename({
      prefix: 'med_hero_'
    }))

    .pipe(gulp.dest(paths.images.testing))
    .pipe(gulp.dest(paths.images.dist));


  // Small
  gulp.src(paths.images.input)
    .pipe(gm(function (gmfile){
      return gmfile.setFormat('jpg'),
          gmfile.resample(72, 72),
          gmfile.thumbnail(1000, '372^'),
          gmfile.quality(82),
          gmfile.filter('triangle'),
          gmfile.unsharp('0.25x0.25+8+0.065'),
          gmfile.interlace('none'),
          gmfile.colorspace('sRGB'),
          gmfile.crop(1000, 372, 0, 0);
    }, {
      imageMagick: true
    }))

    // Crunches images
    .pipe(imagemin({
      progressive: true,
      use: [jpegtran()]
    }))

    // Renames images
    .pipe(rename({
      prefix: 'sm_hero_'
    }))

    .pipe(gulp.dest(paths.images.testing))
    .pipe(gulp.dest(paths.images.dist));


  // Large PL
  gulp.src(paths.images.input)
    .pipe(gm(function (gmfile){
      return gmfile.setFormat('jpg'),
          gmfile.resample(20, 20),
          gmfile.thumbnail(700, '260^'),
          gmfile.quality(10),
          gmfile.filter('triangle'),
          gmfile.unsharp('0.25x0.25+8+0.065'),
          gmfile.interlace('none'),
          gmfile.colorspace('sRGB'),
          gmfile.crop(700, 261, 0, 0);
    }, {
      imageMagick: true
    }))

    // Crunches images
    .pipe(imagemin({
      progressive: true,
      use: [jpegtran()]
    }))

    // Renames Images
    .pipe(rename({
      prefix: 'pl_hero_'
    }))

    .pipe(gulp.dest(paths.images.testing))
    .pipe(gulp.dest(paths.images.dist));


  // Small PL
  gulp.src(paths.images.input)
    .pipe(gm(function (gmfile){
      return gmfile.setFormat('jpg'),
       gmfile.resample(20, 20),
       gmfile.thumbnail(300, '112^'),
       gmfile.quality(10),
       gmfile.filter('triangle'),
       gmfile.unsharp('0.25x0.25+8+0.065'),
       gmfile.interlace('none'),
       gmfile.colorspace('sRGB'),
       gmfile.crop(300, 112, 0, 0);
    }, {
      imageMagick: true
    }))

    // Crunches images
    .pipe(imagemin({
      progressive: true,
      use: [jpegtran()]
    }))

    // Renames images
    .pipe(rename({
      prefix: 'pl_hero_small_'
    }))
    .pipe(gulp.dest(paths.images.testing))
    .pipe(gulp.dest(paths.images.dist));

   gulp.src(paths.images.input)
   .pipe(clean())
   .pipe(gulp.dest(paths.images.output));
});


gulp.task('hero-index', function () {

  // Large heros
  gulp.src(paths.images.input)
    .pipe(gm(function (gmfile){
      return gmfile.setFormat('jpg'),
       gmfile.resample(72, 72),
       gmfile.thumbnail(2300, '1040!'),
       gmfile.quality(82),
       gmfile.filter('triangle'),
       gmfile.unsharp('0.25x0.25+8+0.065'),
       gmfile.interlace('none'),
       gmfile.colorspace('sRGB')
       gmfile.crop(2300, 1040, 0, 0);

             // gulp // Again, I don't think this belongs here
    },{
      imageMagick: true
    }))

    // Crunches images
    .pipe(imagemin({
      progressive: true,
      use: [jpegtran()]
    }))

    // Renames images
    .pipe(rename({
      prefix: 'hero_'
    }))

    .pipe(gulp.dest(paths.images.testing))
    .pipe(gulp.dest(paths.images.dist));


  // Medium
  gulp.src(paths.images.input)
    .pipe(gm(function (gmfile){
      return gmfile.setFormat('jpg'),
       gmfile.resample(72, 72),
       gmfile.thumbnail(1500, '679^'),
       gmfile.quality(82),
       gmfile.filter('triangle'),
       gmfile.unsharp('0.25x0.25+8+0.065'),
       gmfile.interlace('none'),
       gmfile.colorspace('sRGB'),
       gmfile.crop(1500, 679, 0, 0);
    }, {
      imageMagick: true
    }))

    // Crunches images
    .pipe(imagemin({
      progressive: true,
      use: [jpegtran()]
    }))

    // Renames images
    .pipe(rename({
      prefix: 'med_hero_'
    }))

    .pipe(gulp.dest(paths.images.testing))
    .pipe(gulp.dest(paths.images.dist));


  // Small
  gulp.src(paths.images.input)
    .pipe(gm(function (gmfile){
       return gmfile.setFormat('jpg'),
             gmfile.resample(72, 72),
             gmfile.thumbnail(1000, '453^'),
             gmfile.quality(82),
             gmfile.filter('triangle'),
             gmfile.unsharp('0.25x0.25+8+0.065'),
             gmfile.interlace('none'),
             gmfile.colorspace('sRGB'),
             gmfile.crop(1000, 453, 0, 0);
    }, {
      imageMagick: true
    }))

    // Crunches images
    .pipe(imagemin({
      progressive: true,
      use: [jpegtran()]
    }))

    // Renames images
    .pipe(rename({
      prefix: 'sm_hero_'
    }))

    .pipe(gulp.dest(paths.images.testing))
    .pipe(gulp.dest(paths.images.dist));


  // Large PL
  gulp.src(paths.images.input)
    .pipe(gm(function (gmfile){
       return gmfile.setFormat('jpg'),
          gmfile.resample(20, 20),
          gmfile.thumbnail(900, '407^'),
          gmfile.quality(10),
          gmfile.filter('triangle'),
          gmfile.unsharp('0.25x0.25+8+0.065'),
          gmfile.interlace('none'),
          gmfile.colorspace('sRGB'),
          gmfile.crop(900, 407, 0, 0);
    }, {
      imageMagick: true
    }))

    // Crunches images
    .pipe(imagemin({
      progressive: true,
      use: [jpegtran()]
    }))

    // Renames Images
    .pipe(rename({
      prefix: 'pl_hero_'
    }))

    .pipe(gulp.dest(paths.images.testing))
    .pipe(gulp.dest(paths.images.dist));


  // Small PL
  gulp.src(paths.images.input)
    .pipe(gm(function (gmfile){
      return gmfile.setFormat('jpg'),
          gmfile.resample(20, 20),
          gmfile.thumbnail(500, '227^'),
          gmfile.quality(82),
          gmfile.filter('triangle'),
          gmfile.unsharp('0.25x0.25+8+0.065'),
          gmfile.interlace('none'),
          gmfile.colorspace('sRGB'),
          gmfile.crop(500, 227, 0, 0);
    }, {
      imageMagick: true
    }))

    // Crunches images
    .pipe(imagemin({
      progressive: true,
      use: [jpegtran()]
    }))

    // Renames images
    .pipe(rename({
      prefix: 'pl_hero_small_'
    }))

    .pipe(gulp.dest(paths.images.testing))
    .pipe(gulp.dest(paths.images.dist));


   gulp.src(paths.images.input)
   .pipe(clean())
   .pipe(gulp.dest(paths.images.output));

});


// // update this if I ever need to change fonts
// gulp.task('minify-fonts', function() {
//   gulp.src(paths.mini.input)
//     .pipe(minifyCSS({
//       keepBreaks:false
//     }))
//     .pipe(gulp.dest(paths.mini.output));
// });

// update this if I ever need to change fonts
gulp.task('fonts', function () {
    return gulp.src(paths.fonts.input)
    .pipe(cssBase64({
      maxImageSize: 8*10024 // bytes
    }))
    .pipe(gulp.dest(paths.fonts.testing))
    .pipe(minifyCSS({
      keepBreaks:false
    }))
    .pipe(gulp.dest(paths.fonts.dist));
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
  })
})

// gulp watches
// Spin up livereload server and listen for file changes
gulp.task('listen', function () {
    livereload.listen();
    // page templates
    gulp.watch(paths.pageLayouts.watch).on('change', function(file) {
        gulp.start('layouts');
    });
    gulp.watch(paths.pages.watch).on('change', function(file) {
        gulp.start('pages');
    });
    // includes
    gulp.watch(paths.includes.input).on('change', function(file) {
        gulp.start('includes');
    });
    // scripts
    gulp.watch(paths.scripts.input).on('change', function(file) {
      gulp.start(['concat', 'pages', 'layouts', 'clean-js']);
    });
    // scripts exclude
    gulp.watch(paths.scripts.exclude).on('change', function(file) {
      gulp.start('minifyScripts');
    });
    // css
    gulp.watch(paths.styles.watch).on('change', function(file) {
      gulp.start(['css', 'css-inline']);
    });
    gulp.watch(paths.sitemap.input).on('change', function(file) {
      gulp.start('sitemap');
    });

    gulp.watch(paths.collections.input).on('change', function(file) {
      gulp.start('collections');
    });
});

// Run livereload after file change
gulp.task('refresh', ['compile', 'pages', 'images'], function () {
    livereload.changed();
});

// Compile files, generate docs, and run unit tests (default)
gulp.task('default', [
  'minifyInlineScripts',
  'clean-js',
  'clean-css',
  'css-inline',
  'pages',
  'layouts',
  'includes',
  'collections',
  'css',
  'concat',
  'lint',
  'minifyScripts',
	'svg',
	'bower',
  'sitemap',
  'clean'
]);
