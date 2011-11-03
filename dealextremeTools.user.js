// ==UserScript==
// @name           DealExtremeTools
// @description    Automatically fetch the status of your deals looking up on Brasil post office traking numbers.
// @version        0.1
// @author         github:matiasgrodriguez and github:beothorn
// @namespace      http://www.dealextreme.com
// @include        http://*dealextreme.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// ==/UserScript==

/**
TODO: 
 - Show as a tooltip the date that the deal entered the matched status in a google-like form. Ex: "1 day ago", "1 week ago", 2010/03/28
 - Support other post offices
*/

var possibleStatus = new Array( 
	{ caption: "Entregue", color: "green", blink: false }, 
	{ caption: "Saiu para entrega", color: "Gold", blink: true }, 
	{ caption: "Conferido", color: "Orange", blink: false }, 
	{ caption: "Encaminhado", color: "red", blink: false }, 
	{ caption: "Postado", color: "red", blink: false } 
);

function formatStatusLink(postOfficeTrackUrl, status) {
	var ret = status.blink ? "<blink>" : "";
	ret += " <strong><font color=\"" + status.color + "\">" + status.caption + "</font></strong>";
	return status.blink ? "</blink>" + ret : ret;
}

function createTrackingStatusLink(nodeToWriteStatus, trackingNumber){
	var postOfficeTrackUrl = "http://websro.correios.com.br/sro_bin/txect01$.Inexistente?P_LINGUA=001&P_TIPO=002&P_COD_LIS="+trackingNumber;
	GM_xmlhttpRequest({
	  method: "GET",
	  url: postOfficeTrackUrl,
	  onload: function(response) {
		console.log(response);
		for(var i in possibleStatus) {
			var status = possibleStatus[i];
			if((response.responseText).indexOf(status.caption)!= -1){
				var href = postOfficeTrackUrl;
				var innerHTML = formatStatusLink(postOfficeTrackUrl,status);
				nodeToWriteStatus.append('<a href="'+href+'" target="_blank" >'+innerHTML+'</a>');
				break;
			}
		}
	  }
	});
}

var trackingNumberRegexPattern = ".*([A-Z]{2}[0-9]{9}[A-Z]{2}).*";
$('a').each(function() {
	var linkText = $(this).text();
	if(linkText != null){
		if(linkText.match(trackingNumberRegexPattern)){
			createTrackingStatusLink($(this).parent(),linkText);
		}
	}
});
