// ==UserScript==
// @name           Rastreamento do Correios
// @description    Mostra um balão com a situação da mercadoria
// @version        0.1
// @author         Beothorn
// @namespace      *
// @include        *
// ==/UserScript==

var rastreamentoCorreiosRegexPattern = ".*([A-Z]{2}[0-9]{9}[A-Z]{2}).*";

var linkCorreios = "http://websro.correios.com.br/sro_bin/txect01$.Inexistente?P_LINGUA=001&P_TIPO=002&P_COD_LIS=";

var allowedParents = [
	'a','abbr', 'acronym', 'address', 'applet', 'b', 'bdo', 'big',
	'blockquote', 'body', 'caption', 'center', 'cite', 'code',
	'dd', 'del', 'div', 'dfn', 'dt', 'em', 'fieldset', 'font',
	'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'i', 'iframe',
	'ins', 'kdb', 'li', 'object', 'pre', 'p', 'q', 'samp',
	'small', 'span', 'strike', 's', 'strong', 'sub', 'sup',
	'td', 'th', 'tt', 'u', 'var'];

var xpath = '//text()[(parent::' + allowedParents.join(' or parent::') +')]';
var iterator = document.evaluate(xpath, document, null,XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

var nodeArray = new Array();

var thisNode = iterator.iterateNext();
while (thisNode) {
	if(thisNode.nodeValue.match(rastreamentoCorreiosRegexPattern)){
		nodeArray.push(thisNode);
	}
	thisNode = iterator.iterateNext();
}


for(var i in nodeArray){
	var nodeContent = nodeArray[i].nodeValue+"";
	if(nodeContent != null){
		var re = new RegExp(rastreamentoCorreiosRegexPattern);
		var m = re.exec(nodeContent);
		if(m != null){
			var traceCode =  m[1];
			
			var novoLinkCorreios = document.createElement("a");
			novoLinkCorreios.href = linkCorreios + traceCode;
			novoLinkCorreios.target = "_blank";
			novoLinkCorreios.innerHTML = " Correios ";
			nodeArray[i].parentNode.parentNode.appendChild(novoLinkCorreios);
		}
	}
}