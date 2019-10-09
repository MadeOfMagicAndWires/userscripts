// ==UserScript==
// @name        Fallen London - Wiki Linking
// @namespace   fallenlondon/wiki
// @description Adds Fallen London Archives wiki links to storylet titles and options.
// @author      Travers & MadeOfMagicAndWires
// @include     /^https:\/\/(www\.)?fallenlondon\.com\/?$/
// @match       https://www.fallenlondon.com/
// @version     2.2
// @date        2019-10-09
// @grant       none
// @run-at      document-start
// ==/UserScript==

"use strict";

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
      link.style.color = "#282520";
      link.innerText = name;

      header.replaceChild(link, header.childNodes[0]);
    });

  }
}

/**
 * Finds storlet and branch elements in page and tries to insert links into them
 *
 * @param {HTMLElement} container parent element containing stoylets or branch options
 * @return {undefined}
 **/
function linkStorylets(container) {
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

/**
 * Observes changes for content for added children which contain storylets
 *
 * @param {MutationRecord[]} changes DOM changes to root element observed by
 *                                   MutationObserver
 * @param {MutationObserver} peeper  MutationObserver that observed the changes
 *
 * @return {undefined}
 **/
function onChangeObserved(changes, peeper) {
  changes.forEach((change) => {
    // Node added
    if(change.type === "childList" && change.addedNodes.length > 0) {

      // root element now has tab-content; change observation target
      if(change.target.id === "root") {
        let container = change.addedNodes[0];

        console.log("changing observer target");
        peeper.disconnect();
        peeper.observe(container, {attributes: false, childList: true, subtree: true }, linkStorylets);
      } else if( change.target.classList.contains("router-example") || change.target.classList.contains("tab-content__bordered-container")) {
        // storylet parent has been updated; try to look for Storylet elements
        linkStorylets(change.addedNodes[0]);
      }
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
  let root = document.getElementById("root");

  if(root !== null) {
    let peeper = new MutationObserver(onChangeObserved);

    peeper.observe(root, {attributes: false, childList: true, subtree: false});
  }
}

// start script as soon as the initial DOM Content has loaded.
console.log("Start");
document.addEventListener("DOMContentLoaded", setUpObserver);

// vim: set tw=80 ts=2 sts=2 sw=2 et :
