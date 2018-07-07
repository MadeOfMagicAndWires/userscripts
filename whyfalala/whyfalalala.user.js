// ==UserScript==
// @name           Whyfalalala download gallery
// @namespace      https://github.com/ToostInc/userscripts
// @description    Adds download links to scanlation posts
// @include        https://whyfalalala.wordpress.com/*
// @author         Joost Bremmer < contact@madeofmagicandwires.online >
// @copyright      2018, Joost Bremmer
// @license        MIT
// @version       `0.1
// @date           2108-07-07
// @require        https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// ==/UserScript==

async function getImageBlob(url){
  return fetch(`https://cors-anywhere.herokuapp.com/${url}`).then(function (response) {
    return response.blob();
  });
}


async function getChapterInfo(article){
  let chapter = {};

  if (article.classList.contains("tag-scanlation")) {
    chapter.title = article.getElementsByTagName("h1")[0].innerText;

    if (article.getElementsByClassName("tiled-gallery").length > 0) {
      chapter.images = [];
      let images = Array.from(article.getElementsByTagName("img"));
      for (let img of images) {
        let chapImg = {};

        chapImg.url = img.dataset.origFile;
        chapImg.fileName = `${img.dataset.imageTitle}.${chapImg.url.match(/(\w{3,4})$/g)[0]}`;
        chapter.images.push(chapImg);
      }
    } else {
      chapter.images = null;
    }
    return chapter;
  } else {
    return null;
  }
}

//See https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}



function createElements(article) {
  let container = document.createElement("div");
  let textArea = document.createElement("textarea");
  let downloadButton = document.createElement("a");


  container.classList.add("container");
  textArea.value = "Loading...";
  downloadButton.innerText = "Loading...";

  container.appendChild(textArea);
  container.appendChild(downloadButton);
  if (article.getElementsByClassName("entry-summary").length > 0) {
    article.getElementsByClassName("entry-summary")[0].appendChild(container);
  } else {
    article.getElementsByClassName("entry-content")[0].appendChild(container);
  }


  return container;

}

function createFile(anchor, data, filename) {
  let url = URL.createObjectURL(data);

  anchor.href = url;
  anchor.download = filename;
  anchor.innerText = "Download";
}

async function createZip(chapter) {
  let zip = new JSZip();

  zipCh = zip.folder(chapter.title);
  await asyncForEach(chapter.images, async function(imgObj) {
    await zipCh.file(imgObj.fileName, getImageBlob(imgObj.url));
  });

  return zip.generateAsync({type: 'blob', comment: 'generated by whyfalalala downloader'});
}

let chapters = [];

async function start() {
  console.log("Start!");

  let articles = document.getElementsByTagName("article");

  await asyncForEach(articles, async (article) => {
    chapter = await getChapterInfo(article);
    if (chapter !== null && chapter.images !== null) {
      chapters.push(chapter);

      let container = createElements(article);
      let textArea = container.children[0];

      container.id = `chapter_${chapter.title.replace(' ', '_')}`;

      imageUrls = chapter.images.map((img) => img.url);
      textArea.value = imageUrls.join("\n");

      let chapterZip = await createZip(chapter);
      await createFile(container.children[1], chapterZip, `${chapter.title}.cbz`);
    }

  });
  return 0;
}

start();
