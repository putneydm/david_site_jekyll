var searchFunctions = {
  initialize: function() {
    console.log('search works');
    var self=this;
    self.initializeListeners();
    self.firebaseInit();
    self.getData();
  },
  initializeListeners: function() {
    var self=this;
    var submitBtn = document.querySelector('#submit-search');


    submitBtn.addEventListener('click', function(e){
      console.log('click');
      self.getSearchFieldData();
    });
    submitSearchRetry.addEventListener('click', function(e) {
      self.handleLoadingScreen(true);
      self.handleLoadingError(false);
      self.getData();
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

  },
  stopWordsTest: function(term) {
    var self=this;

    var arr = term.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ');

    console.log(arr);

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
      console.log('got it');
      self.stopWords = data.stopWords;
      self.entries = data.entries;
    }),
    function(error) {
      console.log('failed');
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
  }
};
