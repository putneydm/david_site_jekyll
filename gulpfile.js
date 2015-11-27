
var gulp = require('gulp');

//scripts
var concat = require('gulp-concat');
var minifyJS = require('gulp-uglify');
var jshint = require('gulp-jshint');

//css
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css'); // Add var prefix for consistency
var scsslint = require('gulp-scss-lint');
var autoprefixer = require('gulp-autoprefixer');

// html
 var htmltidy = require('gulp-htmltidy');
 var minifyHTML = require('gulp-minify-html');

//images
var imagemin = require('gulp-imagemin');
var jpegtran = require('imagemin-jpegtran');
var gm = require('gulp-gm');

//fonts
var cssBase64 = require('gulp-css-base64');

//utility
var rename = require('gulp-rename');
var clean = require('gulp-rimraf');
var stylish = require('jshint-stylish');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var fileinclude = require('gulp-file-include');
var browserSync = require('browser-sync');
var del = require('del');
var replace = require('gulp-replace');

//svg
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');

//bower
var mainBowerFiles = require('main-bower-files');

// gets today's date
var date = new Date();
// creates file names based on date
var filename = 'styles-' + date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear() + '.css';
var scriptname = 'script-' + date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear() + '.js';

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
  //  dist: 'dist/templates'
  },
  scripts: {
    input: 'src/scripts/**/*.js',
    exclude: 'src/scripts/exclude/*.js',
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
    inputInline: 'src/sass/inline_styles/{blog_embedded_styles.scss,index_embeded_styles.scss,main_embedded_styles.scss}',
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
    // dist: 'dist/svg/'
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
  drafts: {
    input: 'src/drafts/*.markdown',
    output: 'test/_drafts/'
  },
};

// tasks
// moves page templates from src to testing and dist
gulp.task('layouts', function() {
   gulp.src(paths.pageLayouts.input)
   .pipe(fileinclude({
     prefix: '@@',
     basepath: '@file'
   }))
  //  .pipe(htmltidy({doctype: 'html5',
  //    hideComments: true,
  //    indent: true}))
  .pipe(replace(/\*cachebustthis\*/g,  scriptname )) // adds cachebusted name of scripts to js links file
   .pipe(gulp.dest(paths.pageLayouts.testing))
  //  .pipe(gulp.dest(paths.pageLayouts.dist));
});
gulp.task('pages', function() {
   gulp.src(['!' + paths.pages.exclude, paths.pages.input])
   .pipe(fileinclude({
     prefix: '@@',
     basepath: '@file'
   }))
  //  .pipe(htmltidy({doctype: 'html5',
  //    hideComments: true,
  //    indent: true}))
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

gulp.task('deploy', ['sitemap'], function() {
   gulp.src(paths.pages.site)
   .pipe(htmltidy({doctype: 'html5',
       hideComments: true,
       indent: true}))
    .pipe(minifyHTML())
   .pipe(gulp.dest(paths.pages.deploy));
});


gulp.task('sitemap', function() {
   gulp.src(paths.sitemap.input)
   .pipe(gulp.dest(paths.sitemap.output));
});

// gulp.task('drafts', function() {
//    gulp.src(paths.drafts.input)
//    .pipe(gulp.dest(paths.drafts.output));
// });

// concatenates scripts, but not items in exclude folder. includes vendor folder
gulp.task('concat', function() {
   console.log(filename);
   gulp.src(paths.scripts.input)
   .pipe(concat(scriptname)) // renames to file w/ todays date for cachebusting
   .pipe(replace(/this\.loadCSS.*/g, 'this.loadCSS(\'/css/' + filename + '\');')) // adds cachebusted name of css to css lazyload
   .pipe(gulp.dest(paths.scripts.testing))
   .pipe(minifyJS())
   .pipe(gulp.dest(paths.scripts.dist));
});

gulp.task('cachebustScripts', function() {
  return gulp.src('source/layouts/mt_js_links.html')
  .pipe(replace(/\*cachebustthis\*/g,  scriptname )) // adds cachebusted name of scripts to js links file
});

// lints main javascript file for site
gulp.task('lint', function() {
  return gulp.src('source/scripts/functions.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

//minifies scripts in the exclude folder and moves unminified to testing and minified to dist
gulp.task('minifyScripts', function() {
   gulp.src(paths.scripts.exclude)
   .pipe(gulp.dest(paths.scripts.testing))
   .pipe(minifyJS())
   .pipe(gulp.dest(paths.scripts.dist));
});

// lints and minifies css, moves to testing and dist
gulp.task('css', function() {
  gulp.src([paths.styles.input, paths.styles.exclude])
  .pipe(scsslint())
   .pipe(sass())
   .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
   }))
    .pipe(rename(filename))
    .pipe(gulp.dest(paths.styles.testing))
    .pipe(minifyCSS({
      keepBreaks:false
    }))
    .pipe(gulp.dest(paths.styles.dist));
});

gulp.task('css-inline', function() {
  gulp.src([paths.styles.inputInline])
  //  .pipe(scsslint())
   .pipe(sass())
   .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
   }))
    .pipe(minifyCSS({
      keepBreaks:false
    }))
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
    // .pipe(gulp.dest(paths.svg.dist));
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

gulp.task('posts', function() {
   gulp.src(paths.posts.input)
   .pipe(gulp.dest(paths.posts.output))
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
          gmfile.resample(72, 72),
          gmfile.thumbnail(700, '261^'),
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
       gmfile.resample(72, 72),
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
       gmfile.thumbnail(2300, '1040^'),
       gmfile.quality(82),
       gmfile.filter('triangle'),
       gmfile.unsharp('0.25x0.25+8+0.065'),
       gmfile.interlace('none'),
       gmfile.colorspace('sRGB'),
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
          gmfile.resample(72, 72),
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
          gmfile.resample(72, 72),
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
      //  gulp.start('refresh');
    });
    gulp.watch(paths.pages.watch).on('change', function(file) {
        gulp.start('pages');
      //  gulp.start('refresh');
    });
    // includes
    gulp.watch(paths.includes.input).on('change', function(file) {
        gulp.start('includes');
      //  gulp.start('refresh');
    });
    // scripts
    gulp.watch(paths.scripts.input).on('change', function(file) {
      gulp.start('concat');
      //  gulp.start('refresh');
    });
    // scripts exclude
    gulp.watch(paths.scripts.exclude).on('change', function(file) {
      gulp.start('minifyScripts');
      //  gulp.start('refresh');
    });
    // css
    gulp.watch(paths.styles.watch).on('change', function(file) {
      gulp.start('css');
      gulp.start('css-inline');
        // gulp.start('browserSync');
    });
    gulp.watch(paths.sitemap.input).on('change', function(file) {
      gulp.start('sitemap');
    });
    // gulp.watch(paths.posts.input).on('change', function(file) {
    //   gulp.start('posts');
    // });
    gulp.watch(paths.collections.input).on('change', function(file) {
      gulp.start('collections');
        // gulp.start('browserSync');
    });
    // gulp.watch(paths.drafts.input).on('change', function(file) {
    //   gulp.start('drafts');
    //     // gulp.start('browserSync');
    // });
});

// Run livereload after file change
gulp.task('refresh', ['compile', 'pages', 'images'], function () {
    livereload.changed();
});

// Compile files, generate docs, and run unit tests (default)
gulp.task('default', [
  'css',
  'css-inline',
  'pages',
  'layouts',
  'includes',
  'collections',
  'concat',
	'svg',
	'bower',
  // 'posts',
  'sitemap',
  // 'drafts',
  'clean'
	// 'minifyScripts'
]);
