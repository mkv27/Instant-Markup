const Elements = require('./Elements');

var data = "";
var analyser = function analyser (node,i){
	//If data
	//for(let children of node.children){
	if(i==0)
		data="";
	if(node.children || node.children.length == 0)
		for(let key of Object.keys(node.children)){
			if( node.children[key].type == 'tag' ){

				if (node.children[key].name == 'img'){
					data = data + Elements.html.image(node.children[key].attribs.src);
				}else if(node.children[key].name == 'a'){
					data = `${data}<${node.children[key].name} href="${node.children[key].attribs.href}">`;
					analyser(node.children[key]);
					data = `${data}</${node.children[key].name}>`;
				}else{
					data = `${data}<${node.children[key].name}>`;
					analyser(node.children[key]);
					data = `${data}</${node.children[key].name}>`;
				}
			}
			else if( node.children[key].type == 'text' ){ //type text never has children
				data = data + node.children[key].data;
			}
		}

	i++;
	return data;
}

module.exports = analyser;