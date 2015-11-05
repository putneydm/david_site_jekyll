---
layout: single_blog_entry
pagetype: blog-entry
title:  Steal this site
date: 2015-11-01 15:33:33
categories: blog-entry
subhead:
tags: [Jekyll,CMS,static site generator,web development,Git,CSS]
image: jekyll
imageAlt: "Mr. Hyde waving a cane around threateningly"
promo: "Steal this site: Everything and nothing has changed about davidputney.com"
---  
Some time this week, some items changed in a database that controls Internet domains and this site quietly made a major technical shift.

It all went well enough that probably no one really noticed a difference. I did take the opportunity to make a few design tweaks here and there that some might notice. But the change to the site is all on the back end.

I'm calling this version Davidputney.com Snow Leopard.

For about the last 10 years, my site has been published using [Movable Type][1]. It did its job quietly and competently, but as a technology it badly dated and therefore was deeply uncool.


At the time I chose it, which publishing platform to embrace wasn't quite so clear as it is now. A nascent blogger really had to choose between WordPress and Movable Type. I went with Movable Type. And, well ...

<div class="embed-container">
<iframe width="420" height="315" src="https://www.youtube.com/embed/Ubw5N8iVDHI" frameborder="0" allowfullscreen></iframe>
</div>

In some ways I _did_ make the right choice. Movable Type is dead simple compared with [WordPress][11] and its hideous [PHP-based templates][2]. As time went on, I knew Movable Type so well that I could build sites extremely quickly and efficiently in it.<sup>[1][5]</sup>

But it was also becoming clear years ago that I needed to switch. Key plugins were four and five years old, and new ones were not being written. Googling for answers when I encountered a problem would often turn up nothing.

I needed to build my site on something with an active community. My choice was -- _not WordPress_. Rather, I went with [Jekyll][3].

For those non-technically inclined who have stayed with me this far, Jekyll is a static site generator, which means that, unlike WordPress, it doesn't require a database and other elaborate server-side software to create and publish a site. Or to maintain.

And, unlike WordPress, if a static site gets hit with a heavy server load, it won't melt down like [Chernobyl][4]. If Drudge Report wants to link to us, all we have to say is "Come at me, bro." <sup>[2][6]</sup>

And, from my own perspective, I no longer have to run a local web server, MySQL database and other complicated [stuff][8] on my laptop to update my site. With a simpler dev environment, it's easier for me to build items for the site.

The best news is that because of this switch, readers have a whole new way to enjoy Davidputneycom!

The [source code][7] for the entire site, including all posts, is on Github.  

Readers comfortable with a Unix command line,<sup>[3][10]</sup> need only do a `git clone` on the repo, install the dependencies -- Node, NPM, Gulp, LibSass, Homebrew, ImageMagick, Jekyll, etc -- do a quick compile and they will have their very own version of this site running on their computer for their offline reading convenience. Yes, it's just that simple!

For a while we considered making this easy, convenient, fun method the only way to enjoy the site, but this is a mobile first world and the command line options for iOS are fairly poor right now. If someone can find a decent command line Git client for iPhone let us know so we can hopefully pull the trigger on this option soon.

Or, if folks want a full Davidputney.com experience, they can pull the repo and use it to run their own guerrilla version of Davidputney.com on their own domain. All we ask is that they not attempt to assume our identity by murdering us and wearing our skin like a suit, [Edward Gein][9] style.

The visible changes are few, but you will still see some differences:  

* The pages begin rendering twice as fast as the previous version of the site, in just about a [half second][12] in optimal conditions.
* To save bandwidth on mobile, we are now lazyloading our responsive images using [Lazysizes][14].
* We cleaned up the underlines on hyperlinks.
* We tweaked some key animations to make them better.
* We fixed a glitch that was causing fonts to redownload with some page loads.
* We fixed other glitches that were slowing page rendering a bit.
* The blog is now paginated.
* We added photos onto the blog front and subsequent pages.
* We cleaned up some of our URLs. For example portfolio items now reside at `davidputney.com/design` rather than `davidputney.com/archive/projects.html`

But, as Vincent said in _Pulp Fiction_, it's the little differences. Eventually they start to add up.


1. <span id="footnote-one-jekyll"></span>This version of my site was built and launched a year ago with (then) job hunting in mind. I needed to build it fast and not get bogged down in learning WordPress too.
3. <span id="footnote-two-jekyll"></span> He will, however, quickly run through our bandwidth allotment.
2. <span id="footnote-three-jekyll"></span>And I sure that's most people.


[1]:https://movabletype.org/
[2]:http://www.wpbeginner.com/glossary/php/
[3]:https://jekyllrb.com/
[4]:http://www.world-nuclear.org/info/Safety-and-Security/Safety-of-Plants/Chernobyl-Accident/
[5]:#footnote-one-jekyll
[6]:#footnote-two-jekyll
[7]:https://github.com/putneydm/david_site_jekyll
[8]:https://www.mamp.info/en/
[9]:http://www.biography.com/people/ed-gein-11291338
[10]:#footnote-three-jekyll
[11]:https://wordpress.com/website/?utm_source=adwords&utm_campaign=WordPress-Generic-Exact-US-GP&gclid=CPXe8pC68MgCFVcRHwodoUoP1w
[12]:http://www.webpagetest.org/result/151105_Z3_4Z6/
[14]:xhttps://afarkas.github.io/lazysizes/
