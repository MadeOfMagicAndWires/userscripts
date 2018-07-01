"use strict";

/*
 * update html
 */
function updateLinks(anchors = []) {
  let linksText = document.getElementById("linksText");
  let links = anchors.map((anchor) => decodeURIComponent(anchor.href));

  linksText.innerHTML = links.sort().join("\n");
}

/*
 * Recursively parse download links from a page.
 *
 * Returns an Array containing anchor elements of download links
 */
function parsePage(page, anchors = []) {

  /*
   * Make an XMLHttpRequest
   */
  function makeRequest (method = "GET", href) {

    let xhr = new XMLHttpRequest();

    xhr.open(method, href, true);
    xhr.responseType = "document";
    xhr.onload = function() {
      parsePage(this.responseXML, anchors);
      updateLinks(anchors);
    };
    xhr.onerror = function () {
      console.error("failed with" , this.status , xhr.statusText);
    };
    xhr.send();
  }

  let re = /^https?:\/\/.*(?!(reader).)*(\.cbr|\.cbz|\.rar|\.zip)$/;

  Array.prototype.forEach.call(page.getElementsByTagName("a"), (anchor) => {
    if (anchor.href.startsWith(window.location.href) && re.test(anchor.href)) {
      anchors.push(anchor);
    } else if (anchor.href.startsWith(page.URL) && anchor.innerText.endsWith("/") && !(anchor.href === page.URL)) {
      makeRequest("GET", anchor.href, anchors);
    }
  });
  return anchors;
}

function getDownloads() {
  let downloadAnchors = parsePage(document, []);

  return downloadAnchors.map((anchorElement) => decodeURIComponent(anchorElement.href));
}


/*
 * Create a file containing data
 */
function createFile(data) {
  let file = new Blob([data], {"type": "text/plain"});

  return URL.createObjectURL(file);
}

/*
 * Create new DOM elements and fill them in
 */
function initElements() {
  let indexContainer = document.getElementsByClassName("table-outer");
  let linksContainer = document.createElement("div");
  let linksText = document.createElement("textarea");

  linksText.setAttribute("style", "min-width: 100%; margin: 30px 0; min-height: 400px");
  linksText.id = "linksText";
  indexContainer[0].appendChild(linksContainer).appendChild(linksText);

  let links = getDownloads();

  linksText.innerHTML = links.sort().join("\n");

  let fileLink = document.createElement("a");

  fileLink.classList.add("button");
  fileLink.innerText = "Download to file";
  fileLink.download = "urls";
  fileLink.addEventListener("click", () => { fileLink.href = createFile(linksText.value); });

  linksContainer.appendChild(fileLink);
}

initElements();

