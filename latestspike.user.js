// ==UserScript==
// @name           IncludeLatest test
// @description    bla bla bla
// @version        0.1
// @author         github:matiasgrodriguez
// @namespace      http://www.dealextreme.com
// @include        http://*dealextreme.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// ==/UserScript==

GM_xmlhttpRequest({
	  method: "GET",
	  url:  "http://github.com/beothorn/GreaseMonkeyScripts/raw/master/latest/dxlatest.js",
	  onload: function(response) {
		eval(response.responseText);
		$( 'form#aspnetForm' ).first().prepend( '<div>dfhjbdfjabCurrent Script Version is ' + dxCurrentVersion() + '</div>' );
	  }
	});

