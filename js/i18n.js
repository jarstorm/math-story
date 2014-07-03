var updateAppLanguage = function(value) {	
	jQuery.i18n.properties({
		name:'messages', 
		path:'i18n/', 
		mode:'both',
		// Get the language from the navigator
		language: value, 
		callback: function() {
			$(".i18n").each(function( index ) {
				if ($(this).find(".ui-btn-text").length != 0) {
					$(this).find(".ui-btn-text").html(jQuery.i18n.prop($(this).attr('id')));						
				} else {
					$(this).html(jQuery.i18n.prop($(this).attr('id')));						
				}
			});        
		}
	});
};


jQuery(document).ready(function() {	
	getGlobalValue("language", updateAppLanguage);
});	