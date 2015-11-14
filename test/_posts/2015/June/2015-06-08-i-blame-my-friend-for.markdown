---
layout: single_blog_entry
pagetype: blog-entry
title:  Putting my foot(notes) down
date:   2015-06-08 12:17:45
categories: blog-entry
subhead:
tags: ["HTML","front-end development","footnotes","JavaScript","JS","websites"]
image: footnote_foot
imageAlt: "Giant Monty Python foot"
promo: "And now for something completely different: Footnotes"
---  

I blame my friend for becoming internet famous.

While writing about his [voyage through][2] the viral media sausage making machine, I realized that my blog templates had a serious design flaw. I had no place to put my snarky asides.

I needed footnotes. All the cool kids have them on their blogs. <sup>[1][1]</sup>&nbsp; [John Gruber][3], for instance.

One of the nice things about having locally sourced, artisanal site that I made [myself][4] is that I can just add items as needed. I opened my [code editor][5] and wrote up styles for superscript and an ordered list style.

But I hated them almost immediately. They operated as [skip links][6], which are simple and basic, but are also gross and confusing because they can easily leave a reader feeling stranded on the page.

I set out to make the best skip links ever. They zip a user to the bottom of the page, then return them to where they were reading. Try it! <sup>[2][7]</sup> They're both easy and fun! In the spirit of [progressive enhancement][14], users with JavaScript turned off, or if JS doesn't load, get basic skip links.

I spent the last week or so, a couple hours a night, writing the JavaScript to make that happen. Then I tossed all of that out this weekend and rewrote the entire thing from scratch.

It was working smoothly on the local version of my site. Satisfied that it was ready, I published the code to my live site where it [immediately broke][8].

I'm fairly new to writing in straight-up JavaScript. I've done [jQuery][10] for about five years. There's a jQuery vs. JavaScript [debate][11] going on. Both methods have their strengths and weaknesses, but the jQuery partisans *are* correct that jQuery solves a lot of problems with JavaScript.

Finding and targeting items in the DOM is *much* easier with jQuery. In my case it was made doubly difficult because I write my entries in [Markdown][12]. They are just raw HTML with no styles, IDs or data tags to grab onto with JavaScript.

But it all appears to be working. For now. Except in Firefox. And maybe Internet Explorer. Frankly, we can't be bothered to check.

We are offering a money back guarantee<sup>[3][15]</sup> to anyone encountering issues with our footnotes.

Please contact the David Putney.com [complaints department][13] where your issue will be given all the attention it deserves. We will contact you in six to eight weeks once your complaint has been settled to our satisfaction.

1. <span id="footnotes-footnote-one"></span>Despite having footnotes on my blog, I am still not one of the cool kids.
2. <span id="footnotes-footnote-two"></span>Like this. If you hit the "Take me back to where I was reading" button. It  will. At least, I hope so.
2. <span id="footnotes-footnote-three"></span>Not a guarantee.

[1]: #footnotes-footnote-one
[2]: http://www.davidputney.com/2015/05/into-the-maw.html
[3]: http://daringfireball.net/
[4]: http://www.davidputney.com/about
[5]: http://www.barebones.com/products/bbedit/
[6]: http://www.nomensa.com/blog/2004/what-are-skip-links
[7]: #footnotes-footnote-two
[8]: http://twitter.com/Raelshark/status/607757783258120193
[10]: https://jquery.com/
[11]: http://gomakethings.com/ditching-jquery/
[12]: http://daringfireball.net/projects/markdown/syntax
[13]: http://www.warnerbros.com/archive/spacejam/movie/jam.htm
[14]: http://en.wikipedia.org/wiki/Progressive_enhancement
[15]: #footnotes-footnote-three
