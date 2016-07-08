var searchFunctions = {
  initialize: function() {
    console.log('search works');
    var self=this;
    self.handleLoadingScreen(true);
    self.initializeListeners();
    self.firebaseInit();
    self.getData();
    // this replaces getData
    // fakes a data load
    // self.loadingTest();
  },
  initializeListeners: function() {
    var self=this;
    var submitBtn = document.querySelector('#submit-search');


    submitBtn.addEventListener('click', function(e){
      self.getSearchFieldData();
    });
    submitSearchRetry.addEventListener('click', function(e) {
      self.handleLoadingScreen(true);
      self.getData();
      // fakes a data load or error for testing
      // self.loadingTest();

    });
    loaderIcon.addEventListener('animationiteration', function(e) {
      console.log('bounce');
    });
  },
  getSearchFieldData: function() {
    var self=this;
    var searchInput = document.querySelector('#search-field').value;
    var foo = self.stopWordsTest(searchInput);
    console.log('stopwords results', foo);
    //  false = bad, true = good
    if (foo === true) {
      // self.doSearch(searchInput);
      var foo = self.doSearch(searchInput);
      console.log('foo test', foo);
      self.handleSearchResults(foo, searchInput);

    }
  },
  doSearch: function(searchTerm) {
    var self=this;

    var regexp = new RegExp(self.cleanPunctuation(searchTerm), 'gi');
    var resultsArr = [];

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
  handleSearchResults: function(resultsArr, searchTerm) {
    var self=this;

    var searchContainer = document.querySelector('#search-results-wrapper');

    searchContainer.innerHTML = '';

    var entrySearch = document.createElement('H1');
    entrySearch.classList.add('search-results-header');

    resultsArr.length === 1
      ? entrySearch.innerHTML = resultsArr.length + '&nbsp;result for “' + searchTerm + '”'
      : entrySearch.innerHTML = resultsArr.length + '&nbsp;results for “' + searchTerm + '”';

    searchContainer.appendChild(entrySearch);

    resultsArr.forEach(function(el) {
      var foo = self.entries[el.index].title;
      var bar = self.entries[el.index].post.split(' ').slice(0, 100).join(' ');


      var entryLink = document.createElement('A');
      entryLink.href= self.entries[el.index].link;

      var entryContainer = document.createElement('ARTICLE');
      entryContainer.classList.add('search-results-entry');
      var entryHeadline = document.createElement('H2');
      entryHeadline.classList.add('blog-headline');



      var entryBodyContainer = document.createElement('DIV');
      var entryBody = document.createElement('P');
      entryBodyContainer.classList.add('blog-entry-text');
      entryBodyContainer.appendChild(entryBody);


      var entryMatches = document.createElement('P');
      entryMatches.classList.add('blog-entry-date');
      entryHeadline.innerHTML = foo;
      entryBody.innerHTML = bar;

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
      console.log('failed');
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
      submitBtn.disabled = false,
      searchField.disabled = false,
      self.handleLoadingScreen(false)
    )
    : errorOverlay.classList.add('error-overlay--active');
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
        console.log('timeout');
        loader.removeEventListener('transitionend', pause);
      }, 100);
    }
    function play() {
      loaderIcon.classList.remove('paused');
      loaderShadow.classList.remove('paused');
    }
  },
  handleLoadingError: function(state) {
    var self=this;
    var errorOverlay = document.querySelector('#error-overlay');

    console.log('state', state);
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
  fooBar: [
        {
          "title": "this is a headline", "post": "this is a post"
        },
        {
          "title_too": "this is a headline too", "post": "this is a post too"
        }
      ]
};
