// ==UserScript==
// @name           MAL Hover Info
// @namespace      https://github.com/ToostInc/userscripts
// @description    Adds hovering info boxes like on the Top Anime/Manga pages 
// @include        http://myanimelist.net/shared.php*
// @include        http://myanimelist.net/sharedmanga.php*
// @include        http://myanimelist.net/profile/*
// @exclude        http://myanimelist.net/topanime.php
// @exclude        http://myanimelist.net/topmanga.php
// @copyright      2010+, Joost Bremmer
// @license        MIT 
// @version        0.7
// @require        http://code.jquery.com/jquery-latest.min.js
// @require        http://code.jquery.com/jquery-migrate-1.2.1.js
// @require        http://cdn.myanimelist.net/js/hover.v5.js
// @grant          none
// ==/UserScript==

$(document).ready (function () {

	//Check if @require's are loaded
	if (typeof showInfo == undefined) {

		console.log("hover.v4.js is NOT loaded");


	}
	
	else if (typeof showInfo != undefined) {
		console.log("hover.v4.js is loaded");

	

		$('a[href*="/anime/"]').addClass('hoverinfo_trigger').each( function () {
	
			var href= $(this).attr("href");
			var href= href.split("/");
			var divrel=  "a"+href[2];
			var divinfo= "info"+href[2];
			var divid=   "area"+href[2];
			var arel=    "#"+divinfo;
			var aid=     "#"+divid;
			var div=  '<div id="'+divid+'" >\n\t<div id="'+divinfo+'" class="hoverinfo"'
			      +   'rel="'+divrel+'" > </div>\n</div>'
			$(this).attr('rel',arel).attr("id",aid).before(div);
		
		});

		$('a[href*="/manga/"]').addClass('hoverinfo_trigger').each( function () {
	
			var href= $(this).attr("href");
			var href= href.split("/");
			var divrel=  "m"+href[2];
			var divinfo= "info"+href[2];
			var divid=   "area"+href[2];
			var arel=    "#"+divinfo;
			var aid=     "#"+divid;
			var div=  '<div id="'+divid+'" >\n\t<div id="'+divinfo+'" class="hoverinfo"' 
			      +   'rel="'+divrel+'" > </div>\n</div>'
			$(this).attr('rel',arel).attr("id",aid).before(div);
		
		});




		$('a.hoverinfo_trigger').hoverIntent({
		   sensitivity: 1, // number = sensitivity threshold (must be 1 or higher)
		   interval: 300, // number = milliseconds for onMouseOver polling interval
		   over: showInfo, // function = onMouseOver callback (required)
		   timeout: 300, // number = milliseconds delay before onMouseOut
		   out: hideInfo // function = onMouseOut callback (required)
		});

	};

});
