var showLevelData = function (value) {	
	$("#i18nStoryCurrentLevel").html($("#i18nStoryCurrentLevel").html() + " "+ (value - 1));
	$("#i18nStoryCurrentLevelButton .ui-btn-text").html($("#i18nStoryCurrentLevelButton .ui-btn-text").html() + " " + value);	
}

$(document).ready(function() {   
	getGlobalValue("level", showLevelData);	
});