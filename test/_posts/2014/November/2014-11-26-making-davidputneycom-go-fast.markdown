---
layout: single_blog_entry
pagetype: blog-entry
title: "Making Davidputney.com load fast: Part 1"
date:   2014-11-26 15:32:56
categories: blog-entry
subhead:
tags: [CodeKit,CSS,Gulp,HTML,inline CSS,javascript,SVG,web optimization]
image:  frank
imageAlt: "\"How I Did It\" by Victor Frankenstein"
promo: "Making a fast site is easy if you follow the recipe"
---  

A few years ago, I made a [key lime pie][36] for a party. One of my friends was raving about it. "Oh my God. You *have* to give me the recipe."

"Well," I said. "There's no secret. It's the [recipe][32] on the key lime juice bottle."

This is sort of how I feel about my web optimization efforts. Smart people at Filament Group and Google and elsewhere have already figured it out. Just follow the [recipe][33].

If it was that easy, we'd all be Gordon Ramsay. Err, maybe [not][35].

But, like with pie, experience has taught me some finesse. For instance, make your key lime pie crust with vanilla wafers and a little bit of cocoanut.

Recipes are only general directions. Every site is a little bit different. The browser is always right. And sometimes the browser is like a [cranky toddler][4] banging a spoon on its highchair.

With this site, my results have been [solid][31]. My index page has a start-render time of ~.2 seconds and load time of around 2 seconds. It's among the top 3 percent of fastest pages on webpagetest.org. Not bad for an image-driven site with giant hero art.

[31]: http://www.webpagetest.org/result/141126_M6_XJ2/
[32]: http://www.keylimejuice.com/recipes/nellie-joes-key-lime-pie.htm
[33]: http://www.filamentgroup.com/lab/performance-rwd.html
[34]: https://www.youtube.com/watch?v=YzwaiTVAMwI
[35]: https://www.youtube.com/watch?v=UjE-cBDFphQ
[36]: http://en.wikipedia.org/wiki/Key_Lime_Pie_%28album%29

Mainly trying out these techniques was a learning experience. Here are a few insights that I gained that might help others trying to optimize a site.

###What worked

* __Inlining "above the fold" CSS__ doesn't speed up overall load times so much as make the page _seem_ to [load faster][2].  So fast it seems to be loading from cache. In terms of user experience [inlining CSS][1] is a big win. Beware, though. It can be difficult -- well, crazy-making -- to implement and maintain manually. Next time I'll probably try [this.][20]
* __Hot-swapping hero images__ This Google-suggested technique loads a super-low-res version of hero art and then swaps with it a high-res image on DOM ready. Downsides include Javascript implementation, increased page weight, a double download, and the lead art looks [gross][3] until the real image loads. The designer in me should hate this. But the most damning thing of all ... I think I can [live with it][23].
* __Lazy loading fonts__ gave me a large overall speed improvement. I saw [Jason Parmentel's][4] session on this at [Artifact][5] and went home that night and added the Adobe [webfontloader][6] to my dev site. My start render time dropped below 1 second after this. The downside is flash of unstyled text, but a blank page awaiting a font download is a worse user experience.
* __Lazy loading CSS__ After testing, I'd scrapped this because it was actually slowing load times. I tried another technique suggested by Google, but the site was breaking in _-- wait for it --_ IE. A few days later I took yet another crack at it and inlined all of Filament Group's [loadCSS][7] tool in the header. Success. It cut about a half-second off my start render time. If you are bothered by inline JS, I'd forego this one.
* __Inline SVGs__ were another huge win for initial render times. Codekit made building out pages with [inline SVGs][8] quite easy (and fun!). Although inlining them made the [HTML5 validator][9] head for its fainting couch like [Tallulah Bankhead][10] until I cleaned up the SVG code. The downside of this technique is graphics can't be cached and your nice, neat HTML pages are a horror show of SVG code. If you do plan to use inline SVGs, this icon [sprite method][27] combined with CSS styling is the best way to go.

So that's the positives. I also learned some negatives and gained some insights, but this post was getting pretty long so I'll cover those in Parts 2 and 3 in a few days.

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
[27]: http://css-tricks.com/svg-sprites-use-better-icon-fonts/
