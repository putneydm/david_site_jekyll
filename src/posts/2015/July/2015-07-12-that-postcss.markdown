---
layout: single_blog_entry
pagetype: blog-entry
title: That PostCSS. It's so hot right now
date:   2015-07-12 12:28:44
categories: blog-entry promo
subhead:
tags: [CSS,front-end developement,LESS,NPM,PostCSS,preprocessors,SASS,Stylus]
image: mugatu
imageAlt: "Will Farrell as Mugatu in \"Zoolander\""
promo: "Just another CSS preprocessor? PostCSS brings something new to the table."
---  

Web developers suffer from the worst kind of [imposter syndrome][1].

My theory is that it's because devs are faced with a constant barrage of the new hotness. Generally it goes something like this:

* **9 a.m.** "OMG! They just released Widget.js this morning and it's amazeballs awesome! Everyone is using it! I'm moving all my projects to it!
* **5 p.m.** "What? Are you still using Widget.js? LOL! Dingus.js just came out this afternoon and it's amazeballs awesome!

CSS preprocessors have been on this new hotness treadmill for a few years. We have [Sass][2] that supplanted [LESS][3] and now [Stylus][4] aims to replace Sass <sup>[1][5]</sup>. Into this enters [PostCSS][6] <sup>[2][7]</sup>.

Oh, great another preprocessor. *Eye roll*. Another new thing to learn just to do my job.

But what if it offers something significantly different than the other three? Might it be worth it?

PostCSS comes at the problem from another direction. Preprocessors are all elaborate hacks. They aim to solve problems inherent in CSS, mainly that CSS is pretty dumb compared with JavaScript.

The programmy stuff -- loops, logic variables and other niceties -- added by preprocessors makes CSS a lot more usable.

If we were to play the *Which of these things is not like the other* [game][1] from *Sesame Street,* PostCSS is the outlier. Rather than just solving problems inherent in CSS it also aims to solve problems with preprocessors themselves.

LESS, Sass and Stylus are powerful but monolithic -- web developers write against an established list of functions that the preprocessor offers. Preprocessor code is centrally maintained. Additional features and functions come with an update.

PostCSS resembles the task runners [Gulp][2] or [Grunt][3] in that all alone it doesn't actually do anything. Its power comes from plugins written in JavaScript. And those plugins can do anything a developer might need. Theoretically, at least.

Like Gulp and Grunt it's meant to be extensible, flexible and customizable for a developer or project's particular needs.

Those who use Gulp or Grunt for their projects will likely find even more to like. PostCSS runs on Node and installs via[NPM][4]. This is the install code for Gulp. It should be familiar.

    $ npm install --save-dev gulp-postcss

This allows PostCSS to fit easily into existing Grunt or Gulp workflows. In Gulp, it's included like any other task. NPM also installs the plugins, and they can be saved as dev dependencies.

To use them, pass plugins to the PostCSS task as an argument. If there's more than one, use square brackets.

Here's Gulp code for adding an autoprefixer:

    var postcss = require('gulp-postcss')
    var autoprefixer = require('autoprefixer-core');

    gulp.task('css', function () {
        var processors = [
        autoprefixer({browsers: ['last 1 version']})
        ];
    return gulp.src('./src/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dest'));
    });

Because of the modular nature of PostCSS, getting it up and going is more involved than installing SASS or LESS. On a basic level, using it involves figuring out what you need your preprocessor to do -- loops, nesting, variables, autoprefixing, etc -- and getting everything in place.

For a developer comfortable in the command line -- comfortable enough to troubleshoot errors and sift through occasionally poor documentation -- PostCSS can still feel sort of like assembling a [chest of drawers][5] from Ikea.

For someone not as well-versed, perhaps someone trying to graduate from [CodeKit][21] to Gulp, PostCSS can feel more like being presented with a pile of parts and asked to assemble them into a [Formula 1][6] car.

But in the end you do get something powerful. Several-dozen plugins offer enough interesting functionality to get even the most cranky developer excited. Here's a few:

* **[cssnext][7]** Allows developers to use future CSS features now, but it compiles them into current standards.
* **[postcss-conic-gradient][8]** Supports conic gradients, although such gradients only work with a polyfill.
* **[cssgrace][9]** Compiles CSS3 for backward compatibility with older versions of Internet Explorer.
* **[postcss-vertical-rhythm][10]** Adds vertical rhythm to styles.
* **[lost][11]** One of several grid systems available as a plugin.
* **[css2modernizr][12]** Creates a Modernizr config file based on your CSS so you get only the functions you need.
* **[postcss-spiffing][13]** Lets you use British spellings such as "colour" and "grey" in your code.

The quality of these plugins is an open question. But users of Grunt and Gulp and other task runners have accepted this risk already with their own plug-in based build systems.

Preprocessors also add a layer of complication -- another thing to learn, another thing to deal with -- when shipping code. If a developer chooses to go the Gulp or Grunt route, that's more of workflow complication. The PostCSS plug-in structure can seem like more cogs for a machine that can already feel on the verge of smoking and clattering to a halt.

The plug-in based structure poses an even larger question. The [monolithic][14] structure of LESS, SASS and Stylus can be a weakness, but it's also a considerable strength.

When writing code in these, a developer is writing to a standard. They are themselves languages. Anyone can pull the code and compile it against a preprocessor.

Likewise, anyone versed in Sass should be able to read and understand anyone else's code written in Sass.

With PostCSS, it's not quite as simple. Code is written against and compiled by a list of dependencies -- often a long list. These dependencies might change unexpectedly, be deprecated or become unavailable altogether.

The uncompiled source code might only be understandable by the team or developer who writes it. The code is harder to share on Github. Future [technical debt][15] should figure heavily into any choice to go with PostCSS.

Moving a project from Sass to PostCSS might take some work too. I spent a couple hours trying to line up the right mix of plugins to get some existing SASS code to compile, but without success.

Developers depending on Sass mixin libraries such as [Bourbon][16] and [Neat][17] might face considerable difficulty porting projects over. Although I'm not discounting that someone with more will and knowledge than me couldn't eventually get it to work.

Small glitchiness also proved problematic. Global variables didn't work across partial stylesheets. I like to keep my variables in a single partial, and I never found a fix for this. Sometimes just the order of plugins affected my outcomes.

It comes down to weighing quite a few factors before making a decision.

Business theorist [Clayton Christiansen][18] -- the "disruption guy" -- has argued that just [being better][19] isn't enough to get someone to switch products or services. Anxiety about leaving the old product and adopting the new one has to be overcome.

To be honest, PostCSS comes with a lot of questions to be considered. I'm not sure I would want to embark on a large project with PostCSS as my main solution, at least not yet. As the old saw goes, "No one ever got fired for buying IBM." Established preprocessors seem the safe choice right now.

But I could see it fitting into a workflow to supplement Sass or LESS or Stylus with features those preprocessors don't have yet.

Even if the final call is to forgo PostCSS this time, the technology is certainly worth watching. On a podcast last week, analyst [Horace Dediu][20] said that criticizing products too early is a mistake. It's like looking at a baby and thinking that it's not a very good human. *Look, it can't even walk!* We should judge by potential.

And PostCSS seems like a tool with enormous potential, that is if enthusiasm around it grows and it gets a solid developer community behind it.

Or it may just turn out to be yet another old new hotness. Hopefully not.


1. <span id="footnote-postcss-one"></span>SASS seems to have won the day right now, at least.
2. <span id="footnote-postcss-two"></span>The PostCSS people really need to do something about that logo, though. It looks like something the Blair Witch would draw in the dirt outside someone's tent.


[1]: https://www.youtube.com/watch?v=ueZ6tvqhk8U
[2]: http://gulpjs.com/
[3]: http://gruntjs.com/
[4]: https://www.npmjs.com/
[5]: http://www.renovation-headquarters.com/images6/flat-pack-furniture.jpg
[6]: s://www.formula1.com
[7]: http://cssnext.io/
[8]: https://github.com/jonathantneal/postcss-conic-gradient
[9]: https://github.com/cssdream/cssgrace
[10]: https://github.com/markgoodyear/postcss-vertical-rhythm
[11]: https://github.com/corysimmons/lost
[12]: https://github.com/vovanbo/css2modernizr
[13]: https://github.com/HashanP/postcss-spiffing
[14]: https://www.youtube.com/watch?v=ML1OZCHixR0&t=2m10s
[15]: https://en.wikipedia.org/wiki/Technical_debt
[16]: http://bourbon.io/
[17]: http://neat.bourbon.io/
[18]: http://www.claytonchristensen.com/
[19]: http://jobstobedone.org/
[20]: http://www.asymco.com/
[21]: https://incident57.com/codekit/
