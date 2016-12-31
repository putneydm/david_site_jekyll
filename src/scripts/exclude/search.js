var searchFunctions = {
  initialize: function() {
    console.log('search works');
    var self=this;
    self.windowWidth = document.documentElement.clientWidth;
    self.getElements();
    self.initializeListeners();
    self.dataTest();
    self.displaySearchHistory();
    self.initResizeListener();
    self.handleSearchHistory();
  },
  getElements: function() {
    var self=this;

    self.sessionAvail = pageFunctions.lsTest();
    self.search = document.querySelector('#search-results');
    self.searchWrapper = document.querySelector('#search-results-wrapper');
    self.searchField = document.querySelector('#search-field');
  },
  initializeListeners: function() {
    var self=this;
    var searchField = document.querySelector('#search-field'),
        submitBtn = document.querySelector('#submit-search'),
        submitSearchRetry = document.querySelector('#submit-search-retry'),
        searchResults = document.querySelector('#search-results-wrapper'),
        clearSearch = document.querySelector('#clear-search'),
        searchContainer = document.querySelector('#search-results-wrapper');

    submitBtn.addEventListener('click', function(e){
      self.getSearchFieldData();
      e.preventDefault();
    });
    submitSearchRetry.addEventListener('click', function(e) {
      self.handleLoadingScreen(true);
      self.getData();
      // fakes a data load or error for testing
      // self.loadingTest();
    });
    // loaderIcon.addEventListener('animationiteration', function(e) {
    //   // console.log('bounce');
    // });
    searchField.addEventListener('keyup', function(e) {
      var errorState = searchField.classList.contains('form-field--error');

      if (errorState && e.keyCode != 13) {
        self.displaySearchError(false);
      }
      if (!errorState && searchField.value.length >= 1) {
        submitBtn.disabled = false;
      }
      if (searchField.value.length == 0) {
        submitBtn.disabled = true;
      }
    });
    searchField.addEventListener('click', function(e) {
      var errorState = searchField.classList.contains('form-field--error');
        if (errorState && searchField.value !== '') {
          self.displaySearchError(false);
        }
        if (searchField.value.length == 0) {
          submitBtn.disabled = true;
        }
      });
    searchField.addEventListener('blur', function(e) {
      if (searchField.value.length == 0) {
        submitBtn.disabled = true;
      }
    });
    clearSearch.addEventListener('click', function(e) {
      self.clearSearchHistory();
    });
  },
  dataTest: function() {
    var self=this;

    var entries = sessionStorage.entries || false,
        stopWords = sessionStorage.stopWords || false;

    entries && stopWords
    ? (
      self.handleLoadingScreen(false),
      self.stopWords = JSON.parse(sessionStorage.stopWords),
      self.entries = JSON.parse(sessionStorage.entries),
      self.searchActive(true),
      self.handleLoadingError(false)
    )
    : (
      self.firebaseInit(),
      self.handleLoadingScreen(true),
      // self.loadingTest() // turn this on, and you'll get a fake firebase load that randomly fails
      self.getData()
    );
  },
  handleSearchReload: function() {
    var self=this;

    var searchContainer = document.querySelector('#search-results-wrapper');

    var retrievedObject = self.getQueryVariable('search_term');
    if (retrievedObject) {
      document.querySelector('#search-field').value = retrievedObject;
      var searchResultsArr = self.doSearch(retrievedObject);
      self.handleSearchResults(searchResultsArr, retrievedObject);
      // searchContainer.classList.add('active');
      self.handleResultsTransition();
    }
  },
  handleURLChange: function(searchTerm) {
    var self=this;

    var obj = self.setPageURL(searchTerm);
    history.pushState(obj, obj.title, obj.url);
  },
  setPageURL: function(searchTerm) {
    var self = this;

    var pageURL = window.location.href.split("?")[0],
        searchURL = self.cleanPunctuation(searchTerm).replace(/\s/g, '%20'),
        newUrl = pageURL +  "?type=search_result&search_term=" + searchURL;

    return { title: 'Search results | ' + searchTerm + ' | Davidputney.com', url: newUrl };
  },
  getSearchFieldData: function() {
    var self=this;

    var searchInput = document.querySelector('#search-field').value,
        searchTerm = self.cleanPunctuation(searchInput),
        stopWordsResult = self.stopWordsTest(searchInput), // false means there has been a stopwords match
        containsWordChar = /\w+/gi.test(searchInput), // false means the items has no word characters in it
        notWord = searchTerm.length <= 1; // true means its one character

    var exception = /a/i.test(searchTerm) || /i/i.test(searchTerm)
    if (!containsWordChar || notWord) {
      var errorMessage = 'C\'mon. That isn\'t even a word!'
    }
    if (!errorMessage && !stopWordsResult) {
      var errorMessage = 'Whoops! Try narrowing down your search term a bit.';
    }
    if (!errorMessage) {
      var errorMessage = 'Yeah, that search term doesn\'t really work for us.';
    }
    //  stopwords result false = bad, true = good
    if (stopWordsResult && containsWordChar && !notWord) {
      var searchResultsArr = self.doSearch(searchInput);
      self.handleSearchResults(searchResultsArr, searchInput);
      self.saveSearchHistory(searchInput);
      self.displaySearchHistory();
      self.handleURLChange(searchInput);
    }
    else {
      self.displaySearchError(true, errorMessage);
    }
  },
  doSearch: function(searchTerm) {
    var self=this;
    var regexp = new RegExp('\\b' + self.cleanPunctuation(searchTerm) + '\\b', 'gi'),
        resultsArr = [];

    self.entries.map(function(el, i) {
      var matchPost = self.cleanPunctuation(el.post).match(regexp),
          matchTitle = self.cleanPunctuation(el.title).match(regexp);

      matchPost != null && matchTitle != null ?
      resultsArr.push({"count" : matchPost.length + matchTitle.length,  "index": i})
      : matchPost == null && matchTitle != null ? resultsArr.push({"count" : matchTitle.length,  "index": i})
      : matchPost != null && matchTitle == null ? resultsArr.push({"count" : matchPost.length,  "index": i})
      : 0 // do nothing
    });

    var resultsArrSort = resultsArr.sort(function(a, b) {
        return b.count - a.count;
    });
    return resultsArrSort;
  },
  saveSearchHistory: function(searchTerm) {
    var self=this;
    searchTerm = self.cleanPunctuation(searchTerm);
    var searchArr = sessionStorage.searches
      ? JSON.parse(sessionStorage.searches)
      : [];

      if (self.sessionAvail) {
        searchArr.unshift(searchTerm);
        searchArr = searchArr.slice(0,10);
        searchArr = JSON.stringify(searchArr);
        sessionStorage.searches = searchArr;
      }
  },
  getSearchHistory:function() {
    var self=this;

    var arr = sessionStorage.searches
      ? JSON.parse(sessionStorage.searches)
      : [];
    return arr;
  },
  clearSearchHistory: function() {
    var self=this;
    sessionStorage.removeItem('searches');
    self.displaySearchHistory();
  },
  displaySearchHistory: function() {
    var self=this;
    var historyList = document.querySelector('#search-history'),
        arr = self.getSearchHistory(),
        clear = document.querySelector('#clear-search'),
        wrapper = document.querySelector('#search-history-wrapper');

    historyList.innerHTML = '';

    if (arr.length > 0) {
      arr.forEach(function(el) {
        console.log('for each');
        var linkURL = self.setPageURL(el);
        var link = document.createElement('A');
        link.href = linkURL.url;

        var list = document.createElement('LI');
        link.innerHTML = el;
        list .dataset.term = el;
        list.appendChild(link);
        historyList.appendChild(list);
      });
      clear.classList.add('active');
      wrapper.classList.remove('hide');
    } else {
      clear.classList.remove('active');
    }
  },
  handleSearchHistory:function() {
    var self=this;

    var history = document.querySelector('#search-history-wrapper');
    // var searchField = document.querySelector('#search-field');

    history.addEventListener('click', function(e) {
      e.preventDefault();
      var clickTarget = e.target.parentNode;
      if (clickTarget.nodeName === 'LI') {
        var searchInput = clickTarget.dataset.term;
        var searchResultsArr = self.doSearch(searchInput);
        self.handleSearchResults(searchResultsArr, searchInput);
        // self.saveSearchHistory(searchInput);
        self.displaySearchHistory();
        self.handleURLChange(searchInput);
        self.searchField.value = searchInput;
      }
    });
  },
  handleSearchResults: function(resultsArr, searchTerm) {
    var self=this;

    var searchTerm =  self.cleanPunctuation(searchTerm);
    // var search = document.querySelector('#search-results');
    // var searchWrapper = document.querySelector('#search-results-wrapper');

    self.searchWrapper.innerHTML = '';
    self.handleResultsTransition(true);
    self.handleSearchHed(resultsArr, searchTerm);

    var textLength = 100;
    self.windowWidth > 700
      ? textLength = 100
      : textLength = 50;

    resultsArr.forEach(function(el) {
      var hedText = self.entries[el.index].title,
          bodyText = self.entries[el.index].post.split(' ').slice(0, textLength).join(' '),
          entryLink = document.createElement('A');

      var moreLink = document.createElement('A'),
          entryContainer = document.createElement('ARTICLE'),
          entryHeadline = document.createElement('H2'),
          entryBodyContainer = document.createElement('DIV'),
          entryBody = document.createElement('P'),
          entryMatches = document.createElement('P');

      entryLink.href = self.entries[el.index].link + '?type=search_result&search_term=' +  searchTerm;

      entryContainer.classList.add('search-results-entry');
      entryHeadline.classList.add('blog-headline');
      entryMatches.classList.add('blog-entry-date');

      entryHeadline.innerHTML = hedText;
      entryBody.innerHTML = bodyText + '&nbsp;&#133;';

      entryMatches.innerHTML = el.count === 1
        ? el.count + ' occurance found'
        : el.count + ' occurances found';

      entryBodyContainer.appendChild(entryBody);
      entryContainer.appendChild(entryHeadline);
      entryContainer.appendChild(entryMatches);
      entryContainer.appendChild(entryBodyContainer);
      entryLink.appendChild(entryContainer);
      self.searchWrapper.appendChild(entryLink);
    });
  },
  handleSearchHed: function(resultsArr, searchTerm) {
    var self=this;
    var searchHed = document.querySelector('.search-results-header') || false;
    // var search = document.querySelector('#search-results');
    // var searchWrapper = document.querySelector('#search-results-wrapper');
    self.searchWrapper.innerHTML = '';

    var resultsMessage = resultsArr.length === 1
          ? resultsArr.length + '&nbsp;result for “' + searchTerm + '”'
          : resultsArr.length + '&nbsp;results for “' + searchTerm + '”';

    if (searchHed) {
      searchHed.innerHTML = resultsMessage;
    } else {
      var entrySearch = document.createElement('H1');
      entrySearch.classList.add('search-results-header');
      entrySearch.innerHTML = resultsMessage;
      self.search.insertBefore(entrySearch, self.searchWrapper);
    }
  },
  handleResultsTransition: function(state) {
    var self=this;

    var el = document.querySelector('#search-results-wrapper'),
        active = el.classList.contains('active');

    if (state || active) {
      el.classList.remove('active');
      var p = self.sleep(10)
      .then(function() {
          el.classList.add('active');
      });
    }
  },
  stopWordsTest: function(term) {
    var self=this;
    var arr = term.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ');

    function testWords(matchTerm) {
      var match = self.stopWords.some(function(el) {
        return el === matchTerm;
      });
      return match;
    }
    var stopWordsMatch = arr.some(function(el){
        return el !== '' && testWords(el) === false;
    });
    return stopWordsMatch;
  },
  getData: function() {
    var self=this;
    console.log('get data');
    var p = self.firebaseGet('users/05db3ef7-a40d-4a16-9153-aa4f6bf8d25b', self.myFirebaseRef);
    p.then(function(data) {
      self.stopWords = data.stopWords;
      self.entries = data.entries;

      if (self.sessionAvail) {
        sessionStorage.setItem('entries', JSON.stringify(data.entries));
        sessionStorage.setItem('stopWords', JSON.stringify(data.stopWords));
      }
      self.searchActive(true);
      self.handleLoadingError(false);
    }),
    function(error) {
      self.handleLoadingError(true);
    };
  },
  searchActive: function(state) {
    var self=this;

    var submitBtn = document.querySelector('#submit-search'),
        searchField = document.querySelector('#search-field'),
        errorOverlay = document.querySelector('#error-overlay'),
        loader = document.querySelector('#loader');

    state
    ? (
      searchField.disabled = false,
      self.handleLoadingScreen(false),
      self.handleSearchReload()
    )
    : errorOverlay.classList.add('error-overlay--active');
  },
  handleLoadingScreen: function(state) {
    var self=this;
    var loader = document.querySelector('#loader'),
        loaderIcon = document.querySelector('#loader-icon'),
        loaderShadow = document.querySelector('#loader-shadow');

    state
      ? (
        play(),
        loader.classList.add('error-overlay--active')
      )
      : (
        handleScreen(loader)
      );

    function handleScreen(loader) {
      setTimeout(function(){
        loader.addEventListener('transitionend', pause);
        loader.classList.remove('error-overlay--active');
      }, 2000);
    }

    function pause() {
      console.log('pause');
      loaderIcon.classList.add('paused');
      loaderShadow.classList.add('paused');
      setTimeout(function(){
        loader.removeEventListener('transitionend', pause);
      }, 100);
    }
    function play() {
      loaderIcon.classList.remove('paused');
      loaderShadow.classList.remove('paused');
    }
  },
  displaySearchError: function(state, error) {
    var self=this;
    var errorField = document.querySelector('#search-field-error'),
        searchField = document.querySelector('#search-field');

    state
    ?
      (
      searchField.classList.add('form-field--error'),
      errorField.innerHTML = error
      )
    : (
      searchField.classList.remove('form-field--error'),
      errorField.innerHTML = ''
    );
  },
  handleLoadingError: function(state) {
    var self=this;
    var errorOverlay = document.querySelector('#error-overlay');

    state
      ? (
        errorOverlay.classList.add('error-overlay--active'),
        self.handleLoadingScreen(false)
      )
      : errorOverlay.classList.remove('error-overlay--active');
  },
  firebaseInit: function() {
    var self=this;
    console.log('firebaseInit');
    self.myFirebaseRef = new Firebase("https://putneysearch.firebaseio.com/");
  },
  firebaseGet: function(child, db) {
    var self=this;
    // Get a database reference to our posts
    var ref = db.child(child);
    var p = new Promise (function(resolve, reject) {
    ref.on("value", function(snapshot) {
      resolve(snapshot.val())
      }, function (errorObject) {
        reject("The read failed: " + errorObject.code)
      });
    });
    return p;
  },
  sleep: function(time) {
    var p = new Promise (function(resolve) {
      setTimeout(function(){
        resolve(time)
      }, time);
    });
    return p;
  },
  cleanPunctuation: function(term) {
    return term.replace(/[\'.,\/#!$%\^&\*;:{}=\-_`~()–’“”]/g,"").replace(/\s+$/g,"");
  },
  loadingTest: function() {
    var self=this;

    var rando = Math.random() * (3 - 1) + 1,
        state = rando < 2;

    self.sleep(3000).then(function(time) {
      rando < 2
      ?(
        self.searchActive(true),
        self.handleLoadingError(false),
        console.log(state, 'fake loaded')
      )
      :(
        self.handleLoadingError(true),
        console.log(state, 'fake failed')
      )
    })
  },
  initResizeListener: function(){
    var self=this;
    window.onresize = function(e) {
      self.windowWidth = document.documentElement.clientWidth;
    }
  },
  getQueryVariable: function(variable) {
    var self=this;

     var query = window.location.search.substring(1),
         vars = query.split("&");

     for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){return pair[1].replace(/%20/g, ' ');}
     }
     return(false);
  },
};
