var searchFunctions = {
  initialize: function() {
    console.log('search works');
    var self=this;
    self.handleLoadingScreen(true);
    self.initializeListeners();
    self.firebaseInit();
    self.getData();
    self.initResizeListener();
    self.windowWidth = document.documentElement.clientWidth;
  },
  initializeListeners: function() {
    var self=this;
    var searchField = document.querySelector('#search-field');
    var submitBtn = document.querySelector('#submit-search');
    var submitSearchRetry = document.querySelector('#submit-search-retry');
    var loaderIcon = document.querySelector('#loader-icon');
    var searchResults = document.querySelector('#search-results-wrapper');

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
    loaderIcon.addEventListener('animationiteration', function(e) {
      // console.log('bounce');
    });
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
    searchResults.addEventListener('click', function(e) {
      if(e.target) {
        if (e.target.nodeName === "P" || e.target.nodeName === "H2" || e.target.nodeName === "ARTICLE") {
        console.log(e.target.parentNode);
        // e.preventDefault();
      }
    }
    });
  },
  handleSearchReload: function() {
    var self=this;

    var retrievedObject = self.getQueryVariable('search_term');

    if (retrievedObject) {
      document.querySelector('#search-field').value = retrievedObject;
      var searchResultsArr = self.doSearch(retrievedObject);
      self.handleSearchResults(searchResultsArr, retrievedObject);
    }
  },
  getSearchFieldData: function() {
    var self=this;
    var searchInput = document.querySelector('#search-field').value;
    var stopWordsResult = self.stopWordsTest(searchInput);
    var containsWordChar = /\w+/gi.test(searchInput); // false means the items has no word characters in it
    var notWord = self.cleanPunctuation(searchInput).length < 1; // true means its one character
    var searchTerm = self.cleanPunctuation(searchInput); // true means its one character

    var exception = /a/i.test(searchTerm) || /i/i.test(searchTerm)

    // console.log('-------');
    // console.log('does the item have word characters', containsWordChar);
    // console.log('the item is not one character', notWord);
    // console.log(' is it free of stopwords', stopWordsResult);
    // console.log('is it an exception', exception);

    // for a search to happen:
    // does it have word characters: true
      // or
    // is it more than one character: true
      // or
    // is it free of stopwords: true

    // if (clean && notWord && stopWordsResult) {
    //   console.log('search');
    // } else {
    //   console.log('error');
    // }

    // var errorMessage;


    // var errorMessage = "this is an error"

    if (!containsWordChar) {
      var errorMessage = 'C\'mon. That isn\'t even a word!'
    }
    if (!errorMessage && searchTerm.length === 1) {
      var errorMessage = 'C\'mon. That isn\'t even a word!';
    }
    if (!errorMessage && !stopWordsResult) {
      var errorMessage = 'Whoops! Try narrowing down your search term a bit.';
    }
    if (!errorMessage) {
      var errorMessage = 'Yeah, that search term doesn\'t really work for us.';
    }
    //  stopwords result false = bad, true = good
    if (stopWordsResult && containsWordChar && searchTerm.length > 2) {
      var searchResultsArr = self.doSearch(searchInput);
      self.handleSearchResults(searchResultsArr, searchInput);
    }
    else {
      self.displaySearchError(true, errorMessage);
    }
  },
  doSearch: function(searchTerm) {
    var self=this;

    var regexp = new RegExp('\\b' + self.cleanPunctuation(searchTerm) + '\\b', 'gi');
    var resultsArr = [];

    console.log('regexp', regexp);

    self.entries.map(function(el, i) {
      var matchPost = self.cleanPunctuation(el.post).match(regexp);
      var matchTitle = self.cleanPunctuation(el.title).match(regexp);

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
  doSearchToo: function(searchTerm) {
    var self=this;

    var termArr =self.cleanPunctuation(searchTerm).split(' ');

    var termArrClean = termArr.filter(function(el) {
      return self.stopWordsTest(el);
    });

    // loops through each entry and send it to the words test function
    self.entries.forEach(function(el, i) {
    var arr = wordsTest(el.post);
      if (arr !== undefined) {
        // console.log(arr);
      }
    });

    // loops through each word in the search term to see if it has a match in the entry. returns array of terms that match and their index.
    function wordsTest(entry) {
      matchArr = [];
      var matchList = termArrClean.map(function(el, i) {
        var matchItem = entry.match(el);
        if (matchItem) {

          // console.log(matchItem.index);

          var myItem = new Object();
            myItem.term = matchItem[0];
            myItem.index = matchItem.index;

            // needs a prcximity test to see if words are near each other before object is pushed to the array.

          matchArr.push(myItem)
        }
      });
      if (matchArr.length > 1) {
        proximity(matchArr)
        return matchArr;
      }
      // returns {'term' : 'xxxx', index: XX}
    }


    function proximity(arr) {
      var fooBar = arr.filter(function(el, i) {

        if (arr[i + 1]) {
          var foo = (arr[i+1].index - el.index);

          if (foo > 0 && foo < 15) {
            return el;
          } else {
            return false;
            console.log('false');
          }
        }
      });

        console.log(fooBar);

    }

  },
  handleSearchResults: function(resultsArr, searchTerm) {
    var self=this;

    var searchContainer = document.querySelector('#search-results-wrapper');

    searchContainer.innerHTML = '';

    var entrySearch = document.createElement('H1');
    entrySearch.classList.add('search-results-header');

    resultsArr.length === 1
      ? entrySearch.innerHTML = resultsArr.length + '&nbsp;result for “' + searchTerm + '”'
      : entrySearch.innerHTML = resultsArr.length + '&nbsp;results for “' + searchTerm + '”';

    var textLength = 100;
    self.windowWidth > 700
      ? textLength = 100
      : textLength = 50;

    searchContainer.appendChild(entrySearch);

    resultsArr.forEach(function(el) {
      var foo = self.entries[el.index].title;
      var bar = self.entries[el.index].post.split(' ').slice(0, textLength).join(' ');


      var entryLink = document.createElement('A');
      entryLink.href= self.entries[el.index].link + '?type=search_result';

      var moreLink = document.createElement('A');
      // moreLink.href= self.entries[el.index].link + '?type=search_result';
      // moreLink.innerHTML = 'more';
      // moreLink.classList.add('search-results-link');


      var entryContainer = document.createElement('ARTICLE');
      entryContainer.classList.add('search-results-entry');
      var entryHeadline = document.createElement('H2');
      entryHeadline.classList.add('blog-headline');

      var entryBodyContainer = document.createElement('DIV');
      var entryBody = document.createElement('P');
      // entryBodyContainer.classList.add('blog-entry-text');
      entryBodyContainer.appendChild(entryBody);

      var entryMatches = document.createElement('P');
      entryMatches.classList.add('blog-entry-date');
      entryHeadline.innerHTML = foo;
      entryBody.innerHTML = bar + '&nbsp;&#133;';

      entryMatches.innerHTML = el.count === 1
        ? el.count + ' occurance found'
        : el.count + ' occurances found';

      entryContainer.appendChild(entryHeadline);
      entryContainer.appendChild(entryMatches);
      entryContainer.appendChild(entryBodyContainer);

      entryLink.appendChild(entryContainer);

      searchContainer.appendChild(entryLink);

    });
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
    var p = self.firebaseGet('users/05db3ef7-a40d-4a16-9153-aa4f6bf8d25b');
    p.then(function(data) {
      self.stopWords = data.stopWords;
      self.entries = data.entries;
      self.searchActive(true);
      self.handleLoadingError(false);
    }),
    function(error) {
      self.handleLoadingError(true);
    };
  },
  searchActive: function(state) {
    var self=this;

    var submitBtn = document.querySelector('#submit-search');
    var searchField = document.querySelector('#search-field');
    var errorOverlay = document.querySelector('#error-overlay');
    var loader = document.querySelector('#loader');

    state
    ? (
      // submitBtn.disabled = false,
      searchField.disabled = false,
      self.handleLoadingScreen(false)
    )
    : errorOverlay.classList.add('error-overlay--active');
  },
  searchTest: function() {
    var self=this;

    console.log(self.fooBar);

    var searchTerm = 'man this is a thing here';

    var foo = searchTerm.match(/this is a t+\s\b/gi);

    console.log(foo);


  },
  handleLoadingScreen: function(state) {
    var self=this;
    var loader = document.querySelector('#loader');
    var loaderIcon = document.querySelector('#loader-icon');
    var loaderShadow = document.querySelector('#loader-shadow');

    state
      ? (
        play(),
        loader.classList.add('error-overlay--active')
      )
      : (
        loader.addEventListener('transitionend', pause),
        loader.classList.remove('error-overlay--active')
      );

    function pause() {
      console.log('pause');
      loaderIcon.classList.add('paused');
      loaderShadow.classList.add('paused');
      setTimeout(function(){
        // console.log('timeout');
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
    var errorField = document.querySelector('#search-field-error');
    var searchField = document.querySelector('#search-field');

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
    if (state) {
      errorOverlay.classList.add('error-overlay--active');
      self.handleLoadingScreen(false);
    }
    if (!state) {
      errorOverlay.classList.remove('error-overlay--active');
    }
  },
  firebaseInit: function() {
    var self=this;
    console.log('firebaseInit');
    self.myFirebaseRef = new Firebase("https://putneysearch.firebaseio.com/");
  },
  firebaseGet: function(child) {
    var self=this;
    // Get a database reference to our posts
    var ref = self.myFirebaseRef.child(child);
    var p = new Promise (function(resolve, reject) {
    ref.on("value", function(snapshot) {
      resolve(snapshot.val())
      }, function (errorObject) {
        reject("The read failed: " + errorObject.code)
      });
    });
    return p;
  },
  setSessionStorage: function(arr) {
    var self=this;
    sessionStorage.setItem('searchResusltsArr', JSON.stringify(arr));
    var obj = JSON.parse(sessionStorage.getItem('searchResusltsArr'));

    // console.log('obj', obj);

  },
  sleep: function(time) {
    // return new Promise((resolve) => setTimeout(resolve, time));
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

    var rando = Math.random() * (3 - 1) + 1;
    var state = rando < 2;
    console.log('n', rando, state);

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

     var query = window.location.search.substring(1);
     var vars = query.split("&");

     for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){return pair[1].replace(/%20/g, ' ');}
     }
     return(false);
  },
  fooBar: [
        {
          "title": "this is a headline", "post": "this is a post"
        },
        {
          "title_too": "this is a headline too", "post": "this is a post too"
        }
      ]
};
