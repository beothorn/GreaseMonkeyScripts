// ==UserScript==
// @name           IncludeLatest test
// @description    bla bla bla
// @version        0.1
// @author         github:matiasgrodriguez
// @namespace      http://www.dealextreme.com
// @include        http://*dealextreme.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @require        http://github.com/beothorn/GreaseMonkeyScripts/raw/master/latest/dxlatest.js
// ==/UserScript==

$( 'form#aspnetForm' ).first().prepend( '<div>This is static2...</div>' );
$( 'form#aspnetForm' ).first().prepend( '<div>Current Script Version is ' + dxCurrentVersion() + '</div>' );

