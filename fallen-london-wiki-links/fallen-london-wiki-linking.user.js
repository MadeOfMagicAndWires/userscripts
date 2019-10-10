// ==UserScript==
// @name        Fallen London - Wiki Linking
// @namespace   fallenlondon/wiki
// @description Adds Fallen London Archives wiki links to storylet titles and options.
// @author      Travers & MadeOfMagicAndWires
// @include     /^https:\/\/(www\.)?fallenlondon\.com(\/(login)?)?$/
// @match       https://www.fallenlondon.com/
// @version     2.7
// @date        2019-10-11
// @grant       none
// @grant       GM_log
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-start
// ==/UserScript==

/* global GM_getValue, GM_log, GM_setValue */
"use strict";

/**
 * Prints debug messages if the verbose flag is set to true
 *
 * @param {String} msg the message to print to the console
 * @return {undefined}
 */
/* eslint-disable camelcase */
function GM_debug(msg) {
  if(GM_getValue("verbose", false)) {
    GM_log(msg);
  }
}
/* eslint-enable camelcase */

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
      // GM_debug( `Adding link for: ${header.innerText}`);
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
    GM_debug(`Found ${storylets.length} storylets.`);

    // GM_debug("Inserting links");
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
 * @return {undefined}
 **/
function onChangeObserved(changes) {
  changes.forEach((change) => {
    // Node added
    if(change.type === "childList" && change.addedNodes.length > 0) {
      if( change.target.classList.contains("router-example") || change.target.classList.contains("tab-content__bordered-container")) {
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
  GM_debug("Setting up observer");
  let root = document.getElementById("root");

  if(root !== null) {
    let peeper = new MutationObserver(onChangeObserved);

    peeper.observe(root, {attributes: false, childList: true, subtree: true});
  }
}

function main() {
  GM_debug("Start");
  if(GM_getValue("verbose") === undefined) {
    GM_log("First run, setting up default settings");
    GM_setValue("verbose", false);
  }
  setUpObserver();
}

// start script as soon as the initial DOM Content has loaded.
document.addEventListener("DOMContentLoaded", main);

// vim: set tw=80 ts=2 sts=2 sw=2 et :
