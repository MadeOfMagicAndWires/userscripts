// ==UserScript==
// @name           Youtube Hide Watched
// @namespace      https://github.com/ToostInc/userscripts
// @description    Hides viewed videos from your subscriptions.
// @include        https://www.youtube.com/feed/subscriptions
// @author         Joost Bremmer < toost dot b at gmail dot com >
// @copyright      2014, Joost Bremmer
// @license        MIT
// @version        1.1.3
// @date           15-10-2017
// @downloadURL    https://rawgit.com/ToostInc/userscripts/master/youtube-hide-watched/youtube-hide-watched.user.js
// @updateURL      https://rawgit.com/ToostInc/userscripts/master/youtube-hide-watched/youtube-hide-watched.meta.js
// @grant          none
// ==/UserScript==


// Copyright (c) 2014 Joost Bremmer
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

document.addEventListener("DOMContentLoaded", event => {
    console.log("Prestart");
    main();
});

function main(){
    console.log("Start!");

    let viewedVideos = document.querySelectorAll('#progress[style="width: 100%;"]');
    if (viewedVideos.length <= 0) {
        return -1;
    } else {
        console.log(viewedVideos);
    }
};
