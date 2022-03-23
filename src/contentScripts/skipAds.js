chrome.runtime.onMessage.addListener((request, sender, sendMessage) => {
  console.log("content listener");
  if (request.message === "skipAdsAuto") {
    const ytSkipAdsButton =
      document.getElementsByClassName("ytp-ad-skip-button")[0];

    console.log("yt button", ytSkipAdsButton);
    ytSkipAdsButton.click();
    sendMessage("skipping");
  }
});
