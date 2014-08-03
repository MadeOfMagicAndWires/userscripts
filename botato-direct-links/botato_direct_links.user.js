// ==UserScript==
// @name           Botato Direct Links
// @namespace      https://github.com/ToostInc/userscripts
// @description    Adds Direct Links to the online reader
// @include        http://www.batoto.net/read/_/*
// @copyright      2014, Joost Bremmer
// @license        MIT
// @version        1.0
// @require        http://code.jquery.com/jquery-latest.min.js
// @grant          GM_addStyle
// ==/UserScript==

$(document).ready (function () {
	
	
	

	//Add various tabs
	var dlinks       = "<div id='dlinks' class='rounded dlinks'>\n" +
	                     "\t<h3>Direct Links:</h3>\n" +
					     "\t<br />\n" +
					   "</div>";
	var dlinksanchor = "<li style='display: inline-block; margin-right: 20px;'>\n" +
	                     "\t<button type='button' id='dlinksanchor'>" +
					          "Direct Links" +
					       "</button>\n" +
					   "</li>";
	
	
	//insert tabs
	$("#read_settings").before(dlinks);
	$("div.moderation_bar li:last-child").before(dlinksanchor);
	
	//style tabs

	GM_addStyle(".dlinks {" +
							  "background-color: #FFFFFF;" +
							  "padding-top: 10px;" +
							  "padding-bottom: 05px;" +
							  "display: none;" +
							  "text-align: center;" +
							  "border-top: 1px solid #CDCDCD;" +
							  "border-top-right-radius:0px;"+ 
							  "border-top-left-radius: 0px;" +
							  "border-bottom: 1px solid #CDCDCD;"+
							  "z-index: 999; position: absolute;" +
							  "width: 100%;"+
							  "left: 0px;"+
							"}"
						 );
	$("#comic_wrap").css("z-index","499")
	

	

	//get image source
	var imgsrc = $("img#comic_page").attr("src");
	var imgsrc = imgsrc.split("/");
		
	//get total amount of pages
	var pages  = $("select#page_select option:last").html();
	var pages = pages.replace(/page./g, '');
		
		
	//insert links into Direct Links div.
	var dlmesg = '<p>\n' +
	                '\tUse "Right-click > Save As" dialogue,' +
				      'or a download manager like ' +
			          '<a href="http://www.downthemall.net/" id="dta">' +
					    'DownThemAll'+
					  '</a> ' +
			          'to save the images.\n' +
	                  '<br />\n'+
			          "If the first link doesn't exist, try the (jpg) one.\n" +
	              '</p>\n' +
	              '<br />\n';
	
	$("#dlinks").append(dlmesg);
	
	for (i = 01; i <= pages; i++) {
		var pageurl = imgsrc.slice(0, 9) + '/img' + zeroPad(i, 6) + '.png';
		var pageurl = pageurl.replace(/\,/g, '/');
		var pageanchor = '<a href="'+ pageurl + '" id="link'+zeroPad(i,2) + '">' +
		                    'Page '+ zeroPad(i, 02) +
					     '</a> | '+
				         '<a href="'+pageurl.replace(/\png$/, 'jpg') + '" ' +
						    'id="link'+zeroPad(i,2) + '">' +
							'(jpg)'+
						 '</a>' +
						 '<br />';
		$("#dlinks").append(pageanchor);
	}
	
	
	
	//event handler click on 'Direct Links' button.
	$("#dlinksanchor").click( function() {
	
		$("#dlinks").slideToggle("slow");
				
	});
	
	

});

function zeroPad(num, numZeros) {
	var n = Math.abs(num);
	var zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
	var zeroString = Math.pow(10,zeros).toString().substr(1);
	if( num < 0 ) {
		zeroString = '-' + zeroString;
	}

	return zeroString+n;
}
