// ==UserScript==
// @name           Fallen London Action Counter
// @namespace      https://github.com/ToostInc/userscripts
// @description    Notifies user when actions have been regained
// @include        /^https?:\/\/(www.)?fallenlondon\.com(\/(login)?)?$/
// @author         Joost Bremmer < contact at made of magic and wires dot online >
// @copyright      2019, Joost Bremmer
// @license        MIT
// @version        1.1
// @date           2019-10-11
// @downloadURL    https://github.com/MadeOfMagicAndWires/userscripts/raw/master/fallen-london-action-counter/fallen-london-action-counter.user.js
// @updateURL      https://github.com/MadeOfMagicAndWires/userscripts/raw/master/fallen-london-action-counter/fallen-london-action-counter.user.js
// @grant          GM_log
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_notification
// @run-at         document-start
// ==/UserScript==

/*
 * Userscript that notifies the user when their actions have refilled
 * Copyright © 2019 Joost Bremmer
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/* global GM_getValue, GM_log, GM_setValue, GM_notification */
"use strict";


let actions = NaN;
let actionBank = NaN;

/* eslint-disable camelcase */

/**
 * Prints debug messages if the verbose flag is set to true
 *
 * @param {String} msg the message to print to the console
 * @return {undefined}
 */
function GM_debug(msg) {
  if(GM_getValue("verbose", false)) {
    GM_log(msg);
  }
}
/* eslint-enable camelcase */

/**
 * updates current action state based on a new action count
 *
 * @param {Number} newActionCount the new amount of actions to be set
 * @param {Number} newActionBank  the new action bank amount to set
 * @return {undefined}
 */
function updateActions(newActionCount, newActionBank) {
  if(actions && actions < newActionCount) {
    // regained actions
    actions = newActionCount;
    if(document.title.match(/^(\(\d{2}\)\s)*/g)) {
      document.title = document.title.replace(/^(\(\d{2}\)\s)*/g, `(${actions}) `);
    } else {
      document.title = `(${actions}) ${document.title}`;
    }
  } else if(actions && actions > newActionCount) {
    // lost actions
    document.title = document.title.replace(/^(\(\d{2}\)\s)*/g, "");
    actions = newActionCount;
  } else {
    // no actions set yet, set the current amount
    actions = newActionCount;
  }

  if(newActionBank) {
    GM_debug(`Setting action bank to ${newActionBank}`);
    actionBank = newActionBank;
  }

  // send desktop notification if the "notify" flag is set to true
  if(actions === actionBank) {
    if(GM_getValue("notify", false)) {
      GM_notification({
        title: "Fallen London Action Counter",
        text:  "Actions have been fully regained",
      });
    }
  }

  GM_debug(`Actions were updated: ${actions}`);

}


/**
 * Called when the DOM state of the action counter has changed; updates internal
 * action count.
 *
 * @param {MutationRecord[]} changes: list of changes to the observed DOM node
 * @param {MutationObserver} spy: the parent MutationObserver that recorded changes
 * @return {undefined}
 */
function getActions(changes, spy) {
  changes.forEach(change => {
    // update action counter if it is updated.
    if (change.type === "characterData" && change.target instanceof Text) {
      updateActions(Number(change.target.wholeText.split("/")[0]));
    } else if(change.type === "childList" && change.addedNodes.length > 0 && change.target.classList.contains("router-example")) {
      // node added
      let actionCounter = document.querySelector(".item .item__value");

      // change observer target to only track action counter
      if(actionCounter) {
        let actionSet = actionCounter.innerText.split("/");

        spy.disconnect();
        spy.observe(actionCounter, {characterData: true, characterDataOldValue: true, subtree: true});
        updateActions(Number(actionSet[0]), Number(actionSet[1]));
      }
    }
  });
}

/**
 * Sets up a MutationObserver to observe the root element
 *
 * @return {undefined}
 */
function setUpObserver() {
  let root = document.getElementById("root");
  let spy = new MutationObserver(getActions);

  spy.observe(root, {characterData: true, subtree: true, childList: true});
}

/**
 * Sets all settings to default if they are not present and sets up
 * MutationObserver
 *
 * @return {undefined}
 */
function main() {
  GM_debug("Start");
  if(GM_getValue("verbose") === undefined || GM_getValue("notify") === undefined) {
    GM_log("First run, setting up default settings");
    GM_setValue("verbose", false);
    GM_setValue("notify", true);
  }
  setUpObserver();
}

document.addEventListener("DOMContentLoaded", main);
