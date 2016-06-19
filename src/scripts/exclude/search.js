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
  }
};
