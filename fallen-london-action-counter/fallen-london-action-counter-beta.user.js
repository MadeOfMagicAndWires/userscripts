// ==UserScript==
// @name           Fallen London Action Counter Beta
// @namespace      https://github.com/ToostInc/userscripts
// @description    Notifies user when actions have been regained
// @include        /^https?:\/\/(www.)?fallenlondon\.com(\/(login)?)?$/
// @author         Joost Bremmer < contact at made of magic and wires dot online >
// @copyright      2019, Joost Bremmer
// @license        MIT
// @version        2.0
// @date           2019-10-11
// @downloadURL    https://github.com/MadeOfMagicAndWires/userscripts/raw/master/fallen-london-action-counter/fallen-london-action-counter.user.js
// @updateURL      https://github.com/MadeOfMagicAndWires/userscripts/raw/master/fallen-london-action-counter/fallen-london-action-counter.user.js
// @grant          GM_log
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @run-at         document-end
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

/* global GM_getValue, GM_log, GM_setValue, GM_xmlhttpRequest*/
"use strict";


/* eslint-disable camelcase */

/**
 * Prints debug messages if the verbose flag is set to true
 *
 * @param {String} msg the message to print to the console
 * @return {undefined}
 */
function GM_debug(msg) {
  const config = GM_getValue("config", null);
  console.log(config);

  if(config && config.verbose) {
    GM_log(msg);
  }
}


async function getAuthorizationToken(response) {
  if(response.status === 200) {
    let jsonResponse = await JSON.parse(response.responseText);

    if(jsonResponse.jwt) {
      GM_debug(`Found Authorization bearer: ${jsonResponse.jwt}`);
      return jsonResponse.jwt;
    } else {
      return null;
    }
  } else if (response.status === 401) {
    alert("Failed to log in; credentials were not correct");
  } else {
    alert(`Failed to log in: status code ${response.status}`);
  }
}

async function getAuthorizationError(response) {
  GM_debug(`Failed to log in: status code ${response.status}`);
}

async function getCredentials() {
  GM_xmlhttpRequest({
    "url" : "https://api.fallenlondon.com/api/login",
    "method" : "POST",
    "headers":  {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    "data" : JSON.stringify({
      "email": await window.prompt("Please provide account e-mail", ""),
      "password": await window.prompt("Please provide password", "")
    }),
    "onload": getAuthorizationToken,
    "onerror": getAuthorizationError
  });
}

function setUpConfig() {
  let config = GM_getValue("config", null);
  let configChanged = false;

  if(config === null) {
    GM_log("First run, setting up default settings");

    config = { "verbose" : false };
  }
  if(!config.users) {
    getCredentials();
  }

  if(configChanged) {
    GM_setValue("config", config);
  }
}

/**
 * Sets all settings to default if they are not present and sets up
 * MutationObserver
 *
 * @return {undefined}
 */
function main() {
  GM_debug("Start");
  setUpConfig();
}

main();
