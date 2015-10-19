---
layout: single_blog_entry
pagetype: blog-entry
title:  Toward a better underline
date:   2014-12-02 17:55:21
categories: blog-entry
subhead:
tags: [CSS,design,HTML,mixins,SASS,shortcuts,typography]
image:  underlines
imageAlt: "Whale breaching off Maui"
promo: "Designers don't have to live with terrible browser default underlines"
---  

One of the first things I noticed about iOS8 was that the default underscore style for anchor tags is a proper [typographical underline][1].

Safari in Yosemite has also adopted this method.

These are nice touches that draw the traditions of print typography and the type of sanding-the-bottoms-of-the drawers attention to detail that websites need.

But the state of default browser underlines remains fairly lousy across the board. In an era when more refined web type is common, it's particularly bothersome for typographical pedants.

When building [Cruxnow.com][2], I adopted the Medium design team's [method][3] of creating bespoke underlines. If you want to know how it looks -- well, as [Madge][8] the sassy manicurist would say, you're soaking in it. The underscores on this site use a more refined version of it.

Like many methods in CSS, it's a clever-yet-hideous [hack][6] that uses a [background gradient][4] to mimic a typographical underline.

I've created a [SASS][5] mixin that automagically creates the background gradient. You pass it an argument for the color and top position for the underscore, the latter expressed as percentage.

    @mixin underscore ($color, $position)
	{
	color:$color;
	background-image: -moz-linear-gradient(top, transparent 75%, $hover_color 75%);
	background-image: -webkit-linear-gradient(top, transparent 75%, $hover_color 75%);
	background-image: -o-linear-gradient(top, transparent 75%, $hover_color 75%);
	background-image: linear-gradient(to bottom, transparent 75%, $hover_color 75%);
	background-size: 2px 2px;
	background-origin: padding-box;
	background-position: 0 $position;
	background-repeat: repeat-x;
	text-shadow:1px 1px 0px white, -1px 1px 0px white ;
	}

Like most hacky CSS fixes, it's not really [fire and forget][7]. You'll probably have to counteract its effects in some other declarations.

A few tips: It's span level, so if you wrap an anchor tag around a block of items it won't work properly. You also have to apply the mixin for a hover state. The text shadow is white, so if you use it over a color background, it may cause issues.

It also doesn't work in -- wait for it  -- IE8 or <, so you'll have to fall back to the browser default. But then again, people who still use IE8 don't deserve nice things anyway.

[1]: https://eager.io/blog/smarter-link-underlines/
[2]: http://www.cruxnow.com/
[3]: https://medium.com/designing-medium/crafting-link-underlines-on-medium-7c03a9274f9
[4]: http://www.w3schools.com/css/css3_gradients.asp
[5]: http://sass-lang.com/
[6]: http://starwars.rossiters.com/images/anh-002-01_lg.jpg
[7]: http://en.wikipedia.org/wiki/Fire-and-forget
[8]: https://www.youtube.com/watch?v=dzmTtusvjR4
