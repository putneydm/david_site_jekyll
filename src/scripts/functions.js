var pageFunctions = {
  intialize: function () {
  console.log('works');
    var self=this;
    //  test for js
    self.initJsTest(document.body);

    // init listeners
    this.initScrollButton();
    this.initMenuButton();
    this.addLink();
    this.initResizeListener();
  },
  intializeBlog: function() {
    var self=this;
    self.setBackground(); // swaps out hero image on load.
    self.entryList = [].slice.call(document.querySelectorAll(".blog-entry"));
    self.initFootnoteClick();
    this.initScrollBackButton();
    self.initScrollListener('blog');

    console.log(self.entryList);

  },
  intializeBlogEntry: function() {
    var self=this;
    self.initFootnoteClick();
    this.initScrollBackButton();
    self.initScrollListener('blogEntry');
  },
  initializeIndex: function() {
    var self=this;
    self.nameplateAnimate(); // animates nameplate
    self.initScrollListener('index');
    self.setBackground();
  },
  initScrollListener: function (pageType) {
   var self=this;
   document.onscroll = function() {
     var scrollPosition = self.getScrollPosition();
     if (pageType === "blog") {
       self.handleNavAnimate();
       self.setActiveBlogItem();
       self.handleFootnoteButton (scrollPosition);
       self.handleScrollProgress();
       self.initBlogTeasers();
     }
     else if (pageType === "blogEntry") {
       self.handleBlogItems(blogEntries);
       self.initScrollBarListener();
       self.handleFootnoteButton (scrollPosition);
       self.handleManualScrollback(scrollPosition);
     }
     else if (pageType === 'index') {
       self.handleHeroAnimate(scrollPosition);
       self.handleNavAnimate(scrollPosition);
       self.initBlogTeasers();
     }
     self.handleScrollButton(scrollPosition);
     self.handleSiteFooter(scrollPosition);
     self.handleManualScrollback(scrollPosition);

    //  self.handleScrollBackButton (scrollPosition);
   }
  },
  initResizeListener: function(){
    var self=this;
    window.onresize = function(e) {
      console.log('resized');
    }
  },
  initJsTest: function () {
    document.querySelectorAll('HTML')[0].classList.remove('no-js');
  },
  initScrollButton: function() {
    var self = this;
    var scrollToTopButton = document.querySelector('#scroll-to-top'),
        scrollStart = self.getScrollPosition();
    scrollToTopButton.addEventListener("click", function(e) {
      self.scrollToGeneric(0, 500, scrollStart);
      e.preventDefault();
    });
  },
  initMenuButton: function() {
    var self = this;
    var menuButton = document.querySelector('#menu-button'),
        navMenu = document.querySelector('#nav-menu');
    menuButton.addEventListener("click", function(e){
      self.expandMenu();
      e.preventDefault();
    });
  },
  initFootnoteClick: function() {
    // this adds listener to sup tags
    var self=this;
    var blogContainer =    document.querySelector("#blog-container");

    blogContainer.addEventListener("click", function(e) {
      var linkType = e.target.parentNode.tagName === 'SUP';  //
      var activeItems = [].slice.call(document.querySelectorAll(".footnote-link-active"));
      if (activeItems) {
        activeItems.forEach(function(el) {
          el.classList.remove('footnote-link-active');
        });
      }
      if(linkType && e.target && e.target.nodeName === "A") {
        var footnoteID =  e.target.getAttribute("href").slice(1); //gets id of footnote
        self.setFootnoteActiveState(e.target.parentNode, footnoteID);
      }
    e.preventDefault();
  });
  },
  initScrollBackButton: function () {
    var self = this;
    var footnoteReturnButton = document.getElementById("btn-footnote-return");
    if (footnoteReturnButton) {
    footnoteReturnButton.addEventListener("click", function(e) {
      e.preventDefault();
      self.setInactiveState(true);
      });
    }
  },
  handleHeroAnimate: function() {
    var self = this;
        scrollPosition = self.getScrollPosition(),
        el = document.getElementById('hero-image'),
        elHeight = el.clientHeight * 0.70,
        active = el.classList.contains('hero-art-portfolio--hidden');

    if (elHeight < scrollPosition + 150 && !active) {
      self.removeShit(el, 'hero-art-portfolio--visible');
      self.addShit(el, 'hero-art-portfolio--hidden');
    }
    if (elHeight > scrollPosition + 150 && active) {
      self.removeShit(el, 'hero-art-portfolio--hidden');
      self.addShit(el, 'hero-art-portfolio--visible');
    }
  },
  handleNavAnimate: function() {
    var self=this;

    console.log('nav animate');

    var el = document.getElementById('inside-header'),
        elHeight = el.clientHeight * 0.70,
        scrollPosition = self.getScrollPosition(),
        extended = el.classList.contains('nav-fixed-bar--extended'),
        retracted = el.classList.contains('nav-fixed-bar--retracted');

    //adds styles  on scroll down
    if (scrollPosition > 120 && !retracted) {
      self.addShit(el, ['nav-fixed-bar--active', 'nav-fixed-bar--retracted']);
    }
    if (scrollPosition > elHeight + 150 && retracted) {
      self.addShit(el, ['nav-fixed-bar--transition', 'nav-fixed-bar--extended']);
      self.removeShit(el, 'nav-fixed-bar--retracted');
    }
    if (scrollPosition < elHeight && extended) {
      self.removeShit(el, 'nav-fixed-bar--extended');
      self.addShit(el, 'nav-fixed-bar--retracted');
    }
    if (scrollPosition < 120 && retracted) {
      self.removeShit(el, ['nav-fixed-bar--transition', 'nav-fixed-bar--active', 'nav-fixed-bar--retracted']);
    }
  },
  handleBlogItems: function (elem) {
  // get location of each blog item, return item name and location
  var self = this;
  var counter  = 0;
     while (counter < elem.length) {
         var $blogEntry = elem[counter],
             blogEntryLocation  = $blogEntry.getBoundingClientRect();
         self.testBlogItemsLocation($blogEntry, blogEntryLocation);
     counter ++;
     }
  },
  testBlogItemsLocation: function (elem, elemLocation) {
  // gets location info on blog items, decides whether it should be active, inactive and neutral
  var self = this;
  var blogEntryTop = elemLocation.top,
      blogEntryBottom = elemLocation.bottom,
      changePoint = document.documentElement.clientHeight * 0.25;

		if (blogEntryTop <= changePoint && blogEntryBottom >= changePoint) {
         //make active
         self.setBlogItemActive(elem);
		}
		 else if (blogEntryBottom <= changePoint) {
         // make inactive
         self.setBlogItemNotActive(elem);
		}
		 else if (blogEntryTop >= changePoint) {
         // make neutral
         self.setBlogItemDefault(elem);
			}
  },
	setBlogItemActive: function (elem) {
	   // adds active state to blog item
	   // sets active state on scroll down
	   var self = this;
		if (elem.classList.contains('inactive-blog-item')) {
			self.removeShit(elem, 'inactive-blog-item');
			setTimeout(function(){
				self.addShit(elem, 'active-blog-item');
			}, 5000);
		}
		//sets active state on scroll back
		else {
		self.addShit(elem, 'active-blog-item');
		}
		return elem;
	},
	setBlogItemNotActive: function (elem) {
	// removes active state and adds inactive state
      var self = this;
      self.removeShit(elem, 'active-blog-item');
      self.addShit(elem, 'inactive-blog-item');
	},
	setBlogItemDefault: function (elem) {
		var self = this;
		if (elem.classList.contains ('active-blog-item')) {
				self.removeShit(elem, 'active-blog-item');
		}
		else {
		// do nothing
		}
	},
	initScrollBarListener: function  () {
	   // gets active item, passes it to increment scroll bar function, if triggers scroll bar reset
		var self = this;
		  var activeItem = self.trackActiveItem();
		  if (activeItem === undefined) {
		  	self.trackProgressBar();
		  }
		  else {
			 var scrollWidth = self.calculateScroll(activeItem);
			 self.incrementScrollBar(scrollWidth);
		  }
	},
	trackActiveItem: function () {
	   // finds active item on page, returns it
		var activeItem = document.getElementsByClassName('active-blog-item');
		return activeItem[0];
	},
	calculateScroll: function (elem) {
	   // gets dimensions of active blog item, computes scroll bar width, returns width
		var activeItemDimensions = elem.getBoundingClientRect(),
          activeItemBottom = activeItemDimensions.bottom,
		    activeItemHeight = elem.clientHeight,
		    changePoint = document.documentElement.clientHeight * 0.25,
		    progressBarWidth = (Math.round(((activeItemHeight - (activeItemBottom - changePoint)) / activeItemHeight) * 100 ));
		return progressBarWidth;
	},
incrementScrollBar: function (increment) {
      // increments scroll bar
		var progressBar = document.getElementById('scroll-progress');
      if (increment > 100) {
      	increment = 100;
      }
      progressBar.style.width = increment + '%';
},
trackProgressBar: function () {
   var self = this;
   var scrollPosition = self.getScrollPosition();
   if (scrollPosition < 90) {
		   self.resetProgressBar();
		}
},
 resetProgressBar: function () {
   // resets progress bar to zero when it's between active blog entries.
   var progressBar = document.getElementById('scroll-progress');
   if (progressBar) {
    progressBar.style.width = '0%';
   }
 },
 initBlogTeasers: function(foo) {
   var self = this;
   console.log('teasers', foo);
   var el = document.querySelector('#blog-teaser-wrapper');
   var active = el.classList.contains('blog-teaser-wrapper--active');
   var rect = el.getBoundingClientRect();

   if (rect.top <= window.innerHeight * .75) {
     self.addShit(el, 'blog-teaser-wrapper--active')
   }
 },
  // onload functions
  // animates nameplate on page load
  nameplateAnimate: function () {
    var self = this;
    var siteNameplate = document.querySelector('#main-header-nameplate'),
      navigation = document.querySelector('#navigation-menu'),
      heroImage = document.querySelector('#hero-image'),
      siteSubhead = document.querySelector('#main-subhead');

      self.addShit(siteNameplate, 'main-header-nameplate--active');
      self.addShit(navigation, 'navigation-menu--active');
      self.addShit(siteSubhead, 'triple-module-head--active');
  },
  // sets bg image on hero image
  setBackground: function () {
   var self = this;

   console.log('set background');

   var heroImage = document.querySelector('#hero-image'),
       heroImageName = heroImage.getAttribute('data-image'),
       windowWidth = window.innerWidth; // finds width of browser window
      var imageURL = windowWidth > 700
        ? '/siteart/hero_' + heroImageName + '.jpg'
        : '/siteart/sm_hero_'  + heroImageName + '.jpg';


        console.log(imageURL);

      var img = new Image();
      img.src = imageURL;
      img.onload = function(){
        console.log('on load');
      document.getElementById('hero-image').style.backgroundImage = 'url('+imageURL+')';
      };
  },
  addLink: function() {
    var linkList = [{"name": "email-link", "link": "mailto:david@davidputney.com?Subject=Website%20feedback"}, {"name": "twitter-link", "link": "https://twitter.com/putneydm"}, {"name": "facebook-link",  "link": "https://www.facebook.com/david.putney"}];

    linkList.forEach(function (el){
      var targetEl = document.querySelector('#' + el.name);
      targetEl.innerHTML = "<a href=\"" + el.link + "\">" + targetEl.innerHTML + '</a>'
    });
  },
// sets interactive functions on page
  setActiveState: function (activeFootnoteLink, targetFootnote) {
    var self = this;
    var navHeight = document.getElementById('inside-header').offsetHeight,
      // find items
      activeFootnote  = document.getElementById(targetFootnote).parentNode,
      scrollBackButton = document.getElementById('btn-footnote-return'),
      // find locations
      linkLocation = self.getElemDistance( activeFootnoteLink ),
      targetFootnoteLocation = self.getElemDistance( activeFootnote ) - (navHeight + 150);

    // set active state of link
    self.addShit(activeFootnoteLink, 'footnote-link-active')
        .addShit(activeFootnote, 'list-item-active') // set active state of footnote
        .addShit(scrollBackButton, 'btn-footnote-return-active') // set active state of button
        .scrollToGeneric (targetFootnoteLocation, 200, linkLocation);  // scroll to location
  },
  setInactiveState: function (scrollBackOption) {
    var self = this;
    var activeFootnoteLink = document.getElementsByClassName('footnote-link-active')[0],
      activeFootnote = document.getElementsByClassName('list-item-active')[0],
      footNoteReturnButton = document.getElementById('btn-footnote-return');

      var scrollBackTo;
      var scrollBackFrom;
    if (activeFootnoteLink && activeFootnote && footNoteReturnButton) {
      var scrollBackTo = self.getElemDistance( activeFootnoteLink ) - 250;
      var scrollBackFrom = self.getElemDistance( activeFootnote );
    }
    // set links to inactive
    if (scrollBackOption === false) {
      self.handleInactiveState(activeFootnote, footNoteReturnButton, activeFootnoteLink);
    }
    if (scrollBackOption === true) {
      self.handleInactiveState(activeFootnote, footNoteReturnButton, activeFootnoteLink);
      self.scrollToGeneric (scrollBackTo, 200, scrollBackFrom);  // adds scrollback
    }
  },
  handleInactiveState: function(activeFootnote, footNoteReturnButton, activeFootnoteLink) {
    var self = this;
    var activeParagraph = activeFootnoteLink.parentNode;

    // remove active state of footnote
    self.removeShit(activeFootnote, 'list-item-active')
        .addShit(activeParagraph, 'footnote-paragraph-active')
        .removeShit(footNoteReturnButton, 'btn-footnote-return-active');
    setTimeout(function(){
      self.removeShit(activeFootnoteLink, 'footnote-link-active')
          .removeShit(activeParagraph, 'footnote-paragraph-active');
    }, 4000);
  },
  handleScrollBackButton: function (scrollPosition) {
      var self = this;
      var footnoteLinkSelected = document.getElementsByClassName('footnote-link-selected')[0],
        activeButton = document.getElementsByClassName('btn-footnote-return-active')[0],
        activeFootnote = document.getElementsByClassName('list-item-active')[0];

      if (footnoteLinkSelected && activeButton && activeFootnote) {
      var scrollBackTo = (self.getElemDistance( footnoteLinkSelected )) - 250,
        scrollBackNote = self.getElemDistance( activeFootnote );
      self.handleButton(scrollPosition,scrollBackTo,scrollBackNote);
      }
  },
  handleFootnoteButton: function (scrollPosition) {
    var self = this;
    var footnoteLinkSelected = document.getElementsByClassName('footnote-link-active')[0],
    		activeFootnote = document.getElementsByClassName('list-item-active')[0],
    		scrollBackTo,
    		scrollBackNote;

    if (footnoteLinkSelected && activeFootnote) {
      var scrollBackTo = (self.getElemDistance( footnoteLinkSelected )) - 250;
         scrollBackNote = self.getElemDistance( activeFootnote );
    }
    else if (scrollPosition > scrollBackNote + 40) {
      this.setInactiveState(false);
    }
    else if (scrollBackTo > scrollPosition) {
      this.setInactiveState(false);
    }
  },
  handleScrollButton: function (scrollPosition, scrollButton) {
    var self = this;
    var isButtonActive = scrollButton.classList.contains('scroll-to-top-active');
    if (scrollPosition > 300 && isButtonActive === false) {
      self.addShit(scrollButton, 'scroll-to-top-active');
    }
    if (scrollPosition < 300 && isButtonActive === true) {
      self.removeShit(scrollButton, 'scroll-to-top-active');
      self.addShit(scrollButton, 'scroll-to-top-inactive');
    }
  },
  handleSiteFooter: function(scrollPosition) {
    var self = this;
    var siteFooter = document.getElementById('site-footer'),
       isVisible = self.isElementVisible(siteFooter),
       isFooterActive = siteFooter.classList.contains('site-footer-active');

    if (scrollPosition > 300 && isFooterActive === false) {
      self.addShit(siteFooter, 'site-footer-inactive');
      }
    if (isVisible === true) {
      self.addShit(siteFooter, 'site-footer-active');
    }
  },
  // functions that return data or change elements
  getElemDistance: function ( elem ) {
    var location = 0;
    if (elem.offsetParent) {
      do {
        location += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }
    return location >= 0 ? location : 0;
  },
  addShit: function (object, style) {
    object.classList.add(style);
    return this;
  },
  removeShit: function (object, style) {
    object.classList.remove(style);
    return this;
  },
  removeShitTimer: function (el, style, time) {
    var self = this;
    setTimeout(function(){
      self.removeShit(el, style);
    }, time)
  },
  scrollToGeneric: function(to, duration, start) {
    // slow scrolls to location send destination, duration of scroll and start point
    var self = this;
    var documentBody = document.body,
      html = document.getElementsByTagName('HTML')[0],
      scrollFunction = self.easeOutCubic,
      change = to - start,
      currentTime = 0,
      increment = 20;

  function animateScroll(){
      currentTime += increment;
      var val = scrollFunction(currentTime, change, duration, start);
      documentBody.scrollTop = val;
      html.scrollTop = val;
      if(currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    }
    animateScroll();
  },
  easeOutCubic: function (currentTime, change, duration, start) {
    currentTime /= duration;
    currentTime--;
    return change*(currentTime*currentTime*currentTime + 1) + start;
  },
  expandMenu: function(topNav) {
    var self = this;
    var button = document.getElementById('menu-button');
    var header = document.getElementById('inside-header')
    var classTest =   topNav.classList.contains('nav-list--open');
    if (classTest === false) {
      self.addShit(topNav, 'nav-list--open');
      self.addShit(button, 'nav-menu-button--active');
      self.addShit(header, 'menu-container--active');
    }
    else {
      self.removeShit(topNav, 'nav-list--open');
      self.addShit(topNav, 'nav-list--close');
      self.removeShit(button, 'nav-menu-button--active');
      self.removeShitTimer(header, 'menu-container--active', 500);
      self.removeShitTimer(topNav, 'nav-list--close', 500);
    }
  },
  isElementVisible: function(el) {
    var rect   = el.getBoundingClientRect(),
      vWidth   = window.innerWidth || document.documentElement.clientWidth,
      vHeight  = window.innerHeight || document.documentElement.clientHeight,
      efp      = function (x, y) { return document.elementFromPoint(x, y); };
    // Return false if it's not in the viewport
    if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight) {
      return false;
      }

    // Return true if any of its four corners are visible
    return (
        el.contains(efp(rect.left,  rect.top)) ||  el.contains(efp(rect.right, rect.top)) ||  el.contains(efp(rect.right, rect.bottom)) ||  el.contains(efp(rect.left,  rect.bottom)) );
  },
  getScrollPosition: function () {
    var scrollPosition = window.scrollY;
    return scrollPosition;
  },
  hasClass: function (element, className) {
    // test if element has a class name or not
      var result = element.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
        if (result === true) {
          return true;
        }
        else {
          return false;
        }
  }
};
(function() {
  "use strict";
  pageFunctions.intialize();
})();
