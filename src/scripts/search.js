var searchFunctions = {
  initialize: function() {
    var self=this;
    self.initializeListeners();
    console.log('search');

    self.loadSiteData();
    self.loadStopWords();
    self.firebaseInit();

    self.checkLogin();

  },
  initializeListeners: function() {
    var self=this;
    console.log('listen');
    var jsonButton = document.querySelector('#json');
    jsonButton.addEventListener('click', function(e) {

      self.firebaseSet(self.siteData, 'users/' + self.uid + '/entries');
      self.firebaseSet(self.stopWords, 'users/' + self.uid + '/stopwords');
    });
    var getButton = document.querySelector("#get");
    getButton.addEventListener('click', function(e) {
      var p = self.firebaseGet('entries');
      p.then(function(data) {
        console.log('got it');
      }),
      function(error) {
        console.log('failed');
      };

      var s = self.firebaseGet('stopWords');
      s.then(function(data) {
        console.log('got stopwords');
      }),
      function(error) {
        console.log('failed');
      }
    });
  },
  loadSiteData: function() {
    var self=this;

    var p = self.getJSON('/site-feed.json');
    p.then(function(data) {
      self.siteData = data;
    });
  },
  loadStopWords: function() {
    var self=this;

    var s = self.getJSON('/stopwords.json');
    s.then(function(data) {
      self.stopWords = data;
    });
  },
  firebaseInit: function() {
    var self=this;
    self.myFirebaseRef = new Firebase("https://putneysearch.firebaseio.com/");
  },
  firebaseSet: function(dataSet, child) {
    var self=this;

    var entries = self.myFirebaseRef.child(child);

    entries.set( dataSet,
    function (error) {
      if (error) {
        console.log('error');
      } else {
        console.log('saved');
      }
    });
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
  getJSON: function(url) {
    var self=this;

    var p = new Promise (function(resolve, reject) {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", url);
      xmlhttp.send();
      xmlhttp.onload = function() {
        xmlhttp.readyState == 4 && xmlhttp.status == 200
        ? resolve(JSON.parse(xmlhttp.responseText))
        : reject('fail');
      };
    });
    return p;
  checkLogin: function() {
    var self=this;
    self.myFirebaseRef.onAuth(function(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        self.uid = authData.uid;
        self.handleLoginDisplay(true)
      } else {
        console.log("User is logged out");
        self.handleLoginDisplay(false)
      }
    });
  },
  }
};
