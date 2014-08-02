// ==UserScript==
// @name        Foolslide Download Links
// @namespace   https://github.com/ToostInc/userscripts
// @description Adds Download Links to Foolslide reader links on a (front) page
// @include     http://akashiscans.com/
// @copyright   2014, Toost Inc.
// @license     MIT
// @version     2
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       none
// ==/UserScript==

$(document).ready (function () {

    //Start!

    $("div.entry-content > p > a[href^='http://reader']").attr("id", "readerlink");

    $("#readrlink").attr("title", "test")

    $("div.entry-content > p > a[href^='http://reader.']").each(function (i) {

        var readlink = $(this).attr('href');
	var downloadlink = readlink.replace(/\/read\//g, "\/download\/");
	var downloadlink = downloadlink.replace(/page\/1$/, "");
	var download = " | <a href='"+downloadlink+"'>Download</a>";
	//console.log(download);
	$(this).after(download);
	

    });

});
