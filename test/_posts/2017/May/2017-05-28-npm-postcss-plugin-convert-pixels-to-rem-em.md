---
layout: single_blog_entry
pagetype: blog-entry
title: "Now on NPM: Convert your pixels to rems or ems using this PostCSS plugin"
date: 2017-05-28
categories: blog-entry
tags: ['NPM', 'PostCSS', 'Bourbon', 'pixels to rems', 'pixels to ems']
promo: "Convert your pixels to rems or ems using postCSS-pixels-to-rem"
---
Have you every had a dozen people coming over for dinner in 20 minutes only to discover that you need to convert a bunch of CSS with items sized in pixels over to [relative sizes][2] such as `rems` or `ems`? Who doesn't face this problem at least _several times a week_.

Up until now the only way to fix this problem was to learn assembly language, make your own CPUs and write your own operating system. Well, no more!

`postcss-pixels-to-rem` is a [PostCSS][3] plugin that finds several types of pixel notations and converts them to either `rems` or `ems`. It is designed as a way to bring legacy SASS files written using `pixels to rem` mixins forward and into the [postCSS world][4] with as seamlessly as possible.

For example, it's intended as a fix for legacy code that uses the now deprecated Bourbon `px to rem` and `px to em` [mixins][5].

Does it work? Well, you're [soaking][10] in it! The [CSS][11] for this site is [compiled][12] with it.

## How it works

It takes in several types of notations and spits out finished CSS at the other end.

* Notation of `rem(<value>)` or `em(<value>)` is converted to `<value>rem` and `<value>em` respectively.
* Notation of `<value>px` is converted to `<value>rem`.

It also allows for several user-set options.

* Base font size. Default is `16px`.
* Default unit. Setting it to `rem` or `em` will override `rem(<value>)` or `em(<value>)` notation. All items will be output in the user-set unit.
* Media queries can be excluded from conversion.
* Specific declarations can be excluded from conversion, e.g. `border-width`.

## How to use it

After reading this, everyone will want to get their hands on `postcss-pixels-to-rem`. No need to resort to _The Purge_ style theft and murder <sup>[1][1]</sup>. There's plenty to go around at the low, low price of free <sup>[2][6]</sup>.

Unfortunately we released it a little too late for Valentine's, Mother's Day and graduation gift-giving, but there's still birthdays and anniversaries -- and don't forget all-important early Christmas shopping.

It's available [over here][7] on NPM. Or install it by:

    npm install --save-dev postcss-pixels-to-rem

To use it with [Gulp][8]:

    var postcss = require('gulp-postcss')
    var pixelstorem = require('postcss-pixels-to-rem');    

and

    gulp.task('css', function() {
        var plugins = [
            pixelstorem()
        ];      
    gulp.src('source/sass/styles.scss')
    .pipe(postcss(plugins))
    .pipe(gulp.dest(public/css));
    });

Find full installation and usage instructions here on [NPM][7] or [Github][9].

`postcss-pixels-to-rem` not only comes with a full money-back guarantee, and is also guaranteed to make you better looking, thinner, wittier, more popular and bring you happiness, all while converting your `pixels` to `rems` or `ems`.


1. <span id="footnote-plugin-one"></span>Unless you want to.
2. <span id="footnote-plugin-two"></span>We deal in volume and pass the savings on to our customers.


[1]:#footnote-plugin-one
[2]:https://css-tricks.com/theres-more-to-the-css-rem-unit-than-font-sizing/
[3]:http://postcss.org/
[4]:https://www.davidputney.com/2015/07/that-postcss.html
[5]:http://bourbon.io/docs/#px-to-em
[6]:#footnote-plugin-two
[7]:https://www.npmjs.com/package/postcss-pixels-to-rem
[8]:http://gulpjs.com/
[9]:https://github.com/putneydm/pixelstorem
[10]:https://www.youtube.com/watch?v=dzmTtusvjR4
[11]:https://github.com/putneydm/david_site_jekyll/tree/master/src/sass/partials
[12]:https://www.youtube.com/watch?v=eVhO3JO5F1k
