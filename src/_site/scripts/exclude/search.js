const searchFunctions = {
    initialize() {
        console.log('search works');
        const self = this;
        self.windowWidth = document.documentElement.clientWidth;
        self.getElements();
        self.initializeListeners();
        self.dataTest();
        self.displaySearchHistory();
        self.initResizeListener();
        self.handleSearchHistory();
    },
    getElements() {
        const self = this;
        // self.sessionAvail = pageFunctions.lsTest();
        self.search = document.querySelector('#search-results');
        self.searchWrapper = document.querySelector('#search-results-wrapper');
        self.searchField = document.querySelector('#search-field');
    },
    initializeListeners() {
        const self = this;
        console.log("foobar")
        const searchField = document.querySelector('#search-field')
        const submitBtn = document.querySelector('#submit-search')
        const submitSearchRetry = document.querySelector('#submit-search-retry')
        const clearSearch = document.querySelector('#clear-search')


        self.handleSearchBtn(submitBtn)

        submitSearchRetry.addEventListener('click', e => {
            self.handleLoadingScreen(true);
            self.getData();
            // fakes a data load or error for testing
            // self.loadingTest();
        });
        searchField.addEventListener('keyup', e => {
            const errorState = searchField.classList.contains('form-field--error');

            if (errorState && e.keyCode !== 13) {
                self.displaySearchError(false);
            }
            self.handleBtnState(submitBtn, searchField);

        });
        searchField.addEventListener('click', e => {
            const errorState = searchField.classList.contains('form-field--error');
            if (errorState && searchField.value !== '') {
                self.displaySearchError(false);
            }
            self.handleBtnState(submitBtn, searchField);

        });
        searchField.addEventListener('blur', e => {
            self.handleBtnState(submitBtn, searchField);
        });
        clearSearch.addEventListener('click', function(e) {
            self.clearSearchHistory();
        });
    },
    handleSearchBtn(btn) {
        const self = this;
        btn.addEventListener('click', e => {
            self.getSearchFieldData()
            e.preventDefault()
        })
    },
    handleBtnState(btn, field) {
        btn.disabled = field.value.length === 0 || !field.value.match(/\w+/g)
    },
    dataTest() {
        var self = this;

        var entries = sessionStorage.entries || false,
            stopWords = sessionStorage.stopWords || false;
        self.sessionAvail()
        entries && stopWords ?
            (
                self.handleLoadingScreen(false),
                self.stopWords = JSON.parse(sessionStorage.stopWords),
                self.entries = JSON.parse(sessionStorage.entries),
                self.searchActive(true),
                self.handleLoadingError(false)
            ) :
            (
                self.firebaseInit(),
                self.handleLoadingScreen(true),
                // self.loadingTest() // turn this on, and you'll get a fake firebase load that randomly fails
                self.getData()
            );
    },
    sessionAvail() {
        const entries = sessionStorage.entries || false
        const stopWords = sessionStorage.stopWords || false
        return entries && stopWords;
    },
    handleSearchReload() {
        const self = this;
        const retrievedObject = self.getQueryVariable('search_term')

        if (retrievedObject) {
            document.querySelector('#search-field').value = retrievedObject ? retrievedObject : null
            self.handleSearchResults(self.handleSearchTypes(retrievedObject), retrievedObject)
            self.handleResultsTransition() 
        }
    },
    handleURLChange(searchTerm) {
        const self = this
        const obj = self.setPageURL(searchTerm)
        history.pushState(obj, obj.title, obj.url)
    },
    setPageURL(searchTerm) {
        const self = this
        return {
            title: `Search results | ${searchTerm} | Davidputney.com`,
            url: `${self.getWindowLocation()}?type=search_result&search_term=${searchTerm.replace(/\s/g, '%20')}`
        }
    },
    getWindowLocation() {
        return window.location.href.split("?")[0]
    },
    getSearchFieldData() {
        const self = this;

        var searchInput = document.querySelector('#search-field').value
         const searchTerm = self.cleanPunctuation(searchInput)
        const stopWordsResult = self.stopWordsTest(searchInput) // false means there has been a stopwords match
        const containsWordChar = /\w+/gi.test(searchInput) // false means the items has no word characters in it
        const notWord = searchTerm.length <= 1; // true means its one character

        //  stopwords result false = bad, true = good
        if (stopWordsResult && containsWordChar && !notWord) {
            var searchResultsArr = self.handleSearchTypes(searchInput);
            self.handleSearchResults(searchResultsArr, searchInput);
            self.saveSearchHistory(searchInput);
            self.displaySearchHistory();
            self.handleURLChange(searchInput);
        } else {
            self.displaySearchError(true, self.searchErrorMessages(containsWordChar, notWord, stopWordsResult));
        }
    },
    searchErrorMessages(containsWordChar, notWord, stopWordsResult) { 
        return !containsWordChar || notWord ?
            'C\'mon. That isn\'t even a word!' :
            !stopWordsResult ? 'Whoops! Try narrowing down your search term a bit.' :
                'Yeah, that search term doesn\'t really work for us.';
    },
    handleSearchTypes: function(searchTerm) {
        var self = this;

        var searchRegex = new RegExp('\\+|"\\sand\\s"|"and"|\\&', 'gi');
        var dualSearch = searchTerm.match(searchRegex) || false;
        var resultsArr = [];

        self.entries.forEach(function(el, i) {

            var searchResult = {};
            if (dualSearch) {
                // if it is a dual search, do dual search
                var dualSearchResult = self.handleDualSearch(searchTerm, i, dualSearch);

                /// if there's a result push build result and push to array
                if (dualSearchResult) {
                    resultsArr.push(self.compileSearchResults(dualSearchResult, i, 'dual'));
                }
            } else {
                // if not dual search, do exact match search
                var exactMatchResult = self.handleExactSearch(searchTerm, i);

                // if search result, build result and push to array
                if (exactMatchResult) {
                    resultsArr.push(self.compileSearchResults(exactMatchResult, i, 'exact'));
                } else {
                    // if there's no exact match, do a near-match search
                    var nearMatchResult = self.handleNearSearch(self.cleanPunctuation(searchTerm), i);
                    // if there's a near-match result, build result and push to array
                    if (nearMatchResult) {
                        resultsArr.push(self.compileSearchResults(nearMatchResult, i, 'near'));
                    }
                }
            }
        });
        var resultsArrSort = resultsArr.sort(function(a, b) {
            return b.count - a.count;
        });
        return resultsArrSort;
    },
    compileSearchResults: function(result, index, type) {
        var self = this;
        var searchResult = {};
        searchResult.count = result;
        searchResult.index = index;
        searchResult.type = type;
        return searchResult;
    },
    handleNearSearch: function(query, index) {
        var self = this;
        query = self.cleanPunctuation(query);
        var matchArr = self.findMatchIndexes(query, index),
            results = false;

        // Filters down the matchArr to only entries that are proximate to each other
        // filter function uses a 'some' loop to test if items are proximate. True stays in the array, false is filtered out
        var nearMatches = matchArr.filter(function(el) {
            // this loop returns true if they are proximate, false if not.
            var proximityMatch = matchArr.some(function(element) {
                var startIndex = (el.index - query.length) - 30,
                    endIndex = (el.index + query.length) + 30;

                return el.match !== element.match && element.index >= startIndex && element.index <= endIndex;
            });
            return proximityMatch;
        });

        var matchCount;
        // reduces array to just strings that matched
        if (nearMatches && nearMatches.length > 0) {
            var nearMatchesTerms = nearMatches.map(function(el) {
                return el.match;
            });
            // removes redundencies from array
            var nearMatchesReduced = nearMatchesTerms.filter(function(el, i) {
                return nearMatchesTerms.indexOf(el) == i;
            });
            matchCount = (nearMatchesReduced.length / query.split(' ').length);
        } else {
            matchCount = false;
        }
        return matchCount;
    },
    findMatchIndexes: function(query, index) {
        var self = this;

        var searchTermArr = query.split(' ').filter(function(el) {
            if (self.stopWordsTest(el.toLowerCase())) {
                return el;
            }
        });

        var matchArr = [];
        var match;
        searchTermArr.forEach(function(el) {
            var regex = new RegExp('\\b' + el + '\\b', 'gi')
            while ((match = regex.exec(self.entries[index].title + " " + self.entries[index].post)) !== null) {
                var matchRecord = {};
                matchRecord.match = el;
                matchRecord.index = match.index;
                matchArr.push(matchRecord);
            }
        });
        return matchArr;
    },
    handleExactSearch: function(query, i) {
        var self = this;
        var regexp = new RegExp('\\b' + self.cleanPunctuation(query) + '\\b', 'gi');
        var match = self.cleanPunctuation(self.entries[i].post + ' ' + self.entries[i].title).match(regexp) || false;

        return match ?
            match.length :
            false;
    },
    handleDualSearch: function(searchTerm, index, splitCharacter) {
        var self = this;
        var searchTermArr = searchTerm.split(splitCharacter[0]),
            entryCount = 0;
        // checks to see if it matches all items in search array
        var matchTest = searchTermArr.every(function(term, i) {
            var termClean = self.cleanPunctuation(term).replace(/^\s+/gi, '').replace(/\\s+$/, ''),
                regexp = new RegExp('\\b' + termClean + '\\b', 'gi');
            var match = self.cleanPunctuation(self.entries[index].post + ' ' + self.entries[index].title).match(regexp) || [];

            entryCount = entryCount + match.length;
            return termClean.length > 0 && match.length > 0;
        });
        return matchTest ?
            entryCount :
            false;
    },
    saveSearchHistory: function(searchTerm) {
        var self = this;
        // searchTerm = self.cleanPunctuation(searchTerm);
        var searchArr = sessionStorage.searches ?
            JSON.parse(sessionStorage.searches) : [];

        if (self.sessionAvail()) {
            searchArr.unshift(searchTerm);
            searchArr = searchArr.slice(0, 10);
            searchArr = JSON.stringify(searchArr);
            sessionStorage.searches = searchArr;
        }
    },
    getSearchHistory: function() {
        var self = this;
        var arr = sessionStorage.searches ?
            JSON.parse(sessionStorage.searches) : [];
        return arr;
    },
    clearSearchHistory: function() {
        var self = this;
        sessionStorage.removeItem('searches');
        self.displaySearchHistory();
    },
    displaySearchHistory: function() {
        var self = this;
        var historyList = document.querySelector('#search-history'),
            arr = self.getSearchHistory(),
            clear = document.querySelector('#clear-search'),
            wrapper = document.querySelector('#search-history-wrapper');

        historyList.innerHTML = '';

        if (arr.length > 0) {
            arr.forEach(function(el) {
                var linkURL = self.setPageURL(el);
                var link = document.createElement('A');
                link.href = linkURL.url;

                var list = document.createElement('LI');
                link.innerHTML = el;
                list.dataset.term = el.replace(/"/gi, "%22");
                list.appendChild(link);
                historyList.appendChild(list);
            });
            clear.classList.add('active');
            wrapper.classList.remove('hide');
        } else {
            clear.classList.remove('active');
        }
    },
    handleSearchHistory: function() {
        var self = this;

        var history = document.querySelector('#search-history-wrapper');
        // var searchField = document.querySelector('#search-field');

        history.addEventListener('click', function(e) {
            e.preventDefault();
            var clickTarget = e.target.parentNode;
            if (clickTarget.nodeName === 'LI') {
                var searchInput = clickTarget.dataset.term.replace(/%22/g, "\"");
                var searchResultsArr = self.handleSearchTypes(searchInput);
                self.handleSearchResults(searchResultsArr, searchInput);
                self.displaySearchHistory();
                self.handleURLChange(searchInput);
                self.searchField.value = searchInput;
            }
        });
    },
    handleSearchResults: function(resultsArr, searchTerm) {
        var self = this;

        // searchTerm = self.cleanPunctuation(searchTerm);

        self.searchWrapper.innerHTML = '';
        self.handleResultsTransition(true);
        self.handleSearchHed(resultsArr, searchTerm);

        var textLength = self.windowWidth > 700 ?
            100 :
            50;

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

            entryLink.href = self.entries[el.index].link + '?type=search_result&search_term=' + searchTerm;

            entryContainer.classList.add('search-results-entry');
            entryHeadline.classList.add('blog-headline');
            entryMatches.classList.add('blog-entry-date');

            entryHeadline.innerHTML = hedText;
            entryBody.innerHTML = bodyText + '&nbsp;&#133;';


            // console.log('el type', el.type);
            // console.log(searchTerm.split(' ').length);
            // console.log("-----");

            // var entryMatches.innerHTML;
            if (el.type === "dual") {
                entryMatches.innerHTML = "Phrase matches | " + el.count + " found";
                // dual: Both phrases match | XX found

            } else if (el.type === "near") {
                var searchLength = searchTerm.split(' ').length;

                // near: X out of X words match
                entryMatches.innerHTML = "Words match | " + (searchLength * el.count) + " out of " + searchLength;
            } else {
                entryMatches.innerHTML = "Phrase matches | " + el.count + "  found";
            }

            // exact Phrase matches | XX found


            // entryMatches.innerHTML = el.count < 1
            // ? Math.round(el.count * 100) + " percent of phrase matches"
            // : el.count === 1 ? "Phrase matches | " + el.count + ' occurance found'
            // : "Phrase matches | " + el.count + ' occurances found';

            entryBodyContainer.appendChild(entryBody);
            entryContainer.appendChild(entryHeadline);
            entryContainer.appendChild(entryMatches);
            entryContainer.appendChild(entryBodyContainer);
            entryLink.appendChild(entryContainer);
            self.searchWrapper.appendChild(entryLink);
        });
    },
    handleSearchHed: function(resultsArr, searchTerm) {
        var self = this;
        var searchHed = document.querySelector('.search-results-header') || false;

        self.searchWrapper.innerHTML = '';

        var newSpan = document.createElement('span');

        var resultsMessage = resultsArr.length === 1 ?
            resultsArr.length + '&nbsp;result for ' :
            resultsArr.length + '&nbsp;results for ';

        if (searchHed) {
            newSpan.innerHTML = searchTerm;
            searchHed.innerHTML = resultsMessage;
            searchHed.appendChild(newSpan);
        } else {
            var entrySearch = document.createElement('H1');
            entrySearch.classList.add('search-results-header');
            entrySearch.innerHTML = resultsMessage;
            newSpan.innerHTML = searchTerm;
            entrySearch.innerHTML = resultsMessage;
            entrySearch.appendChild(newSpan);
            self.search.insertBefore(entrySearch, self.searchWrapper);
        }
    },
    handleResultsTransition: function(state) {
        var self = this;

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
        // false means there has been a stopwords match
        var self = this;
        return self.cleanSearchText(term).some(el => el !== '' && self.stopWordsCompare(el) === false)
    },
    stopWordsCompare(matchTerm) {
        const self = this;
        return self.stopWords.some(el => el === matchTerm)
    },
    cleanSearchText(term) {
        return term.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(' ');
    },
    getData() {
        const self = this;
        console.log('get data');
        const p = self.firebaseGet('users/05db3ef7-a40d-4a16-9153-aa4f6bf8d25b', self.myFirebaseRef);
        p.then(data =>{
                self.stopWords = data.stopWords;
                self.entries = data.entries;
                if (!self.sessionAvail()) {
                    sessionStorage.setItem('entries', JSON.stringify(data.entries));
                    sessionStorage.setItem('stopWords', JSON.stringify(data.stopWords));
                }
                self.searchActive(true);
                self.handleLoadingError(false);
            }),
            error => {
                self.handleLoadingError(true);
            };
    },
    searchActive(state) {
        const self = this;
        const searchField = document.querySelector('#search-field')
        const errorOverlay = document.querySelector('#error-overlay')
        state ? (
                searchField.disabled = false,
                self.handleLoadingScreen(false),
                self.handleSearchReload()
            ) :
            errorOverlay.classList.add('error-overlay--active');
    },
    handleLoadingScreen(state) {
        const self = this;
        const loader = document.querySelector('#loader')
        const loaderIcon = document.querySelector('#loader-icon')
        const loaderShadow = document.querySelector('#loader-shadow')

        state ? (
            self.handlePlay(loaderIcon, loaderShadow),
            loader.classList.add('error-overlay--active')
        ) : (
                self.handleScreen(loader, loaderIcon, loaderShadow), 
            self.handlePause(loader, loaderIcon, loaderShadow)
        );
    },
    handleScreen(loader, loaderIcon, loaderShadow) {
        const self = this;
        setTimeout(function() {
            loader.addEventListener('transitionend', self.handlePause(loader, loaderIcon, loaderShadow));
            loader.classList.remove('error-overlay--active');
        }, 2000);
    },
    handlePlay(loaderIcon, loaderShadow) {
        loaderIcon.classList.remove('paused');
        loaderShadow.classList.remove('paused');
    },
    handlePause(loader, loaderIcon, loaderShadow) {
            loader.removeEventListener("transitionend", () => {
                console.log("trans remove")
            }, true);  
            setTimeout(function () { 
                loaderIcon.classList.add('paused');
                loaderShadow.classList.add('paused');
             }, 2000);
    },
    displaySearchError(state, error) {
        const errorField = document.querySelector('#search-field-error')
        const searchField = document.querySelector('#search-field')
        state ? (
            searchField.classList.add('form-field--error'),
            errorField.innerHTML = error
        ) : (
            searchField.classList.remove('form-field--error'),
            errorField.innerHTML = ''
        );
    },
    handleLoadingError(state) {
        const self = this;
        const errorOverlay = document.querySelector('#error-overlay');

        state ? (
            errorOverlay.classList.add('error-overlay--active'),
            self.handleLoadingScreen(false)
        ) : errorOverlay.classList.remove('error-overlay--active');
    },
    firebaseInit() {
        var self = this;
        console.log('firebaseInit');
        self.myFirebaseRef = new Firebase("https://putneysearch.firebaseio.com/");
    },
    firebaseGet(child, db) {
        // Get a database reference to our posts
        return new Promise((resolve, reject) => {
            db.child(child).on("value", (snapshot) => {
                resolve(snapshot.val());
            }, (errorObject) => {
                reject("The read failed: " + errorObject.code);
            });
        });
    },
    sleep: (time) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(time);
            }, time);
        });
    },
    cleanPunctuation: function(term) {
        return term.replace(/[\'.,\/#!$%\^&\*;:{}=\-_`~()–’“”"]/g, "").replace(/\+/gi, "").replace(/\s+$/g, "");
    },
    // cleanPunctuation: function(term) {
    //   return term.replace(/[\'.,\/#!$%\^&\*;:{}=\-_`~()–’“”]/g,"").replace(/\s+$/g,"");
    // },
    loadingTest: function() {
        var self = this;

        var rando = Math.random() * (3 - 1) + 1,
            state = rando < 2;

        self.sleep(3000).then(function(time) {
            rando < 2 ?
                (
                    self.searchActive(true),
                    self.handleLoadingError(false),
                    console.log(state, 'fake loaded')
                ) :
                (
                    self.handleLoadingError(true),
                    console.log(state, 'fake failed')
                );
        });
    },
    initResizeListener: function() {
        var self = this;
        window.onresize = e => {
            self.windowWidth = document.documentElement.clientWidth;
        };
    },
    getQueryVariable: function(variable) {
        var self = this;

        var query = window.location.search.substring(1),
            vars = query.split("&");

        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1].replace(/%20/g, ' ').replace(/%22/gi, '\"');
            }
        }
        return (false);
    },
};