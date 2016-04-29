/**
    * Instant Markup v0.1.0-alpha
    *
    * Copyright (c) 2016 mkv27
    * MIT Licensed
 */

const request = require('request');
const fs = require('fs');
const cheerio = require('cheerio');
const endOfLine = require('os').EOL;
const moment = require('moment');

//Electron
const clipboard = require('electron').clipboard;
const NotificationCenter = require('node-notifier').NotificationCenter;
const dock = require('electron').remote.app.dock;

//Transform
const elements = require('./Elements');


moment.updateLocale('es',{
    months: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
});


// Facebook Instant Article basic markup template
// DEVENV
if (process.resourcesPath.indexOf("electron-prebuilt") == -1)
    var iamarkup_template = fs.readFileSync( process.resourcesPath + '/app/src/jsonld/template.html', 'utf8' );
else
    var iamarkup_template = fs.readFileSync('./src/jsonld/template.html', 'utf8');


var jsonld_exec = function(url){
    
    var url_user = url;

    request(url_user, function(error, response, body){
                
        if(!error && response.statusCode == 200){

            var data = body;
            //url_canonical without trailing slash
            var url_canonical = url_user.replace(/\/$/, "");

            /**
             * Get data from url given
             */
            $ = cheerio.load(data);

            var jsonld = JSON.parse( $('script[type="application/ld+json"]').text() );

            var jsoniafb = JSON.parse( $('script[type="application/ia+fb"]').text() );
            
            var web_title = jsonld.headline,
            web_image_featured = jsonld.image.url,
            web_author = jsonld.author.name,
            web_kicker = jsonld.description,
            web_time = jsonld.dateModified;

            var web_time_format = moment(web_time).format('MMMM D[,] Y hh[:]mm a');
            $ = cheerio.load(jsoniafb.content);
            var web_content = $('p');

            /**
             * Write data in fbai template
             */
            $ = cheerio.load(iamarkup_template);

            $('link[rel="canonical"]').attr("href",url_canonical);
            $('head title').html(web_title);
            $('header figure img').attr("src",web_image_featured);
            $(".op-kicker").html(web_kicker);
            $(".op-published,.op-modified").attr("dateTime",web_time).html(web_time_format);
            $("address").html(web_author);

            var parray = [];
            $(web_content).each(function(i, elem) {
                //console.log(elem.children[0].name);
                if(elem.children[0].type == 'tag' && elem.children[0].name == 'iframe'){
                    parray[i] = elements.html.socialembed($(this).html());
                }else{
                    parray[i] = `<p>${$(this).html()}</p>`;
                } 
            });
            parray = endOfLine + endOfLine + parray.join(endOfLine+endOfLine);

            $("header").after(parray);

            clipboard.writeText($.html());
            
            //unscape webtitle
            var un_escape = document.createElement('textarea');
            un_escape.innerHTML = web_title;
            web_title = un_escape.value;

            var notifier = new NotificationCenter();
            notifier.notify({
                'title': 'Instant Markup: ' + web_title,
                'message': 'El código de tu Instant Article se ha copiado al portapapeles.',
                'open': 'https://www.facebook.com/DiarioAltavoz/publishing_tools/?section=INSTANT_ARTICLES', // URL to open on Click
                'wait': true,
                'sound': 'Purr'
            });
            dock.setBadge('\u25CF');
        }
    });
}

module.exports = jsonld_exec;