---
layout: single_blog_entry
pagetype: blog-entry
title:  Ship of fools
date:   2015-08-16 16:09:05
categories: blog-entry
subhead:
tags: [animations,CSS,flexbox,HTML,"navel gazing",redesigns,wanks]
image: trireme
imageAlt: "A Roman trireme under sail."
promo: "This site has once again undergone some renovations."
---  

It was supposed to just be a tech revision, a release I'd dubbed Davidputney.com Snow Leopard.

But my penchant for tinkering has once again outrun my good sense. So this site also has a visual refresh, too. In fact, Davidputney.com has been visually refreshed more times than [Katherine Helmond][9] in *Brazil.* it's more of [ship of Theseus][1] in that it isn't the same site any more.

Here was what it [looked like][2] when I launched it last fall. Since then a bunch of it has been rewritten to take advantage of modern browser technologies.<sup>[1][3]</sup> I've changed the fonts several times before settling on [Lavenderia][4] and [Ginger][5]. I've reshuffled the content presentation.

Here's a quick rundown of the latest changes:

* The header and hero images -- the entire top of every page, basically -- has been rewritten using [flexbox][6]. After wrestling with floats, percentage widths, clearfixes and other layout hacks for the better part of a decade, flexbox feels like a huge improvement. If you are a web dev you should probably learn it, as it will make your life much easier.
* I rewrote all the animations and transitions for these page-topping items. Key among them was a switch to `transform:translate( )` to [animate][11] positioning of elements. These are aimed at improving performance.
* A large CSS refactor that cut out a bunch of orphaned styles and reduced the size of [critical path][7] styles embedded in my page headers by a significant amount.
* The site navigation underwent a redesign at mobile widths. It's larger, <sup>[2][12]</sup> but more importantly it has all-new performance sapping, battery-draining, processor hogging, showy and gratuitous animations. So, enjoy!
* Other redesign stuff continues my efforts to strip away artifice that detracts from content. By artifice I mean the ugly shade of [tan][10] I used on the site nav/headers for some reason. It's gone now. You'll never have to see it there again.
* I switched from embedded SVGs to embedded [SVG sprites][8].

It probably seems bizarre to constantly revise a site that was generally fine to begin with. At least partly this was driven by me transforming the site from a mainly portfolio site into a blogging site. Davidputney.com is also a place for me to try out new techniques and technologies.

The end result is that Theseus' ship hasn't just replaced piecemeal, it's a whole new, better ship.

1. <span id="footnote-site-update-one"></span> Suck it hard, IE users.
2. <span id="footnote-site-update-two"></span> All the better to build my personal brand!

[1]: https://en.wikipedia.org/wiki/Ship_of_Theseus
[2]: https://web.archive.org/web/20141116184009/http://www.davidputney.com/
[3]: #footnote-site-update-one
[4]: http://www.losttype.com/font/?name=lavanderia
[5]: http://www.hypefortype.com/browse-fonts/font-categories/headline/ginger.html
[6]: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
[7]: https://developers.google.com/web/fundamentals/performance/critical-rendering-path/index?hl=en
[8]: https://css-tricks.com/svg-sprites-use-better-icon-fonts/
[9]: https://www.youtube.com/watch?v=Bnx95KyQEAA
[10]: http://davidputney.com/xx
[11]: https://developer.mozilla.org/en-US/docs/Web/CSS/transform
[12]: #footnote-site-update-two
