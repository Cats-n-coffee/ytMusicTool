let rewindChoice;
let ytTabId;
let rewindInterval;

function setDefaultStorage() {
  browser.storage.local.set({ rewind: false });
}

getStorageValue("rewind");

function getStorageValue(key) {
  browser.storage.local.get([key], (result) => {
    console.log("storage result", result);
    if (!result.rewind) {
      setDefaultStorage();
      rewindChoice = false;
    } else {
      rewindChoice = result.rewind;
    }
  });
}

browser.storage.onChanged.addListener((changes, areaName) => {
  console.log("%cstorage change changes", "color: lightgreen", changes);
  rewindChoice = changes.rewind.newValue;
  if (rewindChoice) {
    sendMessageToContentScript({ message: "getTotalTime" });
  }
});

// This will work only when we know how to spot the start of the video (after ads)
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    tab.url.includes("https://www.youtube.com/watch") &&
    tab.status === "complete"
  ) {
    console.log("YOUTUBE status", tab.status);
    ytTabId = tab.id;
    // if (rewindChoice) { // This is missing the signal for the actual video
    //   sendMessageToContentScript({ message: "getTotalTime" });
    // }
  }
});

function rewindTimer(totalTime) {
  const timer = totalTime * 1000 - 5000;
  rewindInterval = setInterval(() => {
    sendMessageToContentScript({ message: "rewind" });
  }, timer);
}

function sendMessageToContentScript(message) {
  browser.tabs
    .query({
      currentWindow: true,
      active: true,
    })
    .then((tabs) => {
      for (let tab of tabs) {
        if (tab.url.includes("https://www.youtube.com/watch")) {
          browser.tabs.sendMessage(tab.id, message).then((res) => {
            console.log("%cresponse ", "color: red", res);
            if (!res) return;
            if (typeof res.response === "number") {
              console.log("%ctotal time", "color: cyan", res);
              rewindTimer(res.response);
            }
          });
        }
      }
    });
}

browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log("%ctab id", "color: magenta", tabId);
  console.log("%cyt tab", "color: magenta", ytTabId);
  console.log("%cremove info", "color: magenta", removeInfo);
  if (tabId === ytTabId) {
    setDefaultStorage();
    rewindChoice = false;
    clearInterval(rewindInterval);
  }
});

// ---------------------- Skip ads ---------------------------

// Listen to network requests and wait for the "ad_break"
browser.webRequest.onBeforeRequest.addListener(
  function (details) {
    const url = new URL(details.url);
    const pathname = url.pathname;

    if (pathname.includes("ad_break")) {
      sendMessageToContentScript({ message: "adComing" });
    }
    return {
      cancel: true,
    };
  },
  { urls: ["*://*.youtube.com/*"], types: ["xmlhttprequest", "main_frame"] }
);
// https://stackoverflow.com/questions/15532791/getting-around-x-frame-options-deny-in-a-chrome-extension/69177790#69177790
// https://stackoverflow.com/questions/70986918/why-doesnt-this-declarative-net-request-rule-work
// https://www.ghostery.com/blog/manifest-v3-the-ghostery-perspective
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension
// https://github.com/fregante/browser-extension-template
// https://stackoverflow.com/questions/48966814/receiving-end-does-not-exist-when-passing-message-to-injected-content-script
