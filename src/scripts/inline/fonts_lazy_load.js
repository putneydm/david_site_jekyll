var fontLoad = {
    intialize: function() {
        "use strict";
        var self = this;
        console.log('fonts');
        var woff = '/fonts/fontsWOFF_r2.css';
        var woff2 = '/fonts/fontsWOFF2r2.css';
        if (self.lsTest()) {
          this.loadFont('font-file', woff, woff2)
        }
    },
    loadFont: function(a, b, c) {
        function d() {
            if (!window.FontFace) return !1;
            var a = new FontFace("t", 'url("data:application/font-woff2,") format("woff2")');
            return a.load(), "loading" === a.status
        }
        var e = navigator.userAgent,
            f = !window.addEventListener || e.match(/(Android (2|3|4.0|4.1|4.2|4.3))|(Opera (Mini|Mobi))/) && !e.match(/Chrome/);
        if (!f) {
            var g = {};
            try {
                g = sessionStorage || {}
            } catch (h) {}
            var i = "x-font-" + a,
                j = i + "url",
                k = i + "css",
                l = g[j],
                m = g[k],
                n = document.createElement("style");
            if (n.rel = "stylesheet", document.head.appendChild(n), !m || l !== b && l !== c) {
                var o = c && d() ? c : b,
                    p = new XMLHttpRequest;
                p.open("GET", o), p.onload = function() {
                    p.status >= 200 && p.status < 400 && (g[j] = o, g[k] = n.textContent = p.responseText)
                }, p.send();
                document.querySelectorAll('HTML')[0].classList.remove('no-fonts');
            } else
            n.textContent = m;
            document.querySelectorAll('HTML')[0].classList.remove('no-fonts');
        }
    },
    lsTest: function() {
        try {
            localStorage.setItem("name", "Hello World!");
            localStorage.removeItem("name");
            return true;
        } catch (e) {
            return false;
        }
    }
};
(function() {
    fontLoad.intialize();
})();
