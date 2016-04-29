const Menu = require('menu');  
const template = require('../menus/darwin.json');
var menuTemplate = template.menu;

/*
 * Menu helpers
 */
var helpers = {
	forEachMenuItem: function(menuObject,callback){
		for(let keymenu of Object.keys(menuObject)){
			for(let keyitem of Object.keys(menuObject[keymenu].submenu)){
				callback(
					keymenu,
					keyitem,
					menuObject[keymenu].submenu[keyitem]
				);
			}
		}
	}
}

/**
 * Template refactor for command key
 * 'command' {String} Trigger click function
 */

var transformCommandTemplate = function(templateObject){
	helpers.forEachMenuItem(templateObject,function(keymenu,keyitem,item){
		if( item.command && item.command.startsWith('application:') ){
			if( item.command.split(":")[1] == 'click' ){
				menuTemplate[keymenu].submenu[keyitem].click = function(){app.quit();}
				delete menuTemplate[keymenu].submenu[keyitem].command;
			}
		}
	})
}

module.exports = () => {
	transformCommandTemplate(menuTemplate);
	Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}