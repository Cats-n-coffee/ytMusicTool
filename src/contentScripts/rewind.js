const player = document.querySelector("#movie_player");
const videoTotalTime = document.querySelector(".ytp-time-duration");
const videoElapasedTime = document.querySelector(".ytp-time-current");

const keyIsDown = new KeyboardEvent("keydown", {
  key: "0",
  code: "Digit0",
  keyCode: 48,
  isTrusted: true,
  composed: true,
  defaultPrevented: true,
  bubbles: true,
  cancelable: true,
});
const keyIsUp = new KeyboardEvent("keyup", {
  key: "0",
  code: "Digit0",
  keyCode: 48,
  isTrusted: true,
  composed: true,
  defaultPrevented: true,
  bubbles: true,
  cancelable: true,
});

const stopPlayerDOMEvent = new Event("stopPlayerDOMEvent");

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  player.addEventListener(
    "stopPlayerDOMEvent",
    (event) => {
      console.log("player has been focused");
      document.dispatchEvent(keyIsDown);
      document.dispatchEvent(keyIsUp);
    },
    false
  );

  if (request.message === "stopPlayer") {
    player.dispatchEvent(stopPlayerDOMEvent);
    console.log("inside content stop");
  }
  if (request.message === "rewind") {
    player.dispatchEvent(stopPlayerDOMEvent);
  }
  if (request.message === "getTotalTime") {
    const totalTimeStr = videoTotalTime.textContent;
    const totalTimeArr = totalTimeStr.split(":");
    const seconds = +totalTimeArr[0] * 60 + +totalTimeArr[1];
    sendResponse({ response: seconds });
  }
});

if (document.readyState === "complete") {
  console.log("total", videoTotalTime.textContent);
  console.log("current", videoElapasedTime.textContent);
}

// document.addEventListener("DOMContentLoaded", () => {
//   console.log("DOM loaded event");
//   while (!videoTotalTime) {
//     const ytSkipAdsButton =
//       document.getElementsByClassName("ytp-ad-skip-button")[0];

//     if (ytSkipAdsButton) {
//       console.log("skip ads");
//       ytSkipAdsButton.click();
//     }
//   }
// });
