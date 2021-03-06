var searchAdminFunctions = {
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
    var jsonButton = document.querySelector('#json'),
        getButton = document.querySelector("#get"),
        login = document.querySelector('#login'),
        logout = document.querySelector('#logout'),
        loggedOut = document.querySelector('#loggedout-screen'),
        loggedIn = document.querySelector('#loggedin-screen'),
        loginWrapper = document.querySelector('#login-wrapper'),
        usernameField = document.querySelector('#username'),
        passwordField = document.querySelector('#password');

    jsonButton.addEventListener('click', function(e) {
      self.firebaseSet(self.siteData, 'users/' + self.uid + '/entries');
      self.firebaseSet(self.stopWords, 'users/' + self.uid + '/stopWords');
    });
    getButton.addEventListener('click', function(e) {
      var p = self.firebaseGet('users/' + self.uid + '/entries');
      p.then(function(data) {
        console.log('got it');
      }),
      function(error) {
        console.log('failed');
      };
      var s = self.firebaseGet('users/' + self.uid + '/stopWords');
      s.then(function(data) {
        console.log('got stopwords');
      }),
      function(error) {
        console.log('failed');
      };
    });
    login.addEventListener('click', function() {
      self.login();
    });
    logout.addEventListener('click', function() {
      self.logout();
    });
    self.intializeAnimationListener(loggedOut);
    self.intializeAnimationListener(loggedIn);
    loginWrapper.addEventListener('click', function(e) {
      if (e.target &&e.target.classList.contains('form-field')) {
        e.target.classList.add('form-field-validate');
      }
    });
    loginWrapper.addEventListener('focusout', function(e) {
      if (e.target &&e.target.classList.contains('form-field')) {
        self.handleError(e.target, e.target.validity.valid);
      }
    });
    loginWrapper.addEventListener('keydown', function(e) {
      var keyPress=e.keyCode
        ? event.keyCode
        : event.charCode;
        if (keyPress === 13) {
          self.handleError(usernameField, usernameField.validity.valid);
          self.handleError(passwordField, passwordField.validity.valid);
        }
    });
  },
  handleError: function(el, valid, sysError) {
    var self=this;
    var errorContainer = el.parentNode.querySelector('.login-error-message'),
        target = el.id;

    var errorMessage = !sysError && target === 'username'
      ? 'Please enter a valid e mail address.' :
      !sysError && target === 'password' ? 'Please enter a password with six characters or more.'
      : String(sysError).replace(/Error:\s/g, '');

    valid
      ?(
        errorContainer.innerHTML = ' ',
        errorContainer.classList.remove('login-error-message--active'),
        el.classList.remove('form-field--error')
      ):
        errorContainer.classList.add('login-error-message--active'),
        errorContainer.innerHTML = errorMessage,
        el.classList.add('form-field--error'
      );
  },
  intializeAnimationListener: function(el) {
    el.addEventListener('animationend', function() {
    var slideOut = el.classList.contains('log-screen--out'),
        slideIn = el.classList.contains('log-screen--in'),
        shake = el.classList.contains('log-screen--shake');

      if (shake) {
        el.classList.remove('log-screen--shake');
      }
      if (slideOut) {
        el.classList.add('log-screen--disabled');
        el.classList.remove('log-screen--out');
      }
      if (slideIn) {
        el.classList.add('log-screen--active');
        el.classList.remove('log-screen--in');
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
      error
      ? console.log('error')
      : console.log('saved');
    });
  },
  firebaseGet: function(child) {
    var self=this;
    // Get a database reference to our posts
    var ref = self.myFirebaseRef.child(child);
    var p = new Promise (function(resolve, reject) {
    ref.on("value", function(snapshot) {
      resolve(snapshot.val());
      }, function (errorObject) {
        reject("The read failed: " + errorObject.code);
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
        ?resolve(JSON.parse(xmlhttp.responseText))
        :reject('fail');
      };
    });
    return p;
  },
  login: function() {
    var self=this;
    var ref = self.myFirebaseRef;
    function authHandler(error, authData) {
      error
      ? self.handleLoginDisplay(false, error)
      :(
        self.uid = authData.uid,
        self.handleLoginAnimations(true)
      );
    }
    var login = document.querySelector('#username').value,
        pwd = document.querySelector('#password').value;

    ref.authWithPassword({
      email: login,
      password: pwd
    }, authHandler);
    // puts me into database
    var isNewUser = false;
    ref.onAuth(function(authData) {
      if (authData && isNewUser) {
        // save the user's profile into the database so we can list users,
        // use them in Security and Firebase Rules, and show profiles
        ref.child("users").child(authData.uid).set({
          provider: authData.provider,
          name: getName(authData)
        });
      }
    });
    // find a suitable name based on the meta info given by each provider
    function getName(authData) {
      switch(authData.provider) {
         case 'password':
           return authData.password.email.replace(/@.*/, '');
         case 'twitter':
           return authData.twitter.displayName;
         case 'facebook':
           return authData.facebook.displayName;
      }
    }
  },
  logout: function() {
    var self=this;
    var ref = self.myFirebaseRef;
    self.myFirebaseRef.unauth(function(error) {
      error
      ? self.handleLoginAnimations(true, error)
      : self.handleLoginAnimations(false);
    });
  },
  checkLogin: function() {
    var self=this;
    var authData = self.myFirebaseRef.getAuth();
      authData
      ?(
      self.uid = authData.uid,
      self.handleLoginDisplay(true)
      )
      :self.handleLoginDisplay(false);
  },
  handleLoginDisplay: function(loggedIn, error) {
    var self=this;
    var loggedInScreen = document.querySelector('#loggedin-screen'),
        loggedOutScreen = document.querySelector('#loggedout-screen');
    loggedIn
      ? (
      loggedOutScreen.classList.add('log-screen--disabled'),
      loggedInScreen.classList.remove('log-screen--disabled'),
      loggedInScreen.classList.add('log-screen--active')
      ) : (
      loggedInScreen.classList.add('log-screen--disabled'),
      loggedOutScreen.classList.remove('log-screen--disabled'),
      loggedOutScreen.classList.add('log-screen--active')
      );
    if (error) {
    loggedOutScreen.classList.add('log-screen--shake');
     var el =  /password/gi.test(error)
     ? document.querySelector('#password')
     : document.querySelector('#username');
     self.handleError(el, false, error);
    }
  },
  handleLoginAnimations: function(loggedIn, error) {
    var self=this;
    var loggedInScreen = document.querySelector('#loggedin-screen'),
        loggedOutScreen = document.querySelector('#loggedout-screen');
      loggedIn
      ? (
        self.handleAnimateOut(loggedOutScreen),
        self.handleAnimateIn(loggedInScreen)
      ) : (
        self.handleAnimateIn(loggedOutScreen),
        self.handleAnimateOut(loggedInScreen)
      );
  },
  handleAnimateOut: function(el) {
    el.classList.remove('log-screen--active');
    el.classList.add('log-screen--out');
  },
  handleAnimateIn: function(el) {
    el.classList.remove('log-screen--disabled');
    el.classList.add('log-screen--in');
  }
};
