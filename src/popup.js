const stopPlayerButton = document.getElementById("stop-player");
const skipAdsButton = document.getElementById("skip-ads");

fetchStorage();

stopPlayerButton.addEventListener("change", (event) => {
  if (event.target.checked) {
    console.log("checked");
    chrome.storage.local.set({ rewind: true });
    rewindEnabled();
  } else {
    chrome.storage.local.set({ rewind: false });
  }
});

async function fetchStorage() {
  try {
    const store = await chrome.storage.local.get(["rewind"]);
    console.log("store", store.rewind);
    if (store.rewind === true) {
      stopPlayerButton.checked = true;
      rewindEnabled();
    }
  } catch (e) {
    console.log("error", e);
  }
}

function rewindEnabled() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: "stopPlayer" },
      (response) => {
        console.log(response);
      }
    );
  });
}

skipAdsButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: "skipAdsAuto" },
      (response) => {
        console.log(response);
      }
    );
  });
});
