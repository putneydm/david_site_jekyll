---
layout: single_blog_entry
pagetype: blog-entry
title: "How to do a copy to clipboard in native JavaScript"
date: 2015-12-11
categories: blog-entry
tags: ['Javascript','native','clipboard','copy','web development','Javascript development', 'JS', 'tutorial']
promo: "How to do a copy to clipboard in native JavaScript"
---  

As Flash dies a lingering, welcome death and its larger functions are replaced by native code, developers are finding themselves needing alternatives to smaller things it did too. Among them is Flash-based copy to clipboard.

The [JavaScript][6] code to do the copy is quite simple, just a single line. Perhaps that's why when I went looking for JavaScript copy-to-clipboard tips and methods, I found them mainly limited to Stack Overflow threads and the like. I've put cobbled them together insights from several and some of my own testing and some insights into a tutorial of sorts.

I also threw in some other code to improve the overall experience of doing a copy for the end user.

What is being done in the process is fairly straightforward.

* Listen for a button click,
* Select the form field or item to copy.
* Copy the form contents or the item
* Test for success
* Offer a success or failure message
* Reset for another copy process

By breaking it into a step-by-step process, it becomes a much more solvable problem. And this version throws in some UX features that make the overall process better for users.

The first step is the HTML. I'm omitting the CSS, but in this case the markup would need a class that sets the class `message` to `display:none` by default and another that set them to `display:block` on active state. This is the markup for the form and button.

{% highlight html %}
<div class="form-container">
  <input type="text" id="form-field" class="form-field" value="Stuff that will be copied">
  </input>
  <input type="button" id="copy-button" value="Copy"></input>
  <p id="success-message" class="message">Copied</p>
  <p id ="fail-message" class="message">Something went wrong</p>
</div>
{% endhighlight %}

The JavaScript is just one piece of the problem at a time. Add a listener to the button and find the form field with the content on click.

{% highlight JavaScript %}
var copyButton = document.getElementById('copy-button');
var formField = document.getElementById('form-field');

copyButton.addEventListener("click", function(){
  //copy code will go here here
});
{% endhighlight %}


A these lines will set the form field to active, select the contents and place it into a variable. The copy is accomplished using `document.execCommand()`.

{% highlight JavaScript %}
formField.select();
var success = document.execCommand('copy');
{% endhighlight %}

Testing this variable as true / false determines whether the copy was successful and shows the user a message with the outcome. Simply adding a success message without this test means the copy could fail silently.

{% highlight JavaScript %}
if (success) {
  document.getElementById('success-message').classList.add('message--active');
}
if (!success) {
  document.getElementById('fail-message').classList.add('message--active');
}
{% endhighlight %}

However, a copy process returning an error is also possible, so I've included some `try / catch` code.

{% highlight JavaScript %}
function handleMessage() {
  try {
    formField.select();
    var success = document.execCommand('copy');
    if (success) {
    document.getElementById('success-message').classList.add('message--active');
    resetForm();
  }
  if (!success) {
    document.getElementById('fail-message').classList.add('message--active');
    resetForm();
  }
  } catch(err)  {
    document.getElementById('fail-message').classList.add('message--active');
    resetForm();     
  }
}
{% endhighlight %}

The form field needs to be reset back to its default state once the paste is complete so the user can copy again or alter the form text. I've used a 2-second delay.

{% highlight JavaScript %}
function resetForm() {
  console.log('reset')
   formField.blur();
   setTimeout(function() {
   var active = document.getElementsByClassName('message--active')[0].classList.remove('message--active');
  }, 2000);
 };
{% endhighlight %}

These are the basic steps needed to to a copy to clipboard with success confirmation. I've put them all together into a [CodePen][4].


However, these steps can be refactored into a more compact form -- 17 lines vs. 45 -- and, in this case altered to better fit an implementation -- in this case, my own -- without changing the basic principles behind what has been described. In my own version, the active state is applied to a `div` that wraps the form field. Also the function that does the active state set and reset is refactored into a single function that receives the specific pass or fail style as an argument.

In the interest of space I've converted my `if` statements into a [ternary operator][5]. This is my finished code as I used on the site I'm building.

{% highlight JavaScript %}
var embedCode = document.getElementById('embed-code'); // get the form with embed code
var embedContainer = document.getElementsByClassName('form-container'); // get the container of the form

// handle the active and inactive state of the form container
var inputActive = function(style) {
 embedContainer[0].classList.add('form-container--active', style); // set container to active and include error or success message
  embedCode.blur(); // deselect the form field
  // remove the active state from the form container once the 2-second animation has run
  setTimeout(function(){
    embedContainer[0].classList.remove('form-container--active', style);
  }, 2100);
};
try {
  embedCode.select(); // select the form field
   var successful = document.execCommand('copy'); // copy the contents
   successful ? inputActive('form-container--success') :inputActive('form-container--fail'); // test if it was successful
 } catch (err) {
     inputActive('form-container--fail'); // if there is an error give an error message
 }
}
{% endhighlight %}

This copy-to-clipboard method should work in any browser that supports the feature. Universal support, however, remains a problem.

Safari for both Mac and iOS do not support it for security reasons, but Chrome and Firefox and Internet Explorer are both good with it. No JS method will work for Safari.



[4]: http://codepen.io/putneydm/pen/eJpNwQ
[5]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
[6]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
