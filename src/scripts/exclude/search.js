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
  }
};
