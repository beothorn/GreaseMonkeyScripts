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

$('a').each(function() {
	var link = $(this);
	if(isTrakingNumberLink(link.text())){
		//log(link);
		createTrackingStatusForLink(link);
	}else if(isInvoiceLink(link.attr("href"))){
		//log(link);
		createInvoiceStatusforLink(link);
	}
});

function log(log){
	var debug = true;
	if(debug)
		unsafeWindow.console.log(log)
}

function isTrakingNumberLink(text){
	if(text==null)
		return false;
	var trackingNumberRegexPattern = ".*([A-Z]{2}[0-9]{9}[A-Z]{2}).*";
	return text.match(trackingNumberRegexPattern);
}

function createTrackingStatusForLink(link){
	//log("createTrackingStatusForLink "+link);
	var postOfficeTrackUrl = "http://websro.correios.com.br/sro_bin/txect01$.Inexistente?P_LINGUA=001&P_TIPO=002&P_COD_LIS="+link.text();
	GM_xmlhttpRequest({
	  method: "GET",
	  url: postOfficeTrackUrl,
	  onload: function(response) {
	  	//log("response "+response);
		for(var i in possibleStatus) {
			var status = possibleStatus[i];
			if((response.responseText).indexOf(status.caption)!= -1){
				//log("status.caption "+status.caption);
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



////////////////////////////////////////////////////////

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function isInvoiceLink(href){
	return endsWith(href,"~page.invoice");
	/*
	var trackingNumberRegexPattern = ".*((0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])([A-Z1-9]{4})).*";
	return text.match(trackingNumberRegexPattern);
	*/
}

function getDetailsTableString(wholePageStr) {
	var divBeginIndex = wholePageStr.indexOf('<div class=\"detail\">');
	var tableBeginIndex = wholePageStr.indexOf('<table',divBeginIndex);
	var tableEndIndex = wholePageStr.indexOf('</table>',tableBeginIndex) + 9;
	return wholePageStr.substring(tableBeginIndex, tableEndIndex);
}


function getProductSkus(context) {
	var allSkus = new Array();
	$('a.sku',context).each(function() {
		var skuLink = $(this);
		allSkus.push( skuLink.text() );
	});
	return allSkus;
}

function getProductStatus(context) {
	var allStatus = new Array();
	$('span[id$="lblStatus"]',context).each(function() {
		var statusSpan = $(this);
		allStatus.push( statusSpan.text() );
	});
	return allStatus;
}

function getProductConfirmReceiptStatus(context) {
	var allConfirmReceiptSpan = new Array();
	$('span[id$="lblConfirmReceiptStatus"]',context).each(function() {
		var confirmReceiptSpan = $(this);
		allConfirmReceiptSpan.push( confirmReceiptSpan.text() );
	});
	return allConfirmReceiptSpan;
}

function test(context,text) {
		//log(text);
		//context.append(text);
		//context.append(getDetailsTableString(text));
		//var skus = getProductSkus(context);
		//link.parent().append( '<span>' + skus + '</span>' );
		//var status = getProductStatus(context);
		//var receiptStatus = getProductConfirmReceiptStatus(context);
		//$("#ctl00_content_gvOrderDetail",context).remove();
}

function createInvoiceStatusforLink(link){
	//link.parent().append("<span style=\"background-color:green\">&nbsp;&nbsp;&nbsp;&nbsp;</span>");
	var invoiceUrl = link.attr("href");
	//log(invoiceUrl);
	GM_xmlhttpRequest({
	  method: "GET",
	  url: invoiceUrl,
	  onload: function(response) {
		log(link.text());
		log(getDetailsTableString(response.responseText));
		log("---------------------------------------------------------------------");
		//test(link.parent(),response.responseText);
		/*
		link.parent().append( getDetailsTableString( response.responseText ) );
		var skus = getProductSkus(link.parent());
		link.parent().append( '<span>' + skus + '</span>' );
		//var status = getProductStatus(link.parent());
		//link.parent().append( '<span>' + status + '</span>' );
		//var receiptStatus = getProductConfirmReceiptStatus(link.parent());
		$("#ctl00_content_gvOrderDetail",link.parent()).remove();
		*/
	  }
	});
}
