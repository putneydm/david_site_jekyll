---
layout: single_blog_entry
pagetype: blog-entry
title: "How to do a Medium-style read-time estimate in Jekyll"
date: 2016-07-29
categories: blog-entry
tags: ['Jekyll', 'web design', 'web development', 'code', 'coding tricks']
promo: "How to do a Medium-style read-time estimate in Jekyll"
---

Medium has brought some interesting ideas to the idea of reading as user experience. Among them: estimated reading time.

A developer or designer using Jekyll who wants to add a [Medium-style][5] reading time estimate to a blog template will likely find that accomplishing this a simple matter of getting Jekyll to do some math and output the result -- sorta.

The reading time equation is the number of words divided by typical reading speed of [words per minute][4]. The only catch is that Jekyll's math syntax is a bit uglier than syntax used in programming languages such as JavaScript.

For sheer simplicity, I prefer to assign the calculation to a variable -- in this case `readCalc` -- using Jekyll's `assign` function. First the word count of the post.
{% highlight ruby linenos %}
{% raw %}
  {% assign readCalc = post.content | number_of_words %} {% endraw %} {% endhighlight %}

Average reading speed is around 180 to 220 words per minute. The lower end of that stat, 180, will be our divisor.
{% highlight ruby linenos %}
{% raw %}
  {% assign readCalc = post.content | number_of_words | divided_by: 180} {% endraw %} {% endhighlight %}

For purposes of display, a nice neat number with no decimals is  better, so rounding our result is the next step in the equation.
{% highlight ruby linenos %}
{% raw %}
  {% assign readCalc = post.content | number_of_words | divided_by: 180 | round %} {% endraw %}{% endhighlight %}

At this point, just plugging the number into the correct bit of text in your Jekyll template might suffice. However, it's also important to [sand the bottom][6] of the drawers where no one will see. Numbers below nine are typically [written out][7]. Any `readCalc` value of less than one minute needs to be handled.

This is done with a series of `if` and `elsif` statements that `assign` a string value to a variable `readTime`. In cases where `redCalc` is less than a minute:

{% highlight ruby linenos %}
{% raw %}
  {% if readCalc == 0 %}
    {% assign readTime = "Less than one" %} {% endraw %} {% endhighlight %}

The rest of values are assigned via `elsif`.

{% highlight ruby linenos %}
{% raw %}
  {% elsif readCalc == 1 %}
    {% assign readTime = "One" %} {% endraw %} {% endhighlight %}

Be sure to close the `if` statement. The full code block looks like this:

{% highlight ruby linenos %}{% raw %}
  {% if readCalc == 0 %}
     {% assign readTime = "Less than one" %}
   {% elsif readCalc == 1 %}
     {% assign readTime = "One" %}
   {% elsif readCalc == 2 %}
     {% assign readTime = "Two" %}
   {% elsif readCalc == 3 %}
     {% assign readTime = "Three" %}
   {% elsif readCalc == 4 %}
     {% assign readTime = "Four" %}
   {% elsif readCalc == 5 %}
     {% assign readTime = "Five" %}
   {% elsif readCalc == 6 %}
       {% assign readTime = "Six" %}
   {% elsif readCalc == 7 %}
     {% assign readTime = "Seven" %}
   {% elsif readCalc == 8 %}
     {% assign readTime = "Eight" %}
   {% elsif readCalc == 9 %}
     {% assign readTime = "Nine" %}
   {% else %}
     {% assign readTime = readCalc %}
   {% endif %}  {% endraw %} {% endhighlight %}

The final result is displayed in the template by plugging in the value of `readTime` with this bit:
{% highlight html ruby linenos %}{% raw %}  <p class="blog-read-time">{{ readTime }}-minute read</p> {% endraw %} {% endhighlight %}


[4]: https://en.wikipedia.org/wiki/Words_per_minute
[5]: https://medium.com/
[6]: http://www.wikihow.com/Refinish-a-Dresser
[7]: http://writingexplained.org/ap-style/ap-style-numbers
