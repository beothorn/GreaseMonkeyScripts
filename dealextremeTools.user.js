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

$('a').each(function() {
	var link = $(this);
	if(isTrakingNumberLink(link.text())){
			log(link);
			createTrackingStatusForLink(link);
	}
});

function log(log){
	var debug = false;
	if(debug)
		unsafeWindow.console.log(log)
}

function isTrakingNumberLink(text){
	if(text==null)
		return false;
	var trackingNumberRegexPattern = ".*([A-Z]{2}[0-9]{9}[A-Z]{2}).*";
	return text.match(trackingNumberRegexPattern);
}

var possibleStatus = new Array( 
	{ caption: "Entregue", color: "green", blink: false }, 
	{ caption: "Saiu para entrega", color: "Gold", blink: true }, 
	{ caption: "Conferido", color: "Orange", blink: false }, 
	{ caption: "Encaminhado", color: "red", blink: false }, 
	{ caption: "Postado", color: "red", blink: false } 
);

function createTrackingStatusForLink(link){
	log("createTrackingStatusForLink "+link);
	var postOfficeTrackUrl = "http://websro.correios.com.br/sro_bin/txect01$.Inexistente?P_LINGUA=001&P_TIPO=002&P_COD_LIS="+link.text();
	GM_xmlhttpRequest({
	  method: "GET",
	  url: postOfficeTrackUrl,
	  onload: function(response) {
	  	log("response "+response);
	  	log("possibleStatus "+possibleStatus);
			for(var i in possibleStatus) {
				var status = possibleStatus[i];
				if((response.responseText).indexOf(status.caption)!= -1){
					log("status.caption "+status.caption);
					var innerHTML = formatStatusLink(postOfficeTrackUrl,status);
					link.parent().append('<a href="'+postOfficeTrackUrl+'" target="_blank" >'+innerHTML+'</a>');
					break;
				}
			}
	  }
	});
}

function formatStatusLink(postOfficeTrackUrl, status) {
	var ret = status.blink ? "<blink>" : "";
	ret += " <strong><font color=\"" + status.color + "\">" + status.caption + "</font></strong>";
	return status.blink ? "</blink>" + ret : ret;
}
