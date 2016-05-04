const Elements = require('./Elements');
const $ = require('cheerio');

var data = "";
var analyzer = function analyzer (node,i){
	//If data
	//for(let children of node.children){
	if(i==0)
		data="";
	if(node.children || node.children.length == 0)
		for(let key of Object.keys(node.children)){
			if( node.children[key].type == 'tag' ){

				if ( node.children[key].name == 'img' ){
					data = data + Elements.html.image(node.children[key].attribs.src);
				}else if ( node.children[key].name == 'iframe' ){
					let tmp = $.html(node.children[key]);
					data = data + Elements.html.socialembed(tmp);
				}else if(node.children[key].name == 'a'){
					data = `${data}<${node.children[key].name} href="${node.children[key].attribs.href}">`;
					analyzer(node.children[key]);
					data = `${data}</${node.children[key].name}>`;
				}else{
					data = `${data}<${node.children[key].name}>`;
					analyzer(node.children[key]);
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

function Transformer(node,i){
	let data = analyzer(node,i);
	console.log(data);

	if( $('iframe',data).length > 0 ){
		let tmp = $('iframe',data);
		data = $.html(tmp);
	}else if( $('figure',data).length > 0 ){
		let tmp = $('figure',data);
		data = $.html(tmp);
	}else{
		data = `<p>${data}</p>`;
	}

	return data;

}

module.exports = Transformer;