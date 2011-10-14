// ==UserScript==
// @name           LegendasTvLight
// @description    Deixa o visual do legendas tv mais simples
// @version        0.1
// @author         Beothorn
// @namespace      http://*legendas.tv/*
// @include        http://*legendas.tv/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// ==/UserScript==


if($('input[name="txtSenha"]') != null){
  $('input[name="txtLogin"]').val("greasemonkey");
  var senhaField = $('input[name="txtSenha"]');
  senhaField.val("greasemonkey");

GM_xmlhttpRequest({
  method: "POST",
  url: "http://legendas.tv/login_verificar.php",
  data: "txtLogin=greasemonkey&txtSenha=greasemonkey",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  onload: function(response) {
  }
});

}

var script = document.createElement('script'); 
script.type = "text/javascript"; 
script.innerHTML = (<><![CDATA[

function tads(){
}

function abredown(download) {
	window.location.href = "http://legendas.tv/info.php?c=1&d="+download;
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

var conteudodest = document.getElementById('conteudodest');
conteudodest.setAttribute("bgcolor", "#FFFFFF");

killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table[2]/tbody/tr/td[2]/div/table[2]/tbody/tr/td[2]");
killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table/tbody/tr/td[2]/div/table[2]/tbody/tr/td/div/table");
killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table[2]/tbody/tr/td/table/tbody/tr");
killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table[2]/tbody/tr/td[2]/div/table");
killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table[2]/tbody/tr/td[2]/div/table/tbody/tr/td/div/table/tbody/tr");
killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table/tbody/tr");
killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table[2]/tbody/tr/td/div[2]");
killElementsFormXPath("//*[@id=\"Table_01\"]");
killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table/tbody/tr/td/div");
killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table/tbody/tr/td[2]/div/table/tbody/tr/td/div/table/tbody/tr/td[2]/div/div");
killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table/tbody/tr/td[2]/div/table/tbody/tr/td/div/table/tbody/tr/td[2]/div/div");
killElementsFormXPath("/html/body/table/tbody/tr[2]/td/table/tbody/tr/td/table");

$(".quebra").remove();

var kids = document.children;
for(var i in kids){
	kids[i].setAttribute("style", "");
	kids[i].setAttribute("background", "");
}
var bgesquerda = getElementsByClassName('bgesquerda');
for(var i in bgesquerda){
	bgesquerda[i].setAttribute("style", 'background-image:"";');
}

$('.login').css({"background-color":"white"});
$('.login').css({"border":"0"});
$('.bgesquerda').css({"background-image":""});
$('.bgesquerda').css({"background":""});
$('.bgesquerda').css({"background-color":"white"});
$('.smembros').css({"background-image":""});

