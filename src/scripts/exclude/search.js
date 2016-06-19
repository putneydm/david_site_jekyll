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
  }
};
