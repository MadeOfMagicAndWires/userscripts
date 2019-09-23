/**
 * Called when fullscreen mode is changed; adds scrollbar to reader and changes toggle button style
 * @return {undefined}
 */
function fullscreenModeChangedListener() {

  console.log("Fullscreen mode changed!");

  let reader = document.getElementsByClassName("reader-main")[0];
  let btn = document.getElementById("fullscreenBtn");

  if(document.fullscreenElement) {
    reader.style.overflowY = "auto";

    if(btn) {
      btn.classList.remove("fa-expand");
      btn.classList.add("fa-compress");
      btn.style.marginRight = "5px";
    }
  } else {
    reader.style.overflow = "";

    if(btn) {
      btn.classList.remove("fa-compress");
      btn.classList.add("fa-expand");
      btn.style.marginRight = "20px";

    }
  }
}

/**
 * Insert fullscreen toggle button
 *
 * @param {HTMLElement} reader the root element of the reader
 * @return {undefined}
 **/
function insertBtn(reader) {

  // create fullscreen trigger element
  let btn = document.createElement("span");

  btn.id = "fullscreenBtn";
  btn.classList.add("fas");
  btn.classList.add("fa-expand");

  // custom styling for trigger
  btn.style.position = "fixed";
  btn.style.zIndex = 99;
  btn.style.minWidth = "50px";
  btn.style.minHeight = "50px";
  btn.style.top = "0px";
  btn.style.right = "0px";
  btn.style.cursor = "pointer";
  if(document.querySelector(".navbar.d-none")) {
    btn.style.margin = "5px 20px 0 0";
  } else {
    btn.style.margin = "2.51rem 20px 0 0";
  }
  btn.style.fontSize = "30px";
  btn.style.opacity = "0.25";

  // add onClick event listener
  btn.addEventListener("click", () => {
    if(!document.fullscreenElement) {
      console.log("entering fullscreen");
      reader.requestFullscreen().catch(err => {
        console.log("Could not request fullscreen");
        console.log(err.message);
      });
    } else {
      console.log("exiting fullscreen");
      document.exitFullscreen();
    }
  });

  // apend fullscreen trigger to reader
  if(reader) {
    reader.appendChild(btn);
  }
}

/**
 * Initiates script
 * @return {undefined}
 **/
function main() {
  let reader = document.getElementsByClassName("reader-main")[0];

  document.addEventListener("fullscreenchange", fullscreenModeChangedListener);
  insertBtn(reader);
}

// run script
main();

// vim: set ts=2 sts=2 sw=2 et :
