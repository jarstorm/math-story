var updateConfigCallback = function () {
	window.history.back();
}

function updateConfig() {
	var selectedLanguage = $("#languageSelect").val();
	updateGlobalValue("language", selectedLanguage, updateConfigCallback);
}

var updateLanguageCombo = function(value) {
	$("#languageSelect option[value=" + value +"]").attr("selected","selected") ;
	$("#languageSelect").selectmenu('refresh', true);
}

getGlobalValue("language", updateLanguageCombo);	