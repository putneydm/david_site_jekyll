var pageFunctions = {
  intialize: function () {
  console.log('works');
    var self=this;
    //  test for js
    this.initJsTest(document.body);

    // init listeners
    this.initScrollButton();
    this.initMenuButton();
    this.addLink();
    this.initResizeListener();
  },
  intializeBlog: function() {
    var self=this;
    self.setBackground(); // swaps out hero image on load.
    self.initScrollListener('blog');
  },
  intializeBlogEntry: function() {
    var self=this;
    self.initFootnoteClick();
    this.initScrollBackButton();
    self.entryList = [].slice.call(document.querySelectorAll(".blog-entry"));
    self.initScrollListener('blogEntry');
  },
  initializeIndex: function() {
    var self=this;
    self.nameplateAnimate(); // animates nameplate
    self.initScrollListener('index');
    self.setBackground();
  },
  initializePortfolio: function() {
    var self=this;
    self.initScrollListener('portfolio_entry');
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
 initBlogTeasers: function() {
   var self = this;
   var el = document.querySelector('#blog-teaser-wrapper'),
       active = el.classList.contains('blog-teaser-wrapper--active'),
       rect = el.getBoundingClientRect();

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
   var heroImage = document.querySelector('#hero-image'),
       heroImageName = heroImage.getAttribute('data-image'),
       windowWidth = window.innerWidth, // finds width of browser window
       imageURL = windowWidth > 700
          ? '/siteart/hero_' + heroImageName + '.jpg'
          : '/siteart/sm_hero_'  + heroImageName + '.jpg';

   var img = new Image();
   img.src = imageURL;
   img.onload = function(){
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
  setFootnoteActiveState: function(activeFootnoteLink, targetFootnote) {
    var self = this;
    var navHeight = document.querySelector('#inside-header').offsetHeight,
      activeFootnote  = document.querySelector('#' + targetFootnote).parentNode,
      scrollBackButton = document.querySelector('#btn-footnote-return'),
      linkLocation = self.getElemDistance(activeFootnoteLink),
      targetFootnoteLocation = self.getElemDistance( activeFootnote ) - (navHeight + 150);
    self.addShit(scrollBackButton, 'btn-footnote-return-active')
    self.addShit(activeFootnoteLink, 'footnote-link-active');
    self.addShit(activeFootnote, 'list-item-active');
    self.scrollToGeneric(targetFootnoteLocation, 200, linkLocation);
  },
  setInactiveState: function(scrollBackOption) {
    var self = this;
    var activeFootnoteLink = document.querySelectorAll('.footnote-link-active')[0],
      activeFootnote = document.querySelectorAll('.list-item-active')[0],
      footNoteReturnButton = document.querySelector('#btn-footnote-return');
    if (activeFootnoteLink && activeFootnote && footNoteReturnButton) {
      var scrollBackTo = self.getElemDistance( activeFootnoteLink ) - 250;
      var scrollBackFrom = self.getElemDistance( activeFootnote );
    }
    // set links to inactive
    if (!scrollBackOption) {
      self.handleInactiveState(activeFootnote, footNoteReturnButton, activeFootnoteLink);
    }
    if (scrollBackOption) {
      self.handleInactiveState(activeFootnote, footNoteReturnButton, activeFootnoteLink);
      self.scrollToGeneric (scrollBackTo, 200, scrollBackFrom);  // adds scrollback
    }
  },
  handleInactiveState: function() {
    var self = this;
    var activeFootnoteLink = document.querySelectorAll('.footnote-link-active')[0],
        activeFootnote = document.querySelectorAll('.list-item-active')[0],
        footNoteReturnButton = document.querySelector('#btn-footnote-return'),
        activeParagraph = activeFootnoteLink.parentNode,
        active = activeFootnoteLink.classList.contains('list-item-active');
    // remove active state of footnote
      self.removeShit(activeFootnote, 'list-item-active');
      self.addShit(activeParagraph, 'footnote-paragraph-active');
      self.removeShit(footNoteReturnButton, 'btn-footnote-return-active');
      setTimeout(function(){
      self.removeShit(activeFootnoteLink, 'footnote-link-active');
      self.removeShit(activeParagraph, 'footnote-paragraph-active');
      }, 4000);
  },
  handleManualScrollback: function() {
    var self=this;
    var activeFootnoteLink = document.querySelectorAll('.footnote-link-active')[0],
        activeFootnote = document.querySelectorAll('.list-item-active'),
        footNoteReturnButton = document.querySelector('#btn-footnote-return');

      if (activeFootnoteLink) {
        var foo = activeFootnoteLink.getBoundingClientRect();
      }
      if (foo && foo.top >= 250) {
        console.log('reset');
        self.handleInactiveState();
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
      var scrollBackNote = self.getElemDistance( activeFootnote );
    }
    else if (scrollPosition > scrollBackNote + 40) {
      this.setInactiveState(false);
    }
    else if (scrollBackTo > scrollPosition) {
      this.setInactiveState(false);
    }
  },
  handleScrollButton: function (scrollPosition) {
    var self = this;
    var scrollButton = document.querySelector('#scroll-to-top'),
        active = scrollButton.classList.contains('scroll-to-top-active');

    if (scrollPosition > 300 && !active) {
      self.addShit(scrollButton, 'scroll-to-top-active');
    }
    if (scrollPosition < 300 && active) {
      self.removeShit(scrollButton, 'scroll-to-top-active');
      self.addShit(scrollButton, 'scroll-to-top-inactive');
    }
  },
  handleSiteFooter: function(scrollPosition) {
    var self = this;
    var siteFooter = document.querySelector('#site-footer'),
        isVisible = self.isElementVisible(siteFooter),
        active = siteFooter.classList.contains('site-footer-active');

    if (scrollPosition > 300 && !active) {
      self.addShit(siteFooter, 'site-footer-inactive');
      }
    if (isVisible) {
      self.addShit(siteFooter, 'site-footer-active');
    }
  },
  handleScrollProgress: function() {
    var self=this;
    var progressBar = document.getElementById('scroll-progress'),
        activeItem = document.querySelector('.entry--active');
    if (activeItem) {
      var percent = self.calculateBlogPercentage(activeItem);
      progressBar.style.width = percent + '%';
    }
    if (!activeItem) {
      progressBar.style.width = '0%';
    }
  },
  calculateBlogPercentage: function(activeItem) {
    var self=this;
    var activeItemPos = activeItem.getBoundingClientRect().top - (window.innerHeight * .15),
        itemHeight = activeItem.clientHeight,
        percentCalc =  Math.round((activeItemPos / itemHeight) * -100);
      return percentCalc < 0 ? 0:
        percentCalc > 100 ? 100:
        percentCalc;
  },
  setActiveBlogItem: function() {
    var self=this;
    var windowHeight = window.innerHeight,
        triggerLine = windowHeight * .15;

    self.entryList.forEach(function(el) {
      var itemBounds = el.getBoundingClientRect(),
          active = el.classList.contains('entry--active'),
          deactivated = el.classList.contains('entry--deactivated');
      // console.log(foo.top);
      if (itemBounds.top <= triggerLine && !active && !deactivated) {
        el.classList.add('entry--active');
      }
      if (itemBounds.bottom <= triggerLine && active && !deactivated) {
        el.classList.remove('entry--active');
        el.classList.add('entry--deactivated');
      }
      if (itemBounds.bottom >= triggerLine && !active && deactivated) {
        el.classList.remove('entry--deactivated');
        el.classList.add('entry--active');
      }
      if (itemBounds.top >= triggerLine && active) {
        el.classList.remove('entry--active');
      }
    });
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
    if (style.constructor === Array) {
      style.forEach(function(el) {
        object.classList.add(el);
      });
    } else {
      object.classList.add(style);
    }
  },
  removeShit: function (object, style) {
    if (style.constructor === Array) {
      style.forEach(function(el) {
        object.classList.remove(el);
      });
    } else {
      object.classList.remove(style);
    }
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
    console.log('scroll');
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
  expandMenu: function() {
    var self = this;
    var button = document.querySelector('#menu-button'),
        header = document.querySelector('#inside-header'),
        topNav = document.querySelector('#nav-menu'),
        classTest = topNav.classList.contains('nav-list--open');

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
  }
};
