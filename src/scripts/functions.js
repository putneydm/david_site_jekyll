var pageFunctions = {
  intialize: function () {
  "use strict";
  console.log('works');

    // objects
    var siteNameplate = document.getElementById('main-header-nameplate'),
      navigation = document.getElementById('navigation-menu'),
      heroImage = document.getElementById('hero-image'),
      siteSubhead = document.getElementById('main-subhead'),
      scrollToTopButton = document.getElementById('scroll-to-top'),
      documentBody = document.body,
      menuButton = document.getElementById('menu-button'),
      navMenu = document.getElementById('nav-menu'),
      topNav = document.getElementById('inside-header'),
      blogEntries = document.getElementsByClassName('blog-entry-text');

    //data
    var pageType = document.getElementsByTagName('Body')[0].getAttribute('data-pagetype');

    var heroImageName;
    if (heroImage) {
      var heroImageName = heroImage.getAttribute('data-image');
    }
    //measurements
    var windowWidth = window.innerWidth; // finds width of browser window
    var heroArtHeight;
    if (heroImage) {
      var heroArtHeight = heroImage.clientHeight * 0.70;
    }
    //js test
    this.initJsTest(documentBody);

    // init listeners
    this.initScrollButton(scrollToTopButton, documentBody);
    this.initMenuButton(navMenu, menuButton);
    this.initFootnoteClick(topNav, menuButton);
    this.initScrollBackButton();
  //  this.initProgressBar();

    this.initScrollListener(scrollToTopButton, heroImage, topNav, heroArtHeight, blogEntries);

    // onload actions
    this.nameplateAnimate(siteNameplate, navigation, heroImage, siteSubhead); // animates nameplate
    this.setBackground(heroImageName, windowWidth); // swaps out hero image on load.

    this.addLink();

    //scroll actions

  },
  initScrollListener: function (scrollToTopButton, heroImage, topNav, heroArtHeight, blogEntries) {
   var self=this;

   document.onscroll = function() {
    var scrollPosition = self.getScrollPosition(); // gets scroll position from function

    self.initNavHeaderAnimate(heroImage, heroArtHeight,topNav)

    self.handleScrollButton(scrollPosition, scrollToTopButton);
    // if (heroImage) {
    //   self.handleHeroArt(scrollPosition, heroImage, heroArtHeight);
    // }
    self.handleSiteFooter(scrollPosition);
    self.handleScrollBackButton (scrollPosition);
    self.handleFootnoteButton (scrollPosition);
  //  self.initProgressBar();

      self.initBlogTeasers();

   if (blogEntries) {
      self.handleBlogItems(blogEntries);
      self.initScrollBarListener();
  	}
    return this;
  };
  },
  //   initializes stuff
  initJsTest: function () {
    // checks for js and removes no-js tag from body
    document.getElementsByTagName('HTML')[0].classList.remove('no-js');
//    documentBody.className += ' no-js';
  },
  initScrollButton: function (scrollToTopButton){
    var self = this;
      scrollToTopButton.addEventListener("click", function(e){
      e.preventDefault();
      var scrollStart = self.getScrollPosition();
      self.scrollToGeneric(0, 500, scrollStart);
  });
  },
  initMenuButton: function (topNav, menuButton){
    var self = this;
    menuButton.addEventListener("click", function(e){
      e.preventDefault();
      self.expandMenu(topNav);
    });
  },
  initFootnoteClick: function () {
    // this adds listener to sup tags using event delegation
    var self = this;
    // Get the element, add a click listener
    var blogContainer =  document.getElementById("blog-container");

    if (blogContainer) {
      blogContainer.addEventListener("click", function(e) {
        var linkType = e.target.parentNode.tagName;  // checks if it is a sup tag
        // if it is, it gets an event handler added to it and prevent default
        if (linkType === 'SUP') {
          e.preventDefault();
          if(e.target && e.target.nodeName === "A") {
            var footNoteLink = document.getElementsByTagName('SUP');
            // tests if the clicked item is set to active state
            var activeState = self.hasClass(footNoteLink, 'footnote-link-active');
            if (activeState === true) {
              self.setInactiveState(false); // removes active state of other footnote links
            }
            var footnoteID =  e.target.getAttribute("href").slice(1); //gets id of footnote
            self.setActiveState (e.target.parentNode, footnoteID);
          }
        }
        else {
          // function normally
        }
      });
    }
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
  initNavHeaderAnimate: function (heroImage, heroArtHeight,topNav) {
    var self=this;
    self.handleHeroAnimate(heroImage,heroArtHeight);
    self.handleNavAnimate(topNav,heroArtHeight);
  },
  handleHeroAnimate:function (el, elHeight) {
    var self = this;
    var scrollPosition = self.getScrollPosition ();
    if (elHeight < scrollPosition + 150) {
      self.removeShit(el, 'hero-art-portfolio--visible');
      self.addShit(el, 'hero-art-portfolio--hidden')
      return false;
    }
    if (elHeight > scrollPosition + 150) {
      self.removeShit(el, 'hero-art-portfolio--hidden');
      self.addShit(el, 'hero-art-portfolio--visible');
    }
  },
  handleNavAnimate: function (el,elHeight) {
    var self=this;
    var scrollPosition = self.getScrollPosition ();
    var extended = el.classList.contains('nav-fixed-bar--extended');
    var retracted = el.classList.contains('nav-fixed-bar--retracted');
    //adds styles  on scroll down

    if (scrollPosition > 120 && retracted === false) {
      self.addShit(el, 'nav-fixed-bar--active');
      self.addShit(el, 'nav-fixed-bar--retracted');
      return false;
    }
    if (scrollPosition > elHeight + 150 && retracted === true) {
      self.addShit(el, 'nav-fixed-bar--transition');
      self.addShit(el, 'nav-fixed-bar--extended');
      self.removeShit(el, 'nav-fixed-bar--retracted');
      return false;
    }
    if (scrollPosition < elHeight && extended === true) {
      self.removeShit(el, 'nav-fixed-bar--extended');
      self.addShit(el, 'nav-fixed-bar--retracted');
    //  self.removeShit(el, 'nav-fixed-bar--transition');
    }
    if (scrollPosition < 120 && retracted === true) {
      self.removeShit(el, 'nav-fixed-bar--transition');
      self.removeShit(el, 'nav-fixed-bar--active');
      self.removeShit(el, 'nav-fixed-bar--retracted');
    //  self.removeShit(el, 'nav-fixed-bar--transition');
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
 initBlogTeasers: function () {
   var self = this;
   var el = document.getElementById('blog-teaser-wrapper');
   if (el) {
     var ready = self.isElementVisible(el);
     var elDist = self.getElemDistance(el) - (window.innerHeight * .75);
     var pos = self.getScrollPosition();
   }

   if (el && ready == true && pos > elDist) {
      self.addShit(el, 'blog-teaser-wrapper--active')
   }
 },
  // onload functions
  // animates nameplate on page load
  nameplateAnimate: function (siteNameplate, navigation, heroImage, siteSubhead) {
   var self = this;
   if (siteNameplate)  {
      self.addShit(siteNameplate, 'main-header-nameplate--active');
      self.addShit(navigation, 'navigation-menu--active');
      self.addShit(siteSubhead, 'triple-module-head--active');
    }
    if (heroImage)  {
      self.removeShit(heroImage, 'filter-me');
    }
  },
  // sets bg image on hero image
  setBackground: function (heroImageName, windowWidth) {
   var self = this;
      var imageURL = self.setHeroURL(windowWidth) + heroImageName + '.jpg';
      var img = new Image();
      img.onload = function(){
      document.getElementById('hero-image').style.backgroundImage = 'url('+imageURL+')';
      };
      img.src = imageURL;
  },
  setHeroURL: function(windowWidth) {
   // tests page width and page type to set proper URL for image loader
    if (windowWidth < 700) {
      return '/siteart/sm_hero_';
      }
    if (windowWidth > 700) {
      return '/siteart/hero_';
      }
  },
  addLink: function() {
    var footerLinkCounter = 0;
    var objectData = ['email-link', 'twitter-link', 'facebook-link'];
    var links = ['<a href="mailto:david@davidputney.com?Subject=Website%20feedback" target="_top">', '<a href="https://twitter.com/putneydm">', '<a href="https://www.facebook.com/david.putney">'];

    while (footerLinkCounter < objectData.length) {
      var target = objectData[footerLinkCounter],
        addLink = links[footerLinkCounter],
        orgHtml = document.getElementById(target).innerHTML,
        newHtml = addLink + orgHtml + "</a>";
      document.getElementById(target).innerHTML = newHtml;
      footerLinkCounter++;
    }
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
  pageFunctions.intialize();
})();
