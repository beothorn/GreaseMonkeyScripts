// ==UserScript==
// @name           LegendasTvLight
// @description    Deixa o visual do legendas tv mais simples
// @version        0.1
// @author         Beothorn
// @namespace      http://*legendas.tv/*
// @include        http://*legendas.tv/*
// ==/UserScript==

var script = document.createElement('script'); 
script.type = "text/javascript"; 
script.innerHTML = (<><![CDATA[

function tads(){
}

]]></>).toString();
document.getElementsByTagName('head')[0].appendChild(script);


function getElementsByClassName(className){
	var hasClassName = new RegExp("(?:^|\\s)" + className + "(?:$|\\s)");
	var allElements = document.getElementsByTagName("*");
	var results = [];

	var element;
	for (var i = 0; (element = allElements[i]) != null; i++) {
		var elementClass = element.className;
		if (elementClass && elementClass.indexOf(className) != -1 && hasClassName.test(elementClass))
			results.push(element);
	}

	return results;
}

function killElementsFormXPath(xpath){
	var iterator = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null );  
	  
	try {  
		var thisNode = iterator.iterateNext();  
	    
		while (thisNode) {  
			var nextNode = iterator.iterateNext();
			thisNode.parentNode.removeChild(thisNode);
			thisNode = nextNode;
		}   
	}  
	catch (e) {  
	  dump( 'Error: Document tree modified during iteration ' + e );  
	}
}

var divNoticias = getElementsByClassName('noticias');
for(var i in divNoticias){
	divNoticias[i].setAttribute("style", "display:none;");
}

var header = document.getElementById('Table_01');
header.parentNode.removeChild(header);

var images = document.getElementsByTagName('img');
for (var i = images.length-1; i >=0; i--) {
	if(images[i].src.indexOf('destaques') == -1)
	    images[i].parentNode.removeChild(images[i]);
}

var cells = document.getElementsByTagName('td');
for (var i = cells.length-1; i >=0; i--) {
	cells[i].setAttribute("background", "");
}

killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table[2]/tbody/tr/td[2]/div/table[2]/tbody/tr/td[2]");
killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table/tbody/tr/td[2]/div/table[2]/tbody/tr/td/div/table");
killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table[2]/tbody/tr/td/table/tbody/tr");
killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table[2]/tbody/tr/td[2]/div/table");
killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table[2]/tbody/tr/td[2]/div/table/tbody/tr/td/div/table/tbody/tr");
killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table/tbody/tr");

var kids = document.children;
for(var i in kids){
	kids[i].setAttribute("style", "");
	kids[i].setAttribute("background", "");
}

