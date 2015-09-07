var cssLoad = {
  intialize: function () {
     "use strict";
     console.log('styles');
      var pageIdent = document.getElementsByTagName('BODY')[0].getAttribute('data-pagetype');
      var styleLink = this.loadCSSInit(pageIdent);
      this.loadCSS( styleLink );
   },
   loadCSSInit: function ( pageIdent ) {
      if (pageIdent === 'section-page') {
         return '../css/styles.css';
      }
      if (pageIdent === 'portfolio-page') {
         return '../../css/styles.css';
      }
      if (pageIdent === 'blog-entry') {
         return '../../css/styles.css';
      }
      if (pageIdent === 'index-page') {
         return 'css/styles.css';
      }
      else {
         return '../css/styles.css';
      }
   },
   loadCSS: function ( href, before, media, callback ){
         "use strict";
         var ss = window.document.createElement( "link" );
         var ref = before || window.document.getElementsByTagName( "script" )[ 0 ];
         var sheets = window.document.styleSheets;
         ss.rel = "stylesheet";
         ss.href = href;
         ss.media = "only x";
         if( callback ) {
            ss.onload = callback;
         }
         ref.parentNode.insertBefore( ss, ref );
         ss.onloadcssdefined = function( cb ){
            var defined;
            for( var i = 0; i < sheets.length; i++ ){
               if( sheets[ i ].href && sheets[ i ].href === ss.href ){
                  defined = true;
               }
            }
            if( defined ){
               cb();
            } else {
               setTimeout(function() {
                  ss.onloadcssdefined( cb );
               });
            }
         };
         ss.onloadcssdefined(function() {
            ss.media = media || "all";
         });
         return ss;
      },
};
(function() {
  cssLoad.intialize();
})();
