---
layout: single_blog_entry
pagetype: blog-entry
title:  Setting aspect ratios on responsive objects
date:   2015-08-01 12:23:59
categories: blog-entry promo
subhead:
tags: ["aspect-ratios","coding","CSS","CSS tricks","front-end web development","HTML","web development"]
image: golden-mean-spiral
imageAlt: "Golden ratio spiral"
promo: "Setting aspect ratios with CSS doesn't have to be messy if you use this technique."
---  

Responsive design not only caused designers and developers to rethink their entire design process, it caused numerous little head-scratchers along the way.

One problem is how to maintain an an exact aspect ratio on a DOM object on page resize. It's easy if it contains a presized object, hard if it does not. Adjusting top or bottom padding was always a [favorite technique][1].

Recently I needed a square figure wrapper to contain an image of undetermined size and aspect ratio. The image could be either tall or wide. Despite this, the image would need to center and fill out the container. Any overflow would be cropped off.

In the past, I'd used a clever [aspect-ratio mixin][2] that, similar to the most-used technique, used an ::after pseudo element on the container and padding to force the correct aspect ratio. Though useful, the mixin also resulted in some gross and hacky code because it involved absolute positioning elements inside the container.

But, applying a combination of viewport units, calc, object-fit and flexbox to the container and image can solve aspect ratio/photo problems in a much cleaner fashion.

First step: set the width of the container. My image container needed have a 55px<sup>[1][4]</sup> margin on the left and the page had a 15px left and right margin. I was targeting mobile, so I set my container width at 100 percent of the [viewport width][3] minus these amounts.

    .container {
        width: calc(100vw - 85px);
    }

Since the container will be square, use the width of the container to set the height using viewport width units:

    .container {
        height: calc(100vw - 85px);
    }

Use [flexbox][6] on the wrapper to center the contents vertically and horizontally.

    .container {
        display:flex;
        align-items: center;
        justify-content: center;
        overflow:hidden;
    }

The full code for the container looks like this.

    .container {
        width: calc(100vw - 85px);
        height: calc(100vw - 85px);
        display:flex;
        align-items: center;
        justify-content: center;
        overflow:hidden;
    }

Since the size and shape of the image in the container isn't defined, the image will need some styles to handle this. Set the image to always be 100 percent of its container height and width.

    image {
        width:100%;
        height:100%;
    }

However, this distorts the image to the shape of the container. [Object-fit][7] handles this problem by sizing the image to always fill the container without distorting it, similar to background-size:cover. Here's the finished code:

    image {
        object-fit:cover;
        width:100%;
        height:100%;
    }

The result is an image that is centered and cropped inside a container that maintains a perfect aspect ratio on window resize. Here's a [CodePen][8] with an example of the code and how it works.

And, since the container height is a function of width, [calc][9] can be used to create any aspect ratio, such as 16 x 9:

    width: 30vw;
    height: calc(30vw * .5625);

I made a mixin that can be passed viewport width, margins, and aspect ratio and do all the math.

    @mixin aspect-ratio($viewport,$margin,$width,$height){
        $ratio:$height / $width;
        $elHeight:$viewport * $ratio;
        width:calc(#{$viewport}vw - #{$margin}px);
        height:calc(#{$elHeight}vw - #{$margin}px);
        display:flex;
        align-items:center;
        justify-content:center;
        overflow:hidden;
    }

If it is passed a viewport width of 30, a margin of 10px, and a ratio of 16 x 9,

    @include aspect-ratio(30, 10, 16, 9);

It compiles to:

    .image-wrapper-test {
        margin: 10px auto 40px;
        width: calc(30vw - 10px);
        height: calc(16.875vw - 10px);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden; }

This comes with some caveats. This is still a complicated solution to a simple problem, as viewport units are not the easiest measure to work with. You'll need an [autoprefixer][12]. It also runs into support problems on [Opera Mini][10], and -- wait for it  -- [Internet Explorer][11].

Both appear solvable with [Modernizr][14] fallbacks.<sup>[2][13]</sup>

In addition, it's always best to crop images to the correct size for their container<sup>[3][5]</sup>. This was made for quick build-and-deploy situation where that wasn't possible.

And, most importantly the mixin is a one-off made specifically for this project. I haven't thoroughly battle tested it, so your mileage may vary.

1. <span id="footnote-aspect-ratio-one"></span>Usually I work in rems, but I'm using pixels for demo purposes because they are easier to understand.
2. <span id="footnote-aspect-ratio-three"></span>Although my official browser support policy for Davidputney.com is that we can't be bothered to test IE bug fixes because people who use Internet Explorer don't deserve nice things.
3. <span id="footnote-aspect-ratio-two"></span>And please, use responsive images, for the love of god.

[1]: http://www.sitepoint.com/maintain-image-aspect-ratios-responsive-web-design/
[2]: https://css-tricks.com/snippets/sass/maintain-aspect-ratio-mixin/
[3]: http://blog.teamtreehouse.com/new-viewport-relative-units
[4]: #footnote-aspect-ratio-one
[5]: #footnote-aspect-ratio-two
[6]: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
[7]: https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
[8]: http://codepen.io/putneydm/pen/JdwNJv
[9]: https://developer.mozilla.org/en-US/docs/Web/CSS/calc
[10]: http://caniuse.com/#search=vw
[11]: http://caniuse.com/#search=object-fit
[12]: https://www.npmjs.com/package/gulp-autoprefixer
[13]: #footnote-aspect-ratio-three
[14]:http://modernizr.com/
