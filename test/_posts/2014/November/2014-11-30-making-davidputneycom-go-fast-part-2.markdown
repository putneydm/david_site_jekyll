---
layout: single_blog_entry
pagetype: blog-entry
title:  That is why you fail
date:   2014-11-30 20:18:55
categories: blog-entry
subhead:
tags: [CSS,HTML,inline data URIs,page speed,Picturefill,responsive images,web development,web optimization,web speed]
image:  yoda
imageAlt: "Yoda looking all disappointed because Luke sucks"
promo: "In building a fast site, not everything I tried worked"
---  

I've been writing about my efforts to make my site load faster. Read Part 1 [here][27].

But like that young Jedi so long ago, I was not always able to [levitate the ship][28] out of the swamp. Probably because I didn't believe enough.

Either, way, here are some methods that I tried and ended up not using.

###What was a wash

* __Lazy loading or concatenating__ my javascript and didn't make much of a difference. Likely because my concatenated scripts are only 18K.
* __Paying extra for CDN web hosting.__ My time to first byte varies widely, from as low as .2 seconds to sometimes more than .7 seconds. My non-CDN hosting on another account is just as fast or faster. Didn't seem to be worth the extra money.
* __Responsive images__ with Picturefill 2. It reduces page weight for mobile devices, but didn't speed load times appreciably. Creating images of multiple sizes of the various photo shapes for dozens of images was a huge pain, even with a [Gulp task/ImageMagick][16] doing most of the hard work. Absolutely a must have for any site, but it won't make you faster.

###What didn't work

* __Inline data URIs__ not only didn't work, they *really* didn't work. I tried inline [data URIs][24] for my hero images in an effort to cut HTTP calls for above-the-fold page content. In short: Browsers are optimized for common tasks such as grabbing images off a server and rendering them as fast as possible. Data URIs, [not so much][25].
* __Image compression__ I used the [double-size low-res JPEG technique][11] for images. It cut my page weight but I needed to start with billboard-sized images and they still ended up looking [overcompressed][12]. Also, if you do this [Google Page Speed Insights][26] will falsely accuse of not optimizing and compressing your images.
* __Lazyloading images__  [Picturefill 2][13] was still new enough when I built my site that this was always going to be a problem. I tried [LazySizes][14] which claims to be compatible, but its main effect was to kill my page load times. Your experience may be different, but I'd advise some testing first.
* __Asynchronous loading__ of concatenated scripts broke [Tappy.js][15]. I need to look into this further, but haven't had time.
* __Minifiying HTML__ saved about 20K overall. But my CMS uses custom tags for content, and the minifier broke them.

###Takeaways

* __Modularize all the things__ The trend on every project I've tackled has been to make it _more_ modular. SASS obviously makes this simpler with CSS files and partials. I've been using [Codekit][17] to modularize my pages but you can use [Gulp][29], Grunt or other methods.
* __Experiment__ Speed gains seemed to be in the details for me and seemed to vary from other people's. Every site is a little bit different.
* __Gulp and CodeKit FTW__ Or use [Grunt][18], if that's your bag. Either way task runners make an enormous difference.
* __Lazy load__ any [blocking files][30] that you can.
* __Yeah, and fonts too.__ A blank page waiting for a font to load is worse that [flash of unstyled text][21].
* __Give up some image quality__ to [reduce page weight][22].
* __Latency__ slows your page more than page weight, so your efforts should concentrate on optimizing for that.
* __Start render times__ are important that total load times (although these should be low, too) because that's what the user sees.
* __There's no magic bullet__ to speed a page. It's cumulative and achieved by trimming tenths of a second here and there.

[1]: http://css-tricks.com/authoring-critical-fold-css/
[2]: http://www.webpagetest.org/video/compare.php?tests=141126_M6_XJ2-r:1-c:0
[3]: http://www.davidputney.com/siteart/pl_hero_design.jpg
[4]: https://twitter.com/jpamental
[5]: http://artifactconf.com/providence/
[6]: https://github.com/typekit/webfontloader
[7]: https://github.com/filamentgroup/loadCSS
[8]: http://css-tricks.com/svg-sprites-use-better-icon-fonts/
[9]: http://validator.w3.org/
[10]: http://en.wikipedia.org/wiki/Tallulah_Bankhead
[11]: http://www.filamentgroup.com/lab/compressive-images.html
[12]: http://www.davidputney.com/siteart/hero_crux.jpg
[13]: http://css-tricks.com/picturefill-2/
[14]: http://afarkas.github.io/lazysizes/
[15]: https://github.com/filamentgroup/tappy
[16]: https://www.npmjs.org/package/gulp-gm
[17]: https://incident57.com/codekit/
[18]: http://gruntjs.com/
[19]: http://gulpjs.com/
[20]: https://github.com/addyosmani/critical
[21]: http://en.wikipedia.org/wiki/Flash_of_unstyled_content
[22]: http://www.websiteoptimization.com/services/analyze/
[23]: http://www.youtube.com/watch?v=K-YyL7X4CWw&t=0m53s
[24]: http://blog.teamtreehouse.com/using-data-uris-speed-website
[25]: http://www.mobify.com/blog/data-uris-are-slow-on-mobile/
[26]: https://developers.google.com/speed/pagespeed/insights/?url=http%3A%2F%2Fdavidputney.com%2F
[27]: http://www.davidputney.com/2014/11/making-davidputneycom-go-fast.html
[28]: http://www.youtube.com/watch?v=M_QcRPNfUuE&t=1m16s
[29]: https://www.npmjs.org/package/gulp-include
[30]: https://developers.google.com/web/fundamentals/performance/critical-rendering-path/analyzing-crp?hl=en
