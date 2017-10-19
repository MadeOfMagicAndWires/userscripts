// ==UserScript==
// @name           Youtube Hide Watched
// @namespace      https://github.com/ToostInc/userscripts
// @description    Hides viewed videos from your subscriptions.
// @include        https://www.youtube.com/feed/subscriptions
// @author         Joost Bremmer < toost dot b at gmail dot com >
// @copyright      2014, Joost Bremmer
// @license        MIT
// @version        1.1.3
// @date           19-10-2017
// @downloadURL
// https://rawgit.com/ToostInc/userscripts/master/youtube-hide-watched/youtube-hide-watched.user.js
// @updateURL
// https://rawgit.com/ToostInc/userscripts/master/youtube-hide-watched/youtube-hide-watched.meta.js
// @grant          none
// @runat          document-end
// ==/UserScript==

/**
 * Copyright (c) 2014 Joost Bremmer
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

console.log("Start!");

const viewedVideos=[];

function getWatchedVideos() {
  try {
    console.log("Start async func")

      return new Promise((resolve, reject) => {
        function checkMutation(mutation) {
          if (mutation.target.tagName ===
              "YTD-THUMBNAIL-OVERLAY-PLAYBACK-STATUS-RENDERER") {
            viewedVideos.push(mutation.target);
            if (viewedVideos.length == 1) {
              console.log(viewedVideos);
              resolve(viewedVideos);
            }
          }
        }
        const mutate = new MutationObserver((mutations) => {
          mutations.forEach(mutation => { checkMutation(mutation); });
        });
        Array.prototype.forEach.call(
          document.getElementsByTagName("ytd-thumbnail"),
          (element) => {
            mutate.observe(element, { childList : true, subtree : true }) 
          }
        );
      });
  } catch (e) {
    console.log(e);
    reject(e);
  }
}

async function hideWatched() {
  elements = getWatchedVideos().then(() => {
    console.log(viewedVideos.length);
    viewedVideos.forEach((element) => {
      console.log("hiding this", element);
      element.style.display="none"; 
    });
  });
  console.log(elements.constructor.name.toString());
  console.log(elements.length);
  /* Array.prototype.filter.call(viewedVideos, video => { */
  /* console.log("hideWatched", video, video.style, video.style.width); */
  /* return video.getAttribute("width") === "100%"; */
  /* }); */
}


/* console.log("videolist",document.getElementsByTagName("ytd-section-list-renderer")); */
/* console.log("thumbnail", document.getElementsByTagName("ytd-thumbnail")); */

/*
 * Array.prototype.forEach.call(
 *   document.getElementsByTagName("ytd-thumbnail"), elementToObserve => {
 *     mutate.observe(elementToObserve, { childList : true, subtree : true });
 *   }
 * );
 */


/* TODO: checkbox */

console.log("");
hideWatched();
console.log("End");

/* vim: set ts=2 sts=2 sw=2 et: */
