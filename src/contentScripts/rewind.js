const player = document.querySelector("#movie_player");
const videoTotalTime = document.querySelector(".ytp-time-duration");
const videoElapasedTime = document.querySelector(".ytp-time-current");

console.log("total", videoTotalTime.textContent);
console.log("current", videoElapasedTime.textContent);

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
});

const getVideoTotal = () => {
  console.log("inside function", videoTotalTime.textContent);
};

window.addEventListener("DOMContentLoaded", () => {
  while (!videoTotalTime) {
    const ytSkipAdsButton =
      document.getElementsByClassName("ytp-ad-skip-button")[0];

    if (ytSkipAdsButton) {
      console.log("skip ads");
      ytSkipAdsButton.click();
    }
  }

  getVideoTotal();
});
