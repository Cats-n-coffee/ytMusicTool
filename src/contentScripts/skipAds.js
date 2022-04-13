let checkAdsButton;
let intervalCount = 0;

browser.runtime.onMessage.addListener((request, sender, sendMessage) => {
  if (request.message === "adComing") {
    console.log("%cad coming", "color: magenta");

    checkAdsButton = setInterval(() => {
      const ytSkipAdsButton =
        document.getElementsByClassName("ytp-ad-skip-button")[0];

      console.log("yt button", ytSkipAdsButton);
      intervalCount++;
      console.log(intervalCount);
      if (ytSkipAdsButton) {
        ytSkipAdsButton.click();
        sendMessage("skipping");
        clearCheckInterval();
      }
      if (intervalCount === 10 && !ytSkipAdsButton) {
        clearCheckInterval();
      }
    }, 3000);
  }
});

function clearCheckInterval() {
  clearInterval(checkAdsButton);
  intervalCount = 0;
}
