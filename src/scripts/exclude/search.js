var searchFunctions = {
  initialize: function() {
    console.log('search works');
  initializeListeners: function() {
    var self=this;
    var submitBtn = document.querySelector('#submit-search');


    submitBtn.addEventListener('click', function(e){
      console.log('click');
      self.getSearchFieldData();
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
  firebaseInit: function() {
    var self=this;
    console.log('firebaseInit');
    self.myFirebaseRef = new Firebase("https://putneysearch.firebaseio.com/");
  },
  }
};
