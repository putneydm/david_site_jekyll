var ready = function (fn) {
  console.log('ready');
  // Sanity check
  if (typeof fn !== 'function') return;
  // If document is already loaded, run method
  if (document.readyState === 'complete') {
    return fn();
  }
  // Otherwise, wait until document is loaded
  document.addEventListener('DOMContentLoaded', fn, false);
};

var pageFunctions = {
  intialize: function () {
    var self = this;
    this.initJsTest(); //test for js
    this.initScrollButton();
    this.initMenuButton();
    this.addLink();
    this.initResizeListener();
    this.getElementsAll();
    this.handleDate();
  },
  intializeBlog: function () {
    var self = this;
    var scrollPosition = self.getScrollPosition();
    self.getElementsHero();
    self.setBackground(self.heroArt); // swaps out hero image on load.
    self.getElementsBlog();
    self.setActiveBlogItem();
    self.initScrollListener('blog');
    self.initQuoteAnimate(self.blogQuotes);
    this.initScrollBackButton();
    self.handleNavAnimate(scrollPosition);
    self.handleHeroAnimate(scrollPosition);
    self.initButtonHandler();
  },
  intializeBlogEntry: function () {
    var self = this;
    var scrollPosition = self.getScrollPosition();
    self.getElementsBlog();
    self.initFootnoteClick();
    this.initScrollBackButton();
    self.setActiveBlogItem();
    self.handleNavAnimate(scrollPosition);
    self.initScrollListener('blogEntry');
    self.initQuoteAnimate(self.blogQuotes);
    // self.handleHighlightClick();
    self.intializeHighlight();
  },
  initializeIndex: function () {
    var self = this;
    self.getElementsIndex();
    self.nameplateAnimate(); // animates nameplate
    self.initScrollListener('index');
  },
  initializePortfolio: function () {
    var self = this;
    self.initScrollListener('portfolio_entry');
  },
  initializeHero: function () {
    var self = this;
    self.getElementsHero();
    self.setBackground(self.heroArt);
    console.log("init hero y")
  },
  intializeMinimal: function () {
    var self = this;
    self.initScrollListener();
  },
  intializeSearch: function () {
    var self = this;
    self.initScrollListener();
    self.getElementsHedSwap();
  },
  getElementsAll: function () {
    var self = this;
    self.header = document.querySelector('#inside-header');
    self.navMenu = document.querySelector('#nav-menu');
    self.logo = document.querySelector('#header-logo');
    self.menuButton = document.querySelector('#menu-button');
    self.topNav = document.querySelector('#nav-menu'),
    self.siteFooter = document.querySelector('#site-footer');
    self.siteFooterLinks = [].slice.call(document.querySelectorAll('#footer-links li'));
    self.scrollButton = document.querySelector('#scroll-to-top');
  },
  getElementsHero: function () {
    var self = this;
    self.heroArt = document.querySelector('#hero-image');
    self.heroArtHeight = document.querySelector('#hero-image').clientHeight;
  },
  getElementsBlog: function () {
    var self = this;
    self.footNoteReturnButton = document.querySelector('#btn-footnote-return');
    self.scrollProgress = document.querySelector('#scroll-progress');
    self.blogTeaser = document.querySelector('#blog-teaser-wrapper');
    self.blogQuotes = [].slice.call(document.querySelectorAll('.blog-pullquote'));
    self.blogTeasers = [].slice.call(document.querySelectorAll('.blog-teaser-item'));
    self.BlogTeaserList = document.querySelector('.blog-teaser-list');

    // remove

    self.headSpace = document.querySelector('#headspace');
    self.headerHeadline = document.querySelector('#headspace .nav-blog-headline');
    self.entryList = [].slice.call(document.querySelectorAll(".blog-entry"));
    self.logo = document.querySelector('#header-logo');
    self.anchor = document.querySelector('.main-header-logo-link');
  },
  getElementsHedSwap: function () {
    var self = this;
    self.headSpace = document.querySelector('#headspace');
    self.headerHeadline = document.querySelector('#headspace .nav-blog-headline');
    self.entryList = [].slice.call(document.querySelectorAll(".blog-entry"));
    self.logo = document.querySelector('#header-logo');
    self.anchor = document.querySelector('.main-header-logo-link');
  },
  getElementsIndex: function () {
    var self = this;
    self.blogTeaser = document.querySelector('#blog-teaser-wrapper');
    self.blogTeasers = [].slice.call(document.querySelectorAll('.blog-teaser-item'));
    self.BlogTeaserList = document.querySelector('.blog-teaser-list');
  },
  initScrollListener: function (pageType) {
    var self = this;
    // var used to determine scroll direction
    self.lastScrollTop = 0;
    document.onscroll = function () {
      var scrollPosition = self.getScrollPosition();
      // console.log("scroll")

      if (pageType === "blog") {
        self.handleInsideNavTransition(scrollPosition);
        self.handleNavAnimate(scrollPosition);
        self.handleHeroAnimate(scrollPosition);
      }
      if (pageType === "blogEntry" || pageType === "blog") {
        self.setActiveBlogItem();
        self.handleScrollProgress();
        self.handleFootnoteButton(scrollPosition);
        self.handleManualScrollback(scrollPosition);
        self.initBlogTeasers(); 
        self.initQuoteAnimate(self.blogQuotes);
        self.handleHeadlineSwap(false);
        // console.log("scroll blog")
      }
      if (pageType === "search") {
        //  self.setActiveBlogItem();
        //  self.handleScrollProgress();
        //  self.handleFootnoteButton (scrollPosition);
        self.handleManualScrollback(scrollPosition);
        self.initBlogTeasers();
        self.initQuoteAnimate(self.blogQuotes);
        self.handleHeadlineSwap(false);
      }
      if (pageType === 'index') {
        self.handleHeroAnimate(scrollPosition);
        self.handleNavAnimate(scrollPosition);
      }
      if (pageType === 'index') {
        self.handleIndexNavTransition(scrollPosition);
        self.initBlogTeasers();
      }
      if (pageType === 'portfolio_entry') {
        self.handleInsideNavTransition(scrollPosition);
      }
      self.handleScrollButton(scrollPosition);
      self.handleSiteFooter(scrollPosition);
      self.handleManualScrollback(scrollPosition);
    };
  },
  initResizeListener: function () {
    var self = this;
    window.onresize = function (e) {
      self.heroArtHeight = document.querySelector('#hero-image').clientHeight;
      self.entryList = [].slice.call(document.querySelectorAll(".blog-entry"));
    };
  },
  initJsTest: function () {
    document.querySelectorAll('HTML')[0].classList.remove('no-js');
  },
  initScrollButton: function () {
    var self = this;
    var scrollToTopButton = document.querySelector('#scroll-to-top');
    scrollToTopButton.addEventListener("click", function (e) {
      var scrollStart = self.getScrollPosition();
      self.scrollToGeneric(0, 500, scrollStart);
      e.preventDefault();
    });
  },
  initMenuButton: function () {
    var self = this;
    var menuButton = document.querySelector('#menu-button'),
      navMenu = document.querySelector('#nav-menu');
    menuButton.addEventListener("click", function (e) {
      self.expandMenu();
      e.preventDefault();
    });
  },
  initButtonHandler: function () {
    const cont = document.querySelector('#blog-container');
    cont.addEventListener("click", (e) => {
      const scroll = document.documentElement.scrollTop
      const val = document.querySelector(`#${e.target.value}`).classList.remove("closed");
      document.documentElement.scrollTop = document.body.scrollTop = scroll;
    })

  },
  initFootnoteClick: function () {
    // this adds listener to sup tags
    var self = this;
    var blogContainer = document.querySelector("#blog-container");

    blogContainer.addEventListener("click", function (e) {
      var linkType = e.target.parentNode.tagName === 'SUP'; //
      var activeItems = [].slice.call(document.querySelectorAll(".footnote-link-active"));
      if (activeItems) {
        activeItems.forEach(function (el) {
          el.classList.remove('footnote-link-active');
        });
      }
      if (linkType && e.target && e.target.nodeName === "A") {
        var footnoteID = e.target.getAttribute("href").slice(1); //gets id of footnote
        self.setFootnoteActiveState(e.target.parentNode, footnoteID);
      }
    });
  },
  initScrollBackButton: function () {
    var self = this;
    // var footnoteReturnButton = document.getElementById("btn-footnote-return");
    self.footNoteReturnButton.classList.add('btn-footnote-return--trans');
    self.footNoteReturnButton.addEventListener("click", function (e) {
      e.preventDefault();
      self.setInactiveState(true);
    });
  },
  handleHeroAnimate: function () {
    var self = this;
    var scrollPosition = self.getScrollPosition(),
      el = self.heroArt,
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
  handleIndexNavTransition: function (pos) {
    var self = this;
    var header = self.header,
      nav = self.navMenu,
      logo = self.logo,
      heroArt = self.heroArtHeight;
    var active = header.classList.contains('nav-fixed-bar--display');

    if (active && pos >= heroArt) {
      self.removeShit(header, 'nav-fixed-bar--display');
      self.removeShit(logo, 'main-header-logo--display');
      self.removeShit(nav, 'nav-list--display');
      self.addShit(header, ['will-change-ot', 'nav-fixed-bar']);
      self.addShit(logo, 'main-header-logo');
      self.addShit(nav, 'nav-list');
    }
    if (!active && pos <= heroArt) {
      self.removeShit(header, 'nav-fixed-bar');
      self.removeShit(logo, 'main-header-logo');
      self.removeShit(nav, 'nav-list');

      self.addShit(header, 'nav-fixed-bar--display');
      self.addShit(logo, 'main-header-logo--display');
      self.addShit(nav, 'nav-list--display');
    }
  },
  handleInsideNavTransition: function (pos) {
    var self = this;
    var header = self.header,
      nav = self.navMenu,
      logo = self.logo,
      heroArt = self.heroArtHeight,
      active = header.classList.contains('nav-fixed-bar--nodisplay');

    if (active && pos >= heroArt) {
      // self.addShit(header, 'will-change-ot');
      self.removeShit(header, 'nav-fixed-bar--nodisplay');
      self.removeShit(logo, 'main-header-logo--nodisplay');
      self.removeShit(nav, 'nav-list--nodisplay');
      // self.handleWillChange('will-change-ot', header);
    }
    if (!active && pos <= heroArt) {
      // self.addShit(header, ['will-change-ot', 'nav-fixed-bar--nodisplay'] );
      self.addShit(header, 'nav-fixed-bar--nodisplay');
      self.addShit(logo, 'main-header-logo--nodisplay');
      self.addShit(nav, 'nav-list--nodisplay');
      self.handleWillChange('will-change-ot', header);
    }
  },
  handleNavAnimate: function (pos) {
    var self = this;
    var header = self.header,
      heroArt = self.heroArtHeight,
      button = self.menuButton,
      topNav = self.navMenu,
      active = topNav.classList.contains('nav-list--open'),
      trigger = heroArt * 1.25,
      extended = header.classList.contains('nav-fixed-bar--extend'),
      navOpen = topNav.classList.contains('nav-list--open');
    if (!extended && pos >= trigger) {
      self.addShit(header, ['will-change-ot', 'nav-fixed-bar--extend']);
      self.handleWillChange('will-change-ot', header);
      // header.classList.add('nav-fixed-bar--extend');
    }
    if (!navOpen && extended && pos <= trigger) {
      self.addShit(header, ['will-change-ot', 'nav-fixed-bar--retract']);
      self.handleWillChange('will-change-ot', header);
    }
    if (extended && pos <= heroArt) {
      self.removeShit(header, ["nav-fixed-bar--extend", "nav-fixed-bar--retract"]);
    }
    if (navOpen && pos <= trigger) {
      self.removeShit(header, 'nav-fixed-bar--extend');
      self.removeShit(topNav, 'nav-list--open');
      self.removeShit(button, 'nav-menu-button--active');
      self.removeShit(header, 'menu-container--active');
    }
  },
  initBlogTeasers: function () {
    var self = this;
    var el = self.blogTeaser,
      active = el.classList.contains('blog-teaser-wrapper--active'),
      rect = el.getBoundingClientRect();

    if (rect.top <= window.innerHeight * 0.75 && !active) {
      self.addShit(el, 'blog-teaser-wrapper--active');
      self.handleWillChange('will-change-ot', self.BlogTeaserList, 'LI');
    }
  },
  // onload functions
  // animates nameplate on page load
  nameplateAnimate: function () {
    var self = this;
    var siteNameplate = document.querySelector('#header-logo'),
      navigation = document.querySelector('#nav-menu'),
      siteSubhead = document.querySelector('#main-subhead');

    self.addShit(siteNameplate, 'main-header-nameplate--active');
    self.addShit(navigation, 'navigation-menu--active');
    self.addShit(siteSubhead, 'triple-module-head--active');
    self.handleWillChange('will-change-ot', siteNameplate);
    self.handleWillChange('will-change-ot', siteSubhead);
    self.handleWillChange('will-change-ot', navigation);
  },
  // sets bg image on hero image
  setBackground: function (el) {
    var self = this;
    var dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var heroImageName = el.getAttribute('data-image'),
      windowWidth = window.innerWidth, // finds width of browser window
      pageType = document.querySelector('BODY').dataset.pagetype,   
      imageURL = windowWidth > 700 && dark ? '/siteart/hero_dark_' + heroImageName + '.jpg' :
      windowWidth <= 700 && dark ? '/siteart/sm_hero_dark_' + heroImageName + '.jpg':
      windowWidth > 700 && !dark ? '/siteart/hero_' + heroImageName + '.jpg' :
      '/siteart/sm_hero_' + heroImageName + '.jpg';  
    var img = new Image();
    img.src = imageURL;

    if (self.promiseCheck()) {
      promise().then(function () {
        el.style.backgroundImage = 'url(' + imageURL + ')';
        el.classList.add('loading-overlay--loaded');
        el.addEventListener('transitionend', function () {
          self.removeShit(el, ['loading-overlay--loaded', 'loading-overlay--preset']);
        });
      });
    } else {
      el.style.backgroundImage = 'url(' + imageURL + ')';
      self.removeShit(el, ['loading-overlay--loaded', 'loading-overlay--preset']);
    }

    function promise() {
      var p = new Promise(function (resolve, reject) {
        img.addEventListener('load', function (e) {
          if (e) {
            resolve('works!');
          } else {
            reject('failed');
          }
        });
      });
      return p;
    }
  },
  addLink: function () {
    var linkList = [{
      "name": "email-link",
      "link": "mailto:david@davidputney.com?Subject=Website%20feedback"
    }, {
      "name": "linked-in",
      "link": "https://www.linkedin.com/in/davidmputney"
    }];

    linkList.forEach(function (el) {
      var targetEl = document.querySelector('#' + el.name);
      targetEl.innerHTML = "<a href=\"" + el.link + "\">" + targetEl.innerHTML + '</a>';
    });
  },
  // sets interactive functions on page
  setFootnoteActiveState: function (activeFootnoteLink, targetFootnote) {
    var self = this;
    var navHeight = self.header.offsetHeight,
      activeFootnote = document.querySelector('#' + targetFootnote).parentNode,
      scrollBackButton = document.querySelector('#btn-footnote-return'),
      linkLocation = self.getElemDistance(activeFootnoteLink),
      targetFootnoteLocation = self.getElemDistance(activeFootnote) - (navHeight + 150);
    self.addShit(scrollBackButton, 'btn-footnote-return-active');
    self.addShit(activeFootnoteLink, 'footnote-link-active');
    self.addShit(activeFootnote, 'list-item-active');
    self.scrollToGeneric(targetFootnoteLocation, 200, linkLocation);
  },
  setInactiveState: function (scrollBackOption) {
    var self = this;
    var activeFootnoteLink = document.querySelectorAll('.footnote-link-active')[0],
      activeFootnote = document.querySelectorAll('.list-item-active')[0],
      footNoteReturnButton = self.footNoteReturnButton;

    var scrollBackTo = self.getElemDistance(activeFootnoteLink) - 250;
    var scrollBackFrom = self.getElemDistance(activeFootnote);
    // set links to inactive
    if (!scrollBackOption) {
      self.handleInactiveState(activeFootnote, footNoteReturnButton, activeFootnoteLink);
    }
    if (scrollBackOption) {
      self.handleInactiveState(activeFootnote, footNoteReturnButton, activeFootnoteLink);
      self.scrollToGeneric(scrollBackTo, 200, scrollBackFrom); // adds scrollback
    }
  },
  handleInactiveState: function () {
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
    setTimeout(function () {
      self.removeShit(activeFootnoteLink, 'footnote-link-active');
      self.removeShit(activeParagraph, 'footnote-paragraph-active');
    }, 4000);
  },
  handleManualScrollback: function () {
    var self = this;
    var activeFootnoteLink = document.querySelectorAll('.footnote-link-active')[0],
      activeFootnote = document.querySelectorAll('.list-item-active'),
      footNoteReturnButton = self.footNoteReturnButton,
      bound;

    if (activeFootnoteLink) {
      bound = activeFootnoteLink.getBoundingClientRect();
    }
    if (bound && bound.top >= 250) {
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
      scrollBackTo = (self.getElemDistance(footnoteLinkSelected)) - 250;
      scrollBackNote = self.getElemDistance(activeFootnote);
    } else if (scrollPosition > scrollBackNote + 40) {
      this.setInactiveState(false);
    } else if (scrollBackTo > scrollPosition) {
      this.setInactiveState(false);
    }
  },
  handleScrollButton: function (scrollPosition) {
    var self = this;
    var scrollButton = self.scrollButton,
      active = scrollButton.classList.contains('scroll-to-top-active');

    if (scrollPosition > 300 && !active) {
      self.addShit(scrollButton, ["will-change-o", "scroll-to-top-active"]);
    }
    if (scrollPosition < 300 && active) {
      self.removeShit(scrollButton, ['scroll-to-top-active', 'will-change-o']);
      self.addShit(scrollButton, 'scroll-to-top-inactive');
    }
  },
  initQuoteAnimate: function (quoteList) {
    var self = this;
    quoteList.forEach(function (el) {
      var visible = self.isElementVisible(el);
      var active =
        el.classList.contains('blog-pullquote--set');
      if (!visible && !active) {
        self.addShit(el, ['will-change-ot', 'blog-pullquote--set']);
      } else if (visible && active) {
        self.handleWillChange('will-change-ot', el);
        el.classList.add('blog-pullquote--animate');
      }
    });
  },
  handleHeadlineSwap: function (manual) {
    var self = this;
    var activeEl = document.querySelector('[data-status="active"]') || false,
      sp = self.getScrollPosition(),
      blogHeadline = document.querySelector('[data-status="active"] .blog-headline') || false,
      hedVis = self.headerHeadline.classList.contains('nav--appear') || false,
      hedNoVis = self.headerHeadline.classList.contains('nav--noappear') || false,
      hedText = blogHeadline.innerHTML || false,
      direction = self.scrollDirection(),
      hedPos = self.getElemDistance(blogHeadline),
      scrollOverriden = self.headSpace.dataset.status === 'scrollOverride' || false,
      scrollPosition = self.getScrollPosition();

    // swap in headline
    if (hedText && self.getElemDistance(blogHeadline) < sp && !hedVis && !hedNoVis) {
      self.headerHeadline.innerHTML = hedText;
      extendEl(self.headerHeadline);
    } else if (hedText && self.getElemDistance(blogHeadline) > sp && hedVis && !hedNoVis) {
      retractEl(self.headerHeadline);
      resetEl(self.headerHeadline);
    }
    // logo out, headline in
    if (!scrollOverriden && hedText && direction && scrollPosition > hedPos) {
      retractEl(self.logo);
      retractEl(self.anchor);
      extendEl(self.headSpace);
    } else if (!direction || manual && !scrollOverriden) {
      extendEl(self.logo);
      extendEl(self.anchor);
      retractEl(self.headSpace);
    }
    if (manual && !scrollOverriden) {
      self.headSpace.dataset.status = 'scrollOverride';
    } else if (manual && scrollOverriden) {
      self.headSpace.dataset.status = 'none';
    }

    function retractEl(el) {
      el.classList.remove('nav--appear');
      el.classList.add('nav--trans');
      el.classList.add('nav--noappear');
    }

    function resetEl(el) {
      el.addEventListener('transitionend', function () {
        el.classList.remove('nav--trans');
        el.classList.remove('nav--noappear');
      });
    }

    function extendEl(el) {
      el.classList.remove('nav--noappear');
      el.classList.add('nav--trans');
      el.classList.add('nav--appear');
    }
  },
  handleSiteFooter: function (scrollPosition) {
    var self = this;
    var siteFooter = self.siteFooter,
      isVisible = self.isElementVisible(siteFooter),
      active = siteFooter.classList.contains('site-footer-active');
    if (isVisible) {
      self.addShit(siteFooter, 'site-footer-active');
      self.handleWillChange("will-change-ot", siteFooter, 'LI');
      self.handleWillChange("will-change-o", siteFooter);
      // console.log("footer")
    }
  },
  handleWillChange: function (style, mainEl, subEl) {
    var self = this;
    if (subEl) {
      mainEl.addEventListener('transitionend', function (e) {
        var el = e.target;
        if (el.tagName === subEl) {
          el.classList.remove(style);
        }
      });
    } else {
      mainEl.addEventListener('transitionend', function (e) {
        mainEl.classList.remove(style);
      });
    }
  },
  handleScrollProgress: function () {
    var self = this;
    var progressBar = self.scrollProgress,
      activeItem = document.querySelector('[data-status="active"]');

    if (activeItem) {
      progressBar.classList.add('scroll-progress--trans');
      var percent = 100 - self.calculateBlogPercentage(activeItem);
      progressBar.style.transform = "translateX(-" + percent + "%)";
    }
    if (!activeItem) {
      progressBar.style.transform = 'translateX(-100%)';
    }
  },
  calculateBlogPercentage: function (activeItem) {
    var self = this;
    var activeItemPos = activeItem.getBoundingClientRect().top - (window.innerHeight * 0.15),
      itemHeight = activeItem.clientHeight,
      percentCalc = Math.round((activeItemPos / itemHeight) * -100);
    return percentCalc < 0 ? 0 :
      percentCalc > 100 ? 100 :
      percentCalc;
  },
  setActiveBlogItem: function () {
    var self = this;
    var windowHeight = window.innerHeight,
      triggerLine = windowHeight * 0.15;

    self.entryList.forEach(function (el) {
      var itemBounds = el.getBoundingClientRect(),
        active = el.dataset.status === 'active',
        inactive = el.dataset.status === 'inactive';

      // sets item to active when it scrolls up and into position
      if (itemBounds.top <= triggerLine && !active && !inactive) {
        el.dataset.status = 'active';
      }
      // sets item to inactive when it scrolls up and out of window
      if (itemBounds.bottom <= triggerLine && active && !inactive) {
        el.dataset.status = 'inactive';
      }
      // sets item to active if it scrolls down and back into the window
      if (itemBounds.bottom >= triggerLine && !active && inactive) {
        el.dataset.status = 'active';
      }
      // sets item to none when it scrolls down and out of the window
      if (itemBounds.top >= triggerLine && active) {
        el.dataset.status = 'none';
      }
    });
  },
  handleSearchTerm: function () {
    var self = this;

    var query = window.location.search.substring(1) || false;
    if (query) {
      var searchBtn = document.querySelector('#search-btn a');
      searchBtn.href = '/search/?' + query;
      // self.handleHighlight();
    }
    return query;
  },
  handleHighlight: function () {
    var self = this;
    var query = self.getQueryVariable('search_term') || false;
    var cont = document.querySelector('.blog-entry-text');
    var hed = document.querySelector('.blog-headline');
    if (query) {
      self.highlightTerm(query, cont);
      self.highlightTerm(query, hed);
    }
    return self.getHighlightLocations() || false;
  },
  highlightTerm: function (text, element) {
    var self = this;
    text = text.split(' ').join('(\\W+|\s+)');
    var pattern = new RegExp('\\b' + text + '\\b', 'ig');

    element.childNodes.forEach(function (childNode) {
      if (childNode.childNodes.length) {
        childNode.parentNode.replaceChild(self.highlightTerm(text, childNode), childNode);
      } else if (childNode.nodeValue) {
        if (childNode.nodeValue.match(pattern)) {
          var frag = document.createDocumentFragment();
          var wrap = document.createElement('span');
          wrap.innerHTML = String(childNode.nodeValue).replace(pattern, function (match) {
            return '<span class="search-highlight">' + match + '</span>';
          });
          frag.appendChild(wrap);
          childNode.parentNode.replaceChild(frag, childNode);
        }
      }
    });
    return element;
  },
  getHighlightLocations: function () {
    var self = this;
    var highlights = document.querySelectorAll('.search-highlight');
    var nodes = Array.prototype.slice.call(highlights);
    return highlights;
  },
  handleClickerStatus: function (el, action, status) {
    var self = this;
    var clicker = document.querySelector('#highlight-clicker');

    // console.log('clicker status');

    // true = make it show up
    // false = hide it

    if (action === 'hide' && status) {
      el.classList.remove('hidden');
    } else if (action === "hide" && !status) {
      el.classList.add('hidden');
    }

    // true = make it active
    // false = remove active
    if (action === 'active' && status) {
      el.classList.add('active');
    } else if (action === "active" && !status) {
      el.classList.remove('active');
    }
  },
  intializeHighlight: function () {
    var self = this;

    var query = self.handleSearchTerm();

    if (query) {
      var highlights = self.handleHighlight();
    }
    if (highlights && highlights.length > 0) {
      var clicker = document.querySelector('#highlight-clicker');
      self.handleMessageTally(highlights);
      self.handleHighlightClick(highlights);
      self.handleClickerStatus(clicker, 'hide', true);
    }
  },
  handleHighlightClick: function (highlights) {
    var self = this;

    var clicker = document.querySelector('#highlight-clicker');

    if (self.getScrollPosition() > window.innerHeight) {
      self.handleClickerStatus(clicker, 'active', true);
    }
    clicker.addEventListener('click', function (e) {
      if (!clicker.classList.contains('active')) {
        self.handleClickerStatus(clicker, 'active', true);
      }
      if (e.target.id === 'highlight-clicker-down' || e.target.id === 'highlight-clicker-up') {
        self.incrementSearchCounter(e.target, highlights);
      }
      if (e.target.id === 'highlight-clicker-close') {
        self.handleClickerClose(highlights, clicker);
      }
    });
  },
  handleMessageTally: function (arr) {
    var self = this;
    var highlightCount = document.querySelector('#highlight-count');
    var messageTally = arr.length === 1 ?
      ' match found' :
      ' matches found'
    highlightCount.innerHTML = arr.length + messageTally;
  },
  clickCounter: undefined,
  incrementSearchCounter: function (el, arr) {
    var self = this;
    if (el.id === 'highlight-clicker-down') {
      var clickerUp = document.querySelector('#highlight-clicker-up');

      if (arr.length > 1 && !clickerUp.classList.contains('active')) {
        clickerUp.classList.add('active');
      }

      if (self.clickCounter !== undefined) {
        arr[self.clickCounter].classList.remove('active');
      }
      if (self.clickCounter < arr.length - 1) {
        self.clickCounter++;
      } else {
        self.clickCounter = 0;
      }
      self.handleHighlightScroll(arr, self.clickCounter);
    }
    if (el.id === 'highlight-clicker-up') {
      arr[self.clickCounter].classList.remove('active');
      if (self.clickCounter === 0) {
        self.clickCounter = (arr.length - 1);
      } else {
        self.clickCounter--;
      }
      self.handleHighlightScroll(arr, self.clickCounter);
    }
  },
  truncateURL: function () {
    var self = this;
    // console.log('truncate');
    var urlNew = window.location.href.split('?')[0];
    var obj = {
      url: urlNew,
      title: document.title
    };
    history.pushState(obj, obj.title, obj.url);
    return obj;
  },
  handleClickerClose: function (arr, el) {
    var self = this;
    self.handleClickerStatus(el, 'hide', false);
    arr.forEach(function (el) {
      el.classList.remove('search-highlight');
    });
    self.truncateURL();
    document.querySelector('#search-btn a').href = '/search';
  },
  handleHighlightScroll: function (highlights, counter) {
    var self = this;
    var currLoc = self.getScrollPosition();
    var highlightCount = document.querySelector('#highlight-count');
    var loc = self.getElemDistance(highlights[counter]);

    var foo = window.innerWidth < 450 ?
      window.innerHeight * 0.50 :
      window.innerHeight * 0.35;

    self.scrollToGeneric(loc - foo, 200, currLoc);

    highlights[counter].classList.add('active');

    highlightCount.innerHTML = (counter + 1) + ' of ' + highlights.length;
  },
  // functions that return data or change elements
  getElemDistance: function (elem) {
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
      style.forEach(function (el) {
        object.classList.add(el);
      });
    } else if (object.constructor === Array) {
      object.forEach(function (el) {
        el.classList.add(style);
      });
    } else {
      object.classList.add(style);
    }
  },
  removeShit: function (object, style) {
    if (style.constructor === Array) {
      style.forEach(function (el) {
        object.classList.remove(el);
      });
    } else {
      object.classList.remove(style);
    }
  },
  removeShitTimer: function (el, style, time) {
    var self = this;
    setTimeout(function () {
      self.removeShit(el, style);
    }, time);
  },
  scrollToGeneric: function (to, duration, start) {
    // slow scrolls to location send destination, duration of scroll and start point
    var self = this;
    var documentBody = document.body,
      html = document.getElementsByTagName('HTML')[0],
      scrollFunction = self.easeOutCubic,
      change = to - start,
      currentTime = 0,
      increment = 20;

    function animateScroll() {
      currentTime += increment;
      var val = scrollFunction(currentTime, change, duration, start);
      documentBody.scrollTop = val;
      html.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    }
    animateScroll();
  },
  easeOutCubic: function (currentTime, change, duration, start) {
    currentTime /= duration;
    currentTime--;
    return change * (currentTime * currentTime * currentTime + 1) + start;
  },
  expandMenu: function () {
    var self = this;
    var button = document.querySelector('#menu-button'),
      header = document.querySelector('#inside-header'),
      topNav = document.querySelector('#nav-menu'),
      active = topNav.classList.contains('nav-list--open');

    if (!active) {
      self.addShit(topNav, 'nav-list--open');
      self.addShit(button, 'nav-menu-button--active');
      self.addShit(header, 'menu-container--active');
      // self.handleHeadlineSwap(true) // boolean signals button press;
    }
    if (active) {
      self.removeShit(topNav, 'nav-list--open');
      self.addShit(topNav, 'nav-list--close');
      self.removeShit(button, 'nav-menu-button--active');
      self.removeShitTimer(header, 'menu-container--active', 500);
      self.removeShitTimer(topNav, 'nav-list--close', 500);
      self.handleHeadlineSwap(true); // boolean signals button press;
    }
  },
  handleDate: function () {
    document.querySelector('#current-year').innerHTML = new Date().getFullYear().toString();
  },
  getScrollPosition: function () {
    var sp = window.scrollY;
    return sp;
  },
  isElementVisible: function (elem) {
    var distance = elem.getBoundingClientRect();
    return (
      distance.top >= 0 &&
      distance.left >= 0 &&
      distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      distance.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
  promiseCheck: function () {
    var promiseSupport = false;
    try {
      var promiseFoo = new Promise(function (x, y) {});
      promiseSupport = true;
    } catch (e) {}
    return promiseSupport;
  },
  scrollDirection: function () {
    var self = this;
    var st = window.pageYOffset || document.documentElement.scrollTop;

    var dir = st > self.lastScrollTop ?
      true // downscroll
      :
      false; //upscroll
    self.lastScrollTop = st;
    return dir;
  },
  getQueryVariable: function (variable) {
    var self = this;

    var query = window.location.search.substring(1);
    var vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      // console.log('pair', pair[0]);
      if (pair[0] == variable) {
        return pair[1].replace(/%20/g, ' ');
      }
    }
    return (false);
  },
  lsTest: function () {
    try {
      localStorage.setItem("name", "Hello World!"); //saves to the database, "key", "value"
      localStorage.removeItem("name");
      return true;
    } catch (e) {
      return false;
    }
  },
  cleanPunctuation: function (term) {
    return term.replace(/[\'.,\/#!$%\^&\*;:{}=\-_`~()–’“”]/g, "").replace(/\s+$/g, "");
  },
};

// slideshow
(function(){
  const galleryWrapper = document.querySelector('.gallery-wrapper');
  const counter = document.querySelector('.gallery-count');
  const images = () => Array.from(document.querySelectorAll('.slide'));
  //finds the index of an element sent to it if the class matches
  const findI = (r, cl) => r.findIndex((el) => el.classList.contains(cl));
  const remove = (el, cl) => el.classList.remove(cl);
  const add = (el, cl) => el.classList.add(cl);
  const getSlide = (r, active) => r.filter((el, i) => i === active);
  const trans = (el) => document.querySelector('.gallery').addEventListener('transitionend', (e) => { remove(el, "move-out")} ); 

const advanceSlide = (curr, next) => {
  add(next, "center"),
  remove(curr, "center"),
  add(curr, "move-out"),
  trans(curr)
}
const slideCount = (slide) => counter.replaceChild(document.createTextNode(slide+1), counter.childNodes[0]);

const handleAction = (val) => {
    // Do something...
  const imgArr = images();
  // finds the slide with the class current
  const activeSlide = findI(imgArr, "center");  
  // gets dom object of current slide from array
  const [current] = getSlide(imgArr, activeSlide);     
  const [next] =  
    val === "advance" && activeSlide === imgArr.length - 1 ? imgArr.slice(0,1) 
    : val === "advance"? getSlide(imgArr, activeSlide + 1)
    : val === "back" && activeSlide === 0 ? imgArr.slice(-1)    
    : val === "back"? getSlide(imgArr, activeSlide - 1)
    : false;
    advanceSlide(current, next);
    slideCount(
    activeSlide + 1 === imgArr.length && val === "advance"? 0
    : activeSlide === 0 && val === "back"? imgArr.length - 1
    : val === "back"? activeSlide - 1
    :  activeSlide + 1
   )
};

 // Swipe Up / Down / Left / Right
 let initialX = null;
 let initialY = null;

const startTouch = (e) => {
   initialX = e.touches[0].clientX;
   initialY = e.touches[0].clientY;
 };

const moveTouch = (e) => {
  if (initialX === null) {
    return;
  }
  if (initialY === null) {
    return;
  }
  const dir = Math.abs(initialX - e.touches[0].clientX) > Math.abs(initialY - e.touches[0].clientY) && initialX - e.touches[0].clientX > 0 ? "advance": "back";

  handleAction(dir);
  initialX = null;
  initialY = null;
  e.preventDefault();
};

const clickMove = (e) => handleAction(e.target.value);

if (galleryWrapper) {
  galleryWrapper.addEventListener('touchstart', startTouch, false);
  galleryWrapper.addEventListener('touchmove', moveTouch, false);
  galleryWrapper.addEventListener("click", clickMove, false);
}

})();


 