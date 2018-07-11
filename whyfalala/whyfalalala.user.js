// ==UserScript==
// @name           Whyfalalala download WordPress gallery images
// @namespace      https://github.com/ToostInc/userscripts
// @description    Adds download links to posts containing a gallery
// @include        /^https:\/\/whyfalalala\.wordpress\.com\/(\d{4}\/\d{2}\/\d{2}\/\S*\/(\#more-\d{4})?)?$/
// @author         Joost Bremmer < contact@madeofmagicandwires.online >
// @copyright      2018, Joost Bremmer
// @license        MIT
// @version        0.3
// @date           2018-07-11
// @require        https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// ==/UserScript==

/**
 * @fileOverview A userscript to download (manga) chapters from WordPress based galleries
 * @name whyfalalala
 */


/**
 * String representing the scanlation group.
 * @const
 * @type {String}
 */
const GROUPNAME = "whyfalalala";

/**
 * Enum for the scanlation source
 * @const
 * @enum {String}
 */
const SOURCE = {
  /** Use if the source of the scanlation is from magazine scans */
  MAGAZINE: "mag",
  /** Use if the source of the scanlation is from mixed scans. */
  MIXED: "mix",
  /** Use if the source of the scanlation is from tonkabon scans. */
  VOLUME: "v",
  /** Use if the source of the scanlation is from online sources. */
  WEB: "web",
  /** Use if the source of the scanlation scans are unknown. */
  UNKNOWN: undefined
};



/**
 * @class Chapter
 * @classdec Class representing a chapter.
 * @global
 * @property {String} title              - The title of the chapter, as taken from the post
 * @property {String} fileName           - The filename of the chapter; generated .from the title.
 * @property {?Array.<Object>}  images         - Array of image objects of each image found in post.
 * @porperty {String} images[].url       - The url of where the image resides.
 * @porperty {String} images[].fileName  - The file name to where the image needs to be saved to.
 */
class Chapter{
  /**
   * Creates a Chapter instance.
   * @constructor
   * @param {HTMLElement} post - the root element of a WordPress post; usually <article>
   */
  constructor(post) {
    /** @private  */
    this._post = post;
    /** @private  */
    this._title = post.getElementsByTagName("h1")[0].innerText;
    /** @private  */
    this._fileName = Chapter.madokamiFileName(this, GROUPNAME, SOURCE.VOLUME);
    /** @private  */
    this._images = this.getImages(this._post);
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }

  get fileName() {
    return this._fileName;
  }

  set fileName(fName) {
    this._fileName = fName;
  }

  get images() {
    return this._images;
  }

  set images(post) {
    this._images = this.getImages(post);
  }

  /**
   * Estimates a filename compatible with the Madokami Naming Scheme based on the
   * chapter title.
   * @see {@link https://github.com/Daiz/manga-naming-scheme} for more info.
   *
   * @method Chapter.madokamiFileName
   * @static
   * @param {Chapter} chapter - a Chapter object to base the filename on
   * @param {String}  chapter.title - the title of the chapter
   *
   * @param {String} groupName - the name of the scanlation group to use in the filename
   * @param {SOURCE.Enum} source - the source of the scanlation can be either (mag|mix|v|web)
   *
   * @returns {String} the estimated madokami filename; Still needs to be adjusted slightly
   */
  static madokamiFileName(chapter, groupName=GROUPNAME, source=SOURCE.UNKNOWN){
    let chapterInfo = chapter.title.split(/(^.*?)\s?((volume|v)\s?\d{1,2})?\s?((chapter|ch|c)?\s?\d{1,}-?\d{1,})/gi);

    chapterInfo = chapterInfo.splice(1, chapterInfo.length - 2);

    let seriesTitle = chapterInfo[0];
    let chapterNo = (chapterInfo[3]) ? chapterInfo[3].replace(/(chapter|ch|c)\s?/i, "") : "";
    let sourceStr = null;

    // Deterimine source.
    switch(source) {
    case SOURCE.MAGAZINE:
      sourceStr = "(mag) ";
      break;
    case SOURCE.MIX:
      sourceStr = "(mix) ";
      break;
    case SOURCE.VOLUME:
      sourceStr = chapterInfo[1] ? chapterInfo[1].replace(/(volume|vol|v)\s?/i, "") : "";
      if (sourceStr.length < 2 && sourceStr !== "") { sourceStr = `0${sourceStr}`; } // nullpad
      if (sourceStr !== "") { sourceStr = `(v${sourceStr}) `; } // output: "(v??) "
      break;
    case SOURCE.WEB:
      sourceStr = "(web) ";
      break;
    case SOURCE.UNKNOWN:
      sourceStr = "";
      break;
    default:
      sourceStr = "";
    }

    // Example output: "Giant Killing - c001 (v01) [GROUPNAME]"
    let madokamiStr = `${seriesTitle} - c${chapterNo} ${sourceStr}[${groupName}]`;

    return madokamiStr;
  }

  /**
   * Extracts all images from a Wordpress gallery.
   *
   * @method Chapter#getImages
   * @param {HTMLElement} post - root element of a Wordpress post containing a gallery
   *
   * @returns {?Array.<Object>} - returns an array of Objects or null.
   */
  getImages(post) {
    if ( post.classList.contains("post_format-post-format-gallery") || post.getElementsByClassName("tiled-gallery").length > 0) {
      let images = [];
      let imgElements = Array.from(post.getElementsByTagName("img"));

      for (let img of imgElements) {
        let chapImg = {};

        chapImg.url = img.dataset.origFile;
        chapImg.fileName = `${img.dataset.imageTitle}.${chapImg.url.match(/\.(\w{3,4})(?:($|\?))/)[1]}`;
        images.push(chapImg);
      }
      return images;
    } else {
      return null;
    }
  }

  /**
   * Fetch an image by url and turn it into a Blob object.
   * Uses http://cors-anywhere.herokuapp.com as a porxy because of Same-Origin
   * issues
   *
   * @method Chapter.getImageBlob
   * @static
   * @param {String} url - the url the image resides at.
   * @return {Blob} a Blob object of the fetched image data.
   *
   */
  static getImageBlob(url){
    const proxy = "https://cors-anywhere.herokuapp.com";

    return fetch(`${proxy}/${url}`).then((response) => {
      return response.blob();
    });
  }
}




/**
 * Iterates over objects asynchronously.
 *
 * @function asyncForEach
 * @async
 * @param {Array} array - element to iterate over. Also works with things like HTMLCollections.
 * @param {Function} callback - function to asynchronously call on each iteration.
 * @return {void}
 *
 * @see {@link https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404}
 *
 */
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/**
 * Creates and appends necessary textarea and anchors to an element.
 *
 * @function createElements
 * @param {HTMLElement} post - root element of a Wordpress post, usually <article>
 * @returns {HTMLDivElement} - container of appended elements.
 *
 */
function createElements(post) {
  let container = document.createElement("div");
  let textArea = document.createElement("textarea");
  let downloadButton = document.createElement("a");


  container.classList.add("container");
  textArea.value = "Loading...";
  downloadButton.innerText = "Loading...";
  downloadButton.style = `
    margin: 5px 0;
    display: inline-block;
    background: #f8f8f8;
    padding: 5px 4px;
    border-radius: 5px;
    text-decoration: none;
    border-color: #bbb;
    border-width: 1px;
    border-style: solid;
  `;

  container.appendChild(textArea);
  container.appendChild(downloadButton);

  // append to .entry-summary for blogroll or .entry-content for specific post
  if (post.getElementsByClassName("entry-summary").length > 0) {
    if (post.getElementsByClassName("more-link").length > 0) {
      container.style.paddingBottom = "100px";
    }
    post.getElementsByClassName("entry-summary")[0].appendChild(container);
  } else {
    post.getElementsByClassName("entry-content")[0].appendChild(container);
  }

  return container;
}

/**
 * Links an achor to a Blob"s ObjectURL
 *
 * @function createFile
 * @param {HTMLAnchorElement} anchor - anchor element that will link to the Blob
 * @param {Blob} data - data that will be linked to
 * @param {String} fileName - filename that the data will be saved to.
 * @returns {void}
 *
 */
function createFile(anchor, data, fileName) {
  let url = URL.createObjectURL(data);

  anchor.href = url;
  anchor.download = fileName;
  anchor.innerText = "Download";
}

/**
 * creates a Zip file of a Chapter object with {@link Chapter.images} as the
 * files.
 *
 * @function createZip
 * @async
 * @param {Chapter} chapter - the chapter object to zip.
 * @param {String}  chapter.fileName - the file name of the folder that will be zipped.
 * @param {Array.<Object>} chapter.images - the images that will be zipped
 * @param {String} chapter.images.url - the url where the image resides.
 * @param {String} chapter.images.fileName - the file under which the image data will be zipped
 *
 * @returns {Blob} - data as Blob of the generated Zip file.
 *
 */
async function createZip(chapter) {
  let zip = new JSZip();

  let zipCh = zip.folder(chapter.fileName);

  await asyncForEach(chapter.images, async (imgObj) => {
    await zipCh.file(imgObj.fileName, Chapter.getImageBlob(imgObj.url));
  });

  return zip.generateAsync({type: "blob", comment: `generated by ${GROUPNAME} downloader`});
}

let chapters = [];

/******************************************************************************
* Blog specific stuff starts here.
*
*******************************************************************************/

/**
 * Creates {Chapter} objects from all matching posts on a page and appends Zips to them
 *
 * @function getChapters
 * @async
 * @returns {Number} - returns zero if all went well or -1 if something went wrong.
 */
async function getChapters() {
  let chapterElements = Array.prototype.filter.call(document.getElementsByTagName("article"), (article) => {
    if (article.classList.contains("tag-translation")) {
      return true;
    }
    return false;
  });

  await asyncForEach(chapterElements, async (article) => {
    let chapter = new Chapter(article);

    if (chapter !== undefined && chapter.images !== null) {
      console.log(`Found ${chapter.title}`);
      chapters.push(chapter);

      let container = createElements(article);
      let textArea = container.children[0];

      container.id = `chapter_${chapter.title.replace(" ", "_")}`;

      let imageUrls = chapter.images.map((img) => img.url);

      textArea.value = imageUrls.join("\n");

      let chapterZip = await createZip(chapter);

      await createFile(container.children[1], chapterZip, `${chapter.fileName}.cbz`);
      return 0;
    } else { return -1; }
  });
}

/**
 * initiates script.
 * @returns {void}
 */
async function start() {
  console.log("Start!");
  await getChapters();
}

start();
