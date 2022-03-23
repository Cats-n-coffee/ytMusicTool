const player = document.querySelector("#movie_player");

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
