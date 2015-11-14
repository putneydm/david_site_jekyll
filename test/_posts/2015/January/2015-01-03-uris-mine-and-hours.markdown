---
layout: single_blog_entry
pagetype: blog-entry
title:  URI's, mine and hours
date:   2015-01-03 18:57:53
categories: blog-entry
subhead:
tags: [asynchronous loading,design tips,fonts,scripts,Top Gear,web speed]
image:  caveman
imageAlt: "Phil Hartman as Unfrozen Caveman Lawyer"
promo: "Switching to data URI fonts: How hard can it be?"
---  

I'm like a [caveman][1] finding a new shiny pebble.

There's nothing wrong with the old shiny pebble I'd been enamored with seconds ago, it's just that ...  *It's new! Look how shiny it is!*

I've been experimenting with [various][2] methods [of cutting][3] this site's load time, particularly through asynchronously loading blocking files like webfonts and scripts.

I'd been using the [Adobe/Google][4] asynchronous font loader, but Adam Beres-Deak's [method][5] became my latest new shiny pebble. His script loader limits the font palette to [WOFF][6] and [WOFF2][7] files which have been encoded as [base-64][8] data URIs into an [@font-face][9] stylesheet. This loads asynchronously, is added to the head of the page and is saved to [local storage][10] rather than being cached.

I use three faces and bold and italic variants of my body type, so it had the advantage of reducing font-related HTTP calls from five to one, even if my overall font file download size stayed roughly the same. I decided to implement it.

As they say on "Top Gear," [how hard can it be][11]?


To create my CSS with data URIs I turned to [FontSquirrel][13]'s advanced settings. Subsetting and other cool stuff is available here in a UX that looks like the [control panel][14] of a 747.

I ran into problems with FontSquirrel's base-64 converter, which consistently turns out a CSS file with no embedded base-64 data URIs for WOFF2 files.

A better option, and the one I ended up using, is the [Gulp][15] plugin [cssBase64][16], although several other Gulp options are available. FontSquirrel-generated CSS takes a bit of editing to fix font names and properly assign weights and styles. Base-64 is as ugly as a [Soviet tractor][21], so it's best to not have to go into the output files anyway.

After a couple days of messing with this part in my spare time I had my font files in place. But it still wasn't working properly due to a [slapfight][17] between Safari and Chrome over apparent differing opinions of [cross-domain][18] loading.

For various technical reasons I'll not get into, I was using a full http link instead of a relative path for my font files. Safari treats http://davidputney.com ... as cross domain and requires a www for fonts to load. Chrome treats http://www.davidputney.com as cross domain.

It took some time to nail down the problem, but I got it working in both browsers with a somewhat ugly CMS hack that -- suddenly stares blankly off into the middle distance -- *I've seen things, man."*

Then my testing revealed another problem: It doesn't work at all in Safari -- desktop or mobile -- in [private browsing mode][19].

On the one hand, this site isn't a porn site. Few will likely ever visit in private mode. But I use private mode on my phone and iPad almost exclusively to defeat [site paywalls][20], so it's pretty much broken for me on those devices.

I'd be less concerned about this if the effect on site speed wasn't negligible. Overall load time and render speed are about 1 second faster. But first render is incrementally slower, about .2 to .3 seconds. This pushes first render from a less than a half second to closer to one second.

For most visitors less than a second load time feels immediate, but I'm going for glory on this. Data URIs in general aren't all that fast. Faster methods appeal to me.

I spent enough time implementing this I want to leave it in place for at least a few days. I'll weigh the benefits and decide then whether to stick with my new shiny pebble or go back to the old one.


[1]: https://screen.yahoo.com/unfrozen-cave-man-lawyer-1-223412426.html
[2]: http://www.davidputney.com/2014/11/making-davidputneycom-go-fast.html
[3]: http://www.davidputney.com/2014/11/making-davidputneycom-go-fast-part-2.html
[4]: https://github.com/typekit/webfontloader
[5]: http://bdadam.com/blog/loading-webfonts-with-high-performance.html
[6]: http://en.wikipedia.org/wiki/Web_Open_Font_Format
[7]: http://www.w3.org/TR/WOFF2/
[8]: http://en.wikipedia.org/wiki/Base64
[9]: http://www.w3schools.com/cssref/css3_pr_font-face_rule.asp
[10]: http://diveintohtml5.info/storage.html
[11]: http://en.wikipedia.org/wiki/Top_Gear_challenges#How_hard_can_it_be.3F
[12]: http://en.wikipedia.org/wiki/TrueType
[13]: http://www.fontsquirrel.com/tools/webfont-generator
[14]: http://upload.wikimedia.org/wikipedia/commons/5/50/B747-cockpit.jpg
[15]: http://gulpjs.com/
[16]: https://www.npmjs.com/package/gulp-css-base64
[17]: http://stream1.gifsoup.com/view7/2906451/harmony-vs-xander-o.gif
[18]: http://davidwalsh.name/cdn-fonts
[19]: http://support.apple.com/en-us/HT203036
[20]: http://thelearnsomethingnew.com/2013/01/17/the-easiest-way-to-get-around-paywalls/
[21]: http://blogs-images.forbes.com/briancaulfield/files/2011/05/300px-Kommunar.jpg
