---
layout: single_blog_entry
pagetype: blog-entry
title:  HTML native interactive controls using CSS and flexbox
date:   2015-08-23 15:35:26
categories: blog-entry promo
subhead:
tags: ["code","CSS,design","flexbox","front-end developement","HTML","web design","web development"]
image: frank
imageAlt: \"How I did it\" by Victor Frankenstein
promo: Devs don't always have to resort to JavaScript for interactive controls
---

I find myself drawn to clever solutions for common problems.

One recent design I built called for side-by-side buttons. The user could click a button, which would maximize while other the choices would minimize. One solution would be declare CSS styles -- `btn -- default` and `btn -- active` -- and then toggle states on click using JavaScript or jQuery.

Even though the controls were buttons *visually*, functionally they behaved like [radio buttons][1], something devs already have in their HTML toolbox.

Styling forms can be tricky, but it is possible to apply a little CSS [sorcery][2] to style radio buttons like any other element. The buttons themselves are hidden and the styles are applied to clickable labels.

Not only does this allow design freedom, presentation stays in the CSS and more [semantic markup][3] is possible -- a big deal for those who depend on [screen readers][4]. Strip away the CSS and any JS, and the functions of the buttons would be entirely unchanged.

Here's the basic markup for two side-by-side buttons. The `<span>` allows button text to be targeted. But any markup would work.
{% highlight html %}
    <input id="btn-one" type="radio" name="button" value="one" />
    <label for="btn-one" class="btn">
        <span>Label text</span>
     </label>

    <input id="btn-two" type="radio" name="button" value="two" />
    <label for="btn-two" class="btn">
        <span>label text</span>
    </label>
{% endhighlight %}   

The first step is to hide the radio button itself. Don't use `display:none` or `aria-hidden` because the buttons need to remain accessible:

{% highlight css %}
    [type="radio"] {
         border: 0;
         clip: rect(0 0 0 0);
         height: 1px; margin: -1px;
         overflow: hidden;
         padding: 0;
         position: absolute;
         width: 1px;
    }
{% endhighlight %}   

Next, style the label to look like a button. Use `+` to target the first `<label>` after the radio.

{% highlight css %}
    [type="radio"] + label {
         width:5rem;
         height:5rem;
         display:block;
         margin:0 .125rem;
         padding:2rem 0 0;
         text-align: center;
         font-size:1rem;
         border-radius:50%;
         background-color:red;
         transform: scale(.8);
         transition:transform .3s cubic-bezier(.94,-0.66,.33,2.56) .1s;
    }
{% endhighlight %}   

This creates a default button. The next step is the active state using `:checked`.

{% highlight css %}
    [type="radio"]:checked + label {
         transform: scale(1.1,1.1);
         transition:transform .3s cubic-bezier(.94,-0.66,.33,2.56);
    }
{% endhighlight %}   

These "buttons" can be styled any way they need to be just like any other element. Transitions add some bounce between states.

Here's the result:

<p data-height="268" data-theme-id="0" data-slug-hash="pJXmLx" data-default-tab="result" data-user="putneydm" class='codepen'>See the Pen <a href='http://codepen.io/putneydm/pen/pJXmLx/'>pJXmLx</a> by David Putney (<a href='http://codepen.io/putneydm'>@putneydm</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

&nbsp;

###Wait, there's more ...

Combining styled radio buttons with [flexbox source order][4] controls adds even more options.

Another design called for a three-option selector. Click on the button and the selector would accordion open to show additional options. Click an option and the selector would accordion closed and only the active option would remain visible.

The markup for the buttons is the same as previously shown, with one addition.

{% highlight html %}
    <div class="btn-wrapper">

         <input id="btn-one" type="radio" name="button" value="one" />
         <label for="btn-one" class="btn">
             <span>Label text</span>
         </label>

         <input id="btn-two" type="radio" name="button" value="two" />
         <label for="btn-two" class="btn">
             <span>label text</span>
         </label>

         <input id="btn-three" type="radio" name="button" value="two" />
         <label for="btn-three" class="btn">
             <span>label text</span>
         </label>
    </div>
{% endhighlight %}   

Because flexbox is needed for the buttons to work properly, they are inside a flexbox wrapper and arranged in a column that is justified at flex start.

{% highlight css %}
    .btn-wrapper {
         width:9rem;
         height:auto;
         display:flex;
         flex-direction:column;
         justify-content: flex-start;
         margin:2.5rem auto;
    }
{% endhighlight %}   

Flexbox source order is how the magic happens. The radio buttons will default to a source order of 1, 2, 3, ... . If the checked radio button is a assigned a source order of -1 it will always be ahead of these other elements.

{% highlight css %}
    [type="radio"]:checked + label {
         order:-1;
    }
{% endhighlight %}    

A few lines of jQuery/JS adds the accordion action. Here's the result:

<p data-height="268" data-theme-id="0" data-slug-hash="yNdmdp" data-default-tab="result" data-user="putneydm" class='codepen'>See the Pen <a href='http://codepen.io/putneydm/pen/yNdmdp/'>yNdmdp</a> by David Putney (<a href='http://codepen.io/putneydm'>@putneydm</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

After shifting so much functionality from JS to native CSS/HTML, it may seem like a bit of a letdown to throw in JS at this point. But, the goal here isn't to cut out JS entirely but to use the best tool for the job. Anything that can be kept native probably should be.

And, with so much browser support for CSS/HTML native these days, exploring options can yield some clever solutions.

[1]: http://www.w3schools.com/html/html_forms.asp
[2]: http://giphy.com/gifs/harry-potter-james-NxLWZYEM4l5ug
[3]: http://www.amazon.com/Designing-Web-Standards-Jeffrey-Zeldman/dp/0321385551/
[4]: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
