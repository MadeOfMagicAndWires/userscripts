// ==UserScript==
// @name           MangaStream Torrent links
// @namespace      https://github.com/ToostInc/userscripts
// @description    Adds Torrent links to the read online pages
// @include        http://www.readms.com/r/*
// @include        http://readms.com/r/*
// @copyright      2010+, Joost Bremmer
// @license        MIT
// @version        1.6
// @require        http://code.jquery.com/jquery-latest.min.js
// @grant          GM_xmlhttpRequest
// @downloadURL    https://rawgit.com/ToostInc/userscripts/master/mangastream-torrent-links/mangastream_torrent_link.user.js
// @updateURL      https://rawgit.com/ToostInc/userscripts/master/mangastream-torrent-links/mangastream_torrent_link.meta.js
// ==/UserScript==


// The MIT License
//
// Copyright (c) 2010 Joost Bremmer
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

$(document).ready (function () {
	

	//Add various tabs

	var torrentsanchor = "&nbsp&nbsp<a href='#' id='Torrentsbtn' class='btn'>Torrents</a>";
	$("div.btn-group:last").after(torrentsanchor);


	//Add direct image links
	$("div.page").attr('id','page');
	var idtest = $("#p").attr('id');
	//console.log("id of #p is "+idtest);
	var imgsrc = $("img#manga-page").attr("src");
	//console.log(imgsrc);
	
	var imgshow = "<div class='subnav pager' id='directlink' style='display: none;"
	               + "border-top: 1px solid #CDCDCD; left: 0px;'>\n\tDirect link:"
				   + "\n\t<br />\n\t"+imgsrc+"</div>"
	$("ul.pager").after(imgshow);
	
	var imganchor="&nbsp&nbsp<div class='btn' id='directlinkbtn'>Direct Link</div>"
	$("#Torrentsbtn").after(imganchor);
	
  $( "#directlinkbtn" ).click(function() {
     $("#directlink").slideToggle("slow")
	 
	});

	var torrents = '<div class="subnav pager" id="results" style="display: none;' + 
	               'border-top: 1px solid #CDCDCD; left: 0px; z-index: 499;' +
				   'padding-bottom: 05px;">\n\t<h2>Torrent:</h2><span '+ 
				   'id="torrentlink">Searching...</span>\n\n</div>'
	$("#directlink").before(torrents);


	//Function for clicking Torrents
	$("#Torrentsbtn").click(function torrents() {


		var title = document.title;

		var title = title.replace(/ -.*/,"");

		var title = title.replace(/'/,"");

		var query = title + " Mangastream"

		var query = query.replace(/\s/g,"+");

		var url = "http://www.nyaa.eu/?page=search&term="+query+
		          "&cat=0&listorder=1&page=search&sort=1"

		//console.log(url);
		
		$("#results").slideToggle("slow");
				
		GM_xmlhttpRequest({
		method: "POST",
		url: url,
		headers:{ "Content-Type": "application/x-www-form-urlencoded" },
		onload: function (response) {
				var raw = response.responseText;
				if (response.responseText.indexOf("No torrents found.") == -1) {
					//console.log(raw);
					if (raw.indexOf("Files in torrent:") == -1) {
						var content=/<td class="tlistdownload">.*?<\/td>/
						            .exec(raw);
						var content=content.toString().replace("www-dl.png", 
						"www-download.png");
						//console.log(content);
						var torrentlink = content.toString();
						//console.log(torrentlink);
					}

					else if (raw.indexOf("Files in torrent:") > -1) {
						//console.log("Single torrent");
						var content = /<div class="viewdownloadbutton">.*?<\/div>/
						              .exec(raw);
						//console.log(content);
						var torrentlink = content.toString();
					}	
						
					//console.log(torrentlink);			
					$("#torrentlink").html(torrentlink);
					
				}

				else if(response.responseText.indexOf("No torrents found.") > -1) {
					var othertitle = title.replace(/'/,"").replace(/\s/g,"+");
					var otherurl  = "http://www.nyaa.eu/?term="+othertitle+
					                "&cats=2_0&listorder=1&page=search&sort=1";
					var otherlink = "No Results Found...Maybe search for <a href='"
					                +otherurl+"' id='otherurl'>other</a> groups?";					
					$("#torrentlink").html(otherlink);
					
				}
			}

		});
		

	});


});
