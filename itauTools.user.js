// ==UserScript==
// @name           ItauTools
// @description    Ferramentas de visualização do extrato do Itaú
// @version        0.1
// @author         Beothorn
// @namespace      https://bankline.itau.com.br/*
// @include        https://bankline.itau.com.br/*
// ==/UserScript==

//var descriptionForIndex = ["Data","2","P?","Lançamento","Código?","Valor","Sinal do valor","Saldo","Espaço?"];
var indexes = {date:0,description:3,valueSign:6,value:5,balance:7};

function allMonthsSummed(totalSum){
	console.log("allMonthsSummed");
	var divMenuAno = document.getElementById('TRNnoprint03');
	var values = document.createElement("textarea");
	values.setAttribute("style", "width:100%;height:25em;");
	for(var i in totalSum)
		values.value += totalSum[i].date+"|"+totalSum[i].balance+"\n";
	divMenuAno.appendChild(values);
}

function removeIfDateExists(array,date){
	for(var i in array){
		if(array[i].date == date){
			array.splice(i,1);
			return;
		}
	}
}

function getDay(dateString){
	var re = new RegExp("(\\d{2})/\\d{2}/\\d{4}");
	var m = re.exec(dateString);
	return m[1];
}

function dayToString(dayAsInt){
	if(dayAsInt>=10){
		return ""+dayAsInt;
	}
	return "0"+dayAsInt;
}

function fixBalanceString(balance){
	console.log(balance);
	if(balance.indexOf('-') != -1){
		return "-" + balance.replace("-","");
	}
	return balance;
}

function fillGapsBetweenDaysAndFixBalanceSign(monthSum){
	var fullMonth = new Array();
	var lastDay;
	for(var i in monthSum){
		if(lastDay == null){
			lastDay = parseInt(getDay(monthSum[i].date), 10);
			fullMonth.push(monthSum[i])
		}else{
			var day = parseInt(getDay(monthSum[i].date), 10);
			if(day!=lastDay && day!=lastDay+1){
				console.log("from "+(lastDay+1)+" to "+day+" dates "+monthSum[i].date+" day "+getDay(monthSum[i].date));
				for(var dayToFill= lastDay+1; dayToFill<day ;dayToFill++){
					var newDate = dayToString(dayToFill)+monthSum[i].date.substring(2, monthSum[i].date.lenght);
					fullMonth.push({date: newDate,balance:monthSum[i-1].balance});
				}
			}
			fullMonth.push(monthSum[i]);
			lastDay = parseInt(getDay(monthSum[i].date), 10);
		}
	}
	
	for(var i in fullMonth){
		fullMonth[i].balance = fixBalanceString(fullMonth[i].balance); 
	}
	
	return fullMonth;
}

function getSumForThisMonth(){
	var monthSum = new Array();
	var lineCount = 1;
	var dateElement = document.getElementById('date'+lineCount);
	var balanceLine;
	while(dateElement != null){
		balanceLine = dateElement.parentNode.children;
		var date = balanceLine[indexes.date].innerHTML;
		var valueSign = balanceLine[indexes.valueSign].innerHTML;
		var value = balanceLine[indexes.value].innerHTML;
		var description = balanceLine[indexes.description].innerHTML;
		var balance = balanceLine[indexes.balance].innerHTML.replace(/^\s+|\s+$/g,"");

		if(balance != ""){
			var dateWithYear = date+"/"+getCurrentBalanceYear();
			removeIfDateExists(monthSum,dateWithYear);
			monthSum.push({date:dateWithYear,balance:balance});
		}
		lineCount++;
		dateElement = document.getElementById('date'+lineCount);
	}
	return fillGapsBetweenDaysAndFixBalanceSign(monthSum);
}

function getCurrentBalanceYear(){
	var re = new RegExp("- (\\d{4})");
	var m = re.exec(document.getElementById('header0').innerHTML);
	return m[1];
}

function getSumForThisMonthAndAdvance(){
	var totalSum = new Array();
	recursiveGetSumForThisMonthAndAdvance(totalSum);
}

function recursiveGetSumForThisMonthAndAdvance(totalSum){
	console.log("getSumForThisMonthAndAdvance");
	totalSum = totalSum.concat(getSumForThisMonth());

	var nextMonthLink = document.getElementById('linhaMesProximo').children[0];
	var isThereAnotherMonth = nextMonthLink != null;
	if(isThereAnotherMonth){
		var d = new Date();
		var thisMonth = d.getMonth();
		var re = new RegExp("javascript:BuscaMesExtrato\\((\\d)");
		var m = re.exec(nextMonthLink.href);
		var advancingMonthWillReloadThePage = m[1] == thisMonth;
		if(advancingMonthWillReloadThePage){
			allMonthsSummed(totalSum);
			return;
		}
		eval(nextMonthLink.href);
	}else{
		allMonthsSummed(totalSum);
		return;
	}
	function waitNextMonth() {
		if(document.getElementById('header0') == null) {
			console.log("wait");
      setTimeout(waitNextMonth, 500);
		}else{
			console.log("done");
		  totalSum = totalSum.concat(getSumForThisMonthAndAdvance());
		}
		
	};
	waitNextMonth();
}

function addButton(text, actionOnClick){
	var divMenuAno = document.getElementById('TRNnoprint03');
	
	var button = document.createElement("input");
	button.setAttribute("type", "button");
	button.setAttribute("value", text);
	button.addEventListener('click', actionOnClick, false);
	divMenuAno.appendChild(button);
}

addButton("Saldos do mês", function(event){
	var monthSum = getSumForThisMonth();
	allMonthsSummed(monthSum);
});

addButton("Colher saldos", function(event){
	getSumForThisMonthAndAdvance();
});

addButton("Gráfico do mês", function(event){
		
			var monthSum = getSumForThisMonth();
			for(var i in monthSum){
				console.log(getDay(monthSum[i].date)+" : "+monthSum[i].balance+"\n");
			}
		
			var divMenuAno = document.getElementById('TRNnoprint03');
	
			var canvas = document.createElement("canvas");
			canvas.setAttribute("style", "width:510px;height:300px;");
			canvas.setAttribute("width", "510");
			canvas.setAttribute("height", "300");
			divMenuAno.appendChild(canvas);
			var context = canvas.getContext('2d');
			context.strokeStyle = "blue";			
			
			var offset = canvas.width / monthSum.length;
			context.moveTo(0, 0);
			context.lineTo(canvas.width, canvas.height);
			
			
			context.beginPath();
			context.moveTo(i*offset, getDay(monthSum[i].date)-20);
			for(var i=1; i<monthSum.length;i++){
				context.lineTo(i*offset, getDay(monthSum[i].date)-20);
			}
			context.stroke();
});

addButton("Gráfico de todos os meses", function(event){
	alert('NOT IMPLEMENTED');
});
