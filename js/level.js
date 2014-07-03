var levelGlobals = {
	level: 0,
	points: 0,
	minimumPointsNeeded: 0,
	lastPointsHighlight: 0,
	optionsPerQuestion: 4,
	questions: [],
	operators: {
		'+': function(a, b) { return a + b },
		'-': function(a, b) { return a - b },     
		'x': function(a, b) { return a * b },     
		'/': function(a, b) { return a / b },     
	}
}

function endOfTimeCallback() {
	window.history.back();
}

function endOfTime() {	
	if (levelGlobals.points < levelGlobals.minimumPointsNeeded) {
		endOfTimeCallback();
	} else {
		updateGlobalValue("level", levelGlobals.level+1, endOfTimeCallback);
	}	
}

function insertAdition(question) {
	var min = question.min;
	var max = question.max;
	var operands = [question.operands];
	var questionOptions = [levelGlobals.optionsPerQuestion];	
	var possibleOptions = [];	
	var questionOperands = '';
	var result = 0;
	for (var i = 0; i < question.operands; i++) {
		operands[i] = Math.floor((Math.random()*max) + min);		
		if (questionOperands != '') {
			questionOperands += ' ' + question.operation + ' ';
		} 		
		questionOperands += operands[i];
		if (i === 0) {
			result = operands[i];
		} else {
			result = levelGlobals.operators[question.operation](result,operands[i]);
		}		
	}
		
	var okPoints = question.okPoints;
	var badPoints = question.badPoints;
	
	for (var i = 0; i < levelGlobals.optionsPerQuestion; i++) {
		if (i === 0) {
			questionOptions[i] = {"value": result, "html": '<a data-role="button" onclick="addPoints('+okPoints+')">'+result+'</a>'};
			possibleOptions.push(result);
		} else {
			var number = Math.floor((Math.random() * max * i) + min);
			while (possibleOptions.indexOf(number) > -1) {
				number += 1;
			}
			possibleOptions.push(number);
			questionOptions[i] = {"value": number, "html":'<a data-role="button" onclick="addPoints('+badPoints+')">'+number+'</a>'};
		}
	}
	// Sort the array
	questionOptions.sort(function(a,b){return a.value > b.value});	
	
	var titleQuestion = jQuery.i18n.prop(question.title);
	
	// HTML code to insert for adition
	var html='<div id="animateQuestion" class="animateQuestion"><div style="margin-left: auto;margin-right: auto;text-align:center;background-image: url(css/images/blackboard.png);background-size: 100% 100%;max-width:511px;max-height:311px;"><h2>'+titleQuestion+'</h2><h1>'+questionOperands+'</h1></div><div class="ui-grid-a"><div class="ui-block-a">'+questionOptions[0].html+'</div><div class="ui-block-b">'+questionOptions[1].html+'</div></div><div class="ui-grid-a"><div class="ui-block-a">'+questionOptions[2].html+'</div><div class="ui-block-b">'+questionOptions[3].html+'</div></div></div>';
	
	return html;
}

function insertSubstraction(question) {
	var r1 = 1;
	var r2 = 2;
	var okPoints = 10;
	var badPoints = -5;
	
	var option1 = r1+r2-1;
	var option2 = r1-r2;
	var option3 = r1+r2+1;
	var option4 = r1+r2+2;	
	
	var titleQuestion = jQuery.i18n.prop(question.title);
	
	// HTML code to insert for substraction
	var html='<div id="animateQuestion" class="animateQuestion"><div style="margin-left: auto;margin-right: auto;text-align:center;background-image: url(css/images/blackboard.png);background-size: 100% 100%;max-width:511px;max-height:311px;"><h2>'+titleQuestion+'</h2><h1>'+r1+' - '+r2+'</h1></div><div class="ui-grid-a"><div class="ui-block-a"><a data-role="button" onclick="addPoints('+badPoints+')">'+option1+'</a></div><div class="ui-block-b"><a data-role="button" onclick="addPoints('+okPoints+')">'+option2+'</a></div></div><div class="ui-grid-a"><div class="ui-block-a"><a data-role="button" onclick="addPoints('+badPoints+')">'+option3+'</a></div><div class="ui-block-b"><a data-role="button" onclick="addPoints('+badPoints+')">'+option4+'</a></div></div></div>';
	
	return html;
	
}

function insertQuestion() {
	
	var questionIndex = Math.floor(Math.random()*levelGlobals.questions.length);	
	var question = levelGlobals.questions[questionIndex];
	var htmlCode;
	htmlCode = insertAdition(question);
	
	// Insert the code of the question
	$('#question').html(htmlCode); 
	// Reload JQuery content
	$.mobile.activePage.trigger("create");	
}

// def options

var iCms = 1000;    
var aDefOpts = {
	start: new Date(), // now
	finish: new Date().setTime(new Date().getTime() + 60 * iCms), // now + 60 sec
	interval: 100
}

var updateLevelInfo = function(value) {	
	var seconds = value.seconds;
	levelGlobals.minimumPointsNeeded = value.points;
	var difficulty = value.difficulty;	
	aDefOpts.start = new Date(); // now
	aDefOpts.finish = new Date().setTime(new Date().getTime() + seconds * 1000); // now + 60 sec
    $("#score").html('<h1 id="scoreLabel">' + levelGlobals.points + '/' + levelGlobals.minimumPointsNeeded + '</h1>');        
}

var showLevelData = function(value) {	
	levelGlobals.level = value;
	$("#levelTry").html('<h1 id="level">'+ value +'</h1>');	
	dbGetLevelInfo(value, updateLevelInfo);	
}

function updatePointsClass() {
	if (new Date() - levelGlobals.lastPointsHighlight >= 1000) {
		$("#scoreLabel").removeClass('ok');
		$("#scoreLabel").removeClass('bad');
	}
}

$(document).ready(function() {    
	getGlobalValue("level", showLevelData);	  
	getGlobalValue("language", readQuestions);	  	

	var iDuration = aDefOpts.finish - aDefOpts.start;

	// looping process
	var vInterval = setInterval(
		function(){
			var iLeftMs = aDefOpts.finish - new Date(); // left time in MS				
			var iSec = parseInt(iLeftMs / iCms); // elapsed seconds
							
			// in case of Finish
			var timerClass='';
			if (iLeftMs < 1000) {
				clearInterval(vInterval);
				endOfTime();                      
			} else if (iLeftMs < 10000) {
				timerClass = 'bad';
			}
			
			updatePointsClass();
			
			$("#dateTimer").html('<h1 id="time" class="'+timerClass+'">'+ iSec +'</h1>');							
		} ,aDefOpts.interval
	);
							
	
	
});  

function addPoints(questionPoints) {			
	levelGlobals.points += questionPoints;	
	// Check that this number is greater or equal 0
	levelGlobals.points = levelGlobals.points < 0 ? 0 : levelGlobals.points;
	var objectClass='ok';
	if (questionPoints < 0) {
		objectClass='bad';
	}
	$("#score").html('<h1 id="scoreLabel" class="'+objectClass+'">' + levelGlobals.points + '/' + levelGlobals.minimumPointsNeeded + '</h1>');
	levelGlobals.lastPointsHighlight = new Date();
	insertQuestion();	
}

function skipQuestion() {
	insertQuestion();
}

function readQuestions(language) {
	$.getJSON("json/document.json", function(data) {
		var level = 'level' + levelGlobals.level ;
		var questionsSet = data[level];
		levelGlobals.questions = jLinq.from(questionsSet).select();			
		insertQuestion();	
	});
}