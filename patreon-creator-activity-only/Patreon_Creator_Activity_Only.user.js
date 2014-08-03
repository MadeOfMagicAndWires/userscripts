// ==UserScript==
// @name        Patreon Creator Activity Only
// @namespace   https://github.com/ToostInc/userscripts
// @description Hides non-creator comments on a projects Activity page
// @include     http://www.patreon.com/*?ty=a
// @version     1
// @copyright   2014, Joost Bremmer
// @licence     MIT
// @grant       none
// @require     http://code.jquery.com/jquery-latest.min.js
// ==/UserScript==


$(document).ready (function() {

  //inserting checkbox
  var buttan = "<div id='ipressbuttan' class='double box' width='300px' style='background:#ffffff;'><input type='checkbox' id='buttan' checked='checked'>Hide non-creator posts</input></div>";
  $("div#inline-post").after(buttan);

  //adding id to creatorposts and marking them clearly
  var creatorurl = location.href.replace(/\?.*/g, "");
  $("div.box .boxExtra .infoDiv .info a").each(function(){
    
    if ( $(this).attr("href") == creatorurl ) {
      $(this).append("&nbsp<img src='http://www.patreon.com/images/patreon_tab.png' width='16' height='16' />").attr("id", "creator");      
    } 
  })
  

  
  
  
  $("#buttan").change(function() {
    if ($(this).prop("checked") ) {
      //console.log("Hide Comments Checked.");
      hideComments();
    }
    else {
      //Show Comments
      console.log("Hide Comments Unchecked.")
      showComments();
    }
  });


});

function hideComments() {

  //for each comment, check if it's a creator's post (or in-line comment box), if not, hide it.
  $("div.box .boxExtra .infoDiv .info a").each( function() {
    
    //console.log($(this).attr("id"));
    
     
    if ( $(this).attr("id") != "creator" )  {
      //console.log("This post will be hidden");
      $(this).parents("div.box").hide(400);
    }

    
  })

  console.log("Comments hidden.");
}

function showComments() {
  $("div.box").show(400);
  console.log("Other Comments shown.")

}
