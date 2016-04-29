const version = require('../package.json').version;
var jsonld = require('./jsonld');

function handleUrlRequest(url){
	jsonld(url);
	return false;
}

function executeOnLoad(){
	document.getElementById("footer").innerHTML = 'Mac OSX '+version;
}

var app = {
	jsonld: handleUrlRequest,
	executeOnLoad: executeOnLoad
}

module.exports = app;