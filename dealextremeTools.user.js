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

function main() {
	var invoiceLinks = new Array();
	$('table#ctl00_content_Orders a').each(function() {
		var link = $(this);
		if(isTrakingNumberLink(link.text())){
			//log(link);
			createTrackingStatusForLink(link);
		}else if(isInvoiceLink(link.attr("href"))){
			//log(link);
			invoiceLinks.push( link );
		}
	});
	invoiceLinks.reverse();
	createInvoiceStatusforLinks(invoiceLinks);
}

main();

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
		allSkus.push( $(this).text() );
	});
	return allSkus;
}

function getProductStatus(context) {
	var allStatus = new Array();
	$('span[id$="lblStatus"]',context).each(function() {
		allStatus.push( $(this).text() );
	});
	return allStatus;
}

function getConfirmReceiptEnablement(context) {
	var allConfirmReceiptEnablement = new Array();
	$('input',context).each(function() {
		allConfirmReceiptEnablement.push( $(this).attr('disabled')!="disabled" );
	});
	return allConfirmReceiptEnablement;
}

function createBoxWithColor(context, color) {
	context.append('&nbsp;<span style="background-color:' + color + '">&nbsp;&nbsp;&nbsp;&nbsp;</span>')
}

function calculateInvoiceStatus(context) {
	var skus = getProductSkus(context);
	var status = getProductStatus(context);
	var receiptEnablement = getConfirmReceiptEnablement(context);
	var pending = false;
	var packing = false;
	var shipped = false;
	var received = false;
	var i = 0;
	for(i=0;i<skus.length;i++) {
		if( skus[i]=="00000" || skus[i]=="01888" ) {
			continue;
		}
		if( status[i] == "Pending" ) {
			pending = true;
		} else if( status[i] == "Packing" ) {
			packing = true;
		} else if( status[i] == "Shipped" ) {
			if( receiptEnablement[i] ) {
				shipped = true;
			} else {
				received = true;
			}
		}
	}
	if( pending )
		createBoxWithColor(context,'Red');
	if( packing )
		createBoxWithColor(context,'OrangeRed');
	if( shipped )
		createBoxWithColor(context,'Orange');
	if( received )
		createBoxWithColor(context,'Green');
}

function createInvoiceStatusforLinks(invoiceLinks) {
	if( invoiceLinks.length == 0 ) {
		return;
	}
	var link = invoiceLinks.pop();
	var invoiceUrl = link.attr("href");
	GM_xmlhttpRequest({
	  method: "GET",
	  url: invoiceUrl,
	  onload: function(response) {
		var context = link.parent();
		context.append( getDetailsTableString( response.responseText ) );
		calculateInvoiceStatus(context);
		$("#ctl00_content_gvOrderDetail",context).remove();
		createInvoiceStatusforLinks(invoiceLinks);
	  }
	});
}
