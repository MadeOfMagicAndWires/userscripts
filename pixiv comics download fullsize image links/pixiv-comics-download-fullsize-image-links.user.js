
// See https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}


function getFullSizeImageURL(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.open("GET", url);
    xhr.responseType = "document";

    xhr.onload = () => {
      if (xhr.readyState === xhr.DONE && xhr.status === 200) {
        let imgUrl = xhr.responseXML.images[0].src;

        resolve(imgUrl);
      } else {
        console.log("response was error", xhr.status);
        reject(null);
      }
    };
    xhr.send();
  });
}

async function start() {

  let imgBaseURL = null;
  let fullSizeAnchors = document.querySelectorAll("div.item-container > a:nth-child(2)");
  let imgUrls = [];


  async function handleAnchor(fullSizeAnchor, anchorIndex) {
    let imageUrl = null;

    if (!imgBaseURL) {
      let url = fullSizeAnchor.href;

      imageUrl = await getFullSizeImageURL(url);
      imgBaseURL = imageUrl;
    } else {
      imageUrl = imgBaseURL.replace(/p\d/g, `p${anchorIndex}`);
    }

    // console.log(`getFullSizeImageURL: ${imageUrl}`);
    if (imageUrl) {
      imgUrls.push(imageUrl);
      let downloadAnchor = document.createElement("a");
      let downloadAnchorImg = document.createElement("img");

      // TODO: download attribute doesn't work with files from a different domain on firefox
      downloadAnchor.href = imageUrl;
      downloadAnchor.download = imageUrl.split("/").pop().split(".")[0];
      downloadAnchor.classList.add("full-size-container");
      downloadAnchorImg.src = "https://s.pximg.net/www/images/icon/upload-icon.svg";
      downloadAnchorImg.style.filter = "grayscale(100)";
      downloadAnchorImg.style.transform = "rotate(180deg)";

      downloadAnchor.appendChild(downloadAnchorImg);
      fullSizeAnchor.parentNode.appendChild(downloadAnchor);
      fullSizeAnchor.nextElementSibling.style.margin = "5px 5px 5px 0";
    }
  }

  await asyncForEach(fullSizeAnchors, handleAnchor);

}
start();
