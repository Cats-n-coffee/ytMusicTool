// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.message === "stopPlayer") {
//     sendResponse("stopping");
//     // chrome.runtime.sendMessage({ message: "stopPlayerCs" });
//   }
// });

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("tab id", tabId);
  console.log("tab url", tab.url);
  console.log("tab", tab);
  if (
    tab.url.includes("https://www.youtube.com/watch") &&
    tab.status !== "complete"
  ) {
    console.log("YOUTUBE status", tab.status);
  }
});

browser.webRequest.onBeforeRequest.addListener(
  function (details) {
    const url = new URL(details.url);
    const pathname = url.pathname;

    if (pathname.includes("ad_break")) {
      browser.tabs
        .query({
          currentWindow: true,
          active: true,
        })
        .then((tabs) => {
          for (let tab of tabs) {
            if (tab.url.includes("https://www.youtube.com/watch")) {
              browser.tabs.sendMessage(tab.id, { message: "adComing" });
            }
          }
        });
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
