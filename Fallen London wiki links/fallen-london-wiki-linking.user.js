// ==UserScript==
// @name        Fallen London - Wiki Linking
// @namespace   fallenlondon/wiki
// @description Adds Fallen London Archives wiki links to storylet titles and options.
// @author      Travers & MadeOfMagicAndWires
// @include     /^https:\/\/(www\.)?fallenlondon\.com\/?$/
// @match       https://www.fallenlondon.com/
// @version     2.0
// @date        2019-10-09
// @grant       none
// @run-at      document-start
// ==/UserScript==

"use strict";

this.root = null;
this.peeper = undefined;
this.container = null;

/**
 * Encodes strings to wikia compatible url naming scheme
 * @param {String} s: string to encode
 * @return {String} encoded stirng
 **/
function encodeLink(s) {
  // Example: An Island with Secrets?  --->  An_Island_with_Secrets%3F
  s = s.replace(/ /g,"_");
  s = encodeURIComponent(s);
  return s;
}

/**
 * Inserts links to relevant wikia page into storylet headers
 *
 * @param {HTMLCollection} elements storylet header elements to add links to
 * @return {undefined}
 **/
function insertLink(elements) {
  if (elements.length > 0) {

    Array.prototype.forEach.call(elements, header => {
      // console.log( `Adding link for: ${header.innerText}`);
      let name = header.innerText;
      let link = document.createElement("a");

      link.href = `https://fallenlondon.wikia.com/wiki/ ${encodeLink(name)}`;
      link.style.color = "#000";
      link.innerText = name;

      header.replaceChild(link, header.childNodes[0]);
    });

  }
}

/**
 * Called by MutationObserver; finds storlet and branch elements in page and insert links into them
 *
 * @param {MutationRecord[]} changes DOM changes observed by MutationObserver
 * @return {undefined}
 **/
function linkStorylets(changes) {

  changes.forEach(change => {
    if(change.addedNodes.length > 0 && (change.target.classList.contains("router-example") || change.target.classList.contains("tab-content__bordered-container"))) {
      let container = change.addedNodes[0];
      let storylets = container.getElementsByClassName("media");

      if(storylets.length === 0) {
        storylets = container.getElementsByClassName("media__body");
      }

      if(storylets.length > 0) {
        console.log(`Found ${storylets.length} storylets.`);

        // console.log("Inserting links");
        Array.prototype.forEach.call( storylets, (storylet) => {
          insertLink(storylet.getElementsByTagName("H1"));
          insertLink(storylet.getElementsByTagName("H2"));
          insertLink(storylet.getElementsByTagName("H5"));
        });
      }
    }
  });

}

/**
 * Finds the storylet container and resets the MutationObserver to observe that,
 * instead of the currently observed root element
 *
 * @param {MutationRecord[]} changes DOM changes to root element observed by
 *                                   MutationObserver
 * @param {MutationObserver} peeper  MutationObserver that observed the changes
 *
 * @return {undefined}
 **/
function setMain(changes, peeper) {
  changes.forEach((change) => {
    if(change.type === "childList" && change.addedNodes.length > 0) {
      let container = change.addedNodes[0];

      console.log("changing observer target");
      peeper.disconnect();
      peeper = new MutationObserver(linkStorylets);
      peeper.observe(container, {attributes: false, childList: true, subtree: true }, linkStorylets);
    }
  });
}


/**
 * Sets up initial MutationObserver to observe the root element, until the
 * storylet container has been loaded.
 *
 * @return {undefined}
 **/
function setUpObserver() {
  console.log("Setting up observer");
  this.root = document.getElementById("root");

  if(this.root !== null) {
    console.log(this.root);
    this.peeper = new MutationObserver(setMain);
    this.peeper.observe(this.root, {attributes: false, childList: true, subtree: false});
  }
}

// start script as soon as the initial DOM Content has loaded.
console.log("Start");
document.addEventListener("DOMContentLoaded", setUpObserver);

// vim: set tw=80 ts=2 sts=2 sw=2 et :
