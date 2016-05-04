const ifembed = require('./Embeds');

module.exports.html = {
	image(src){
		return `<figure><img src="${src}" /></figure>`;
	},
	socialembed(iframe){
		if( ifembed(iframe) )
			return `
				<figure class="op-social">${iframe}</figure>
			`;
		else
			return '';
	}

};