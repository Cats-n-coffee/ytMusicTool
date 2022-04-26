const stopPlayerButton = document.getElementById("stop-player");
const skipAdsButton = document.getElementById("skip-ads");
const choiceForm = document.getElementById("choice-form");
const rewindButton = document.querySelector("#rewind-button");

fetchStorage("rewind", stopPlayerButton, rewindEnabled);
fetchStorage("skipAdsAuto", skipAdsButton);

choiceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("submitting");
  if (stopPlayerButton.checked) {
    console.log("stop checked");
    browser.storage.local.set({ rewind: true });
    rewindEnabled();
  } else {
    browser.storage.local.set({ rewind: false });
  }
});

// stopPlayerButton.addEventListener("change", (event) => {
//   if (event.target.checked) {
//     console.log("checked");
//     chrome.storage.local.set({ rewind: true });
//     rewindEnabled();
//   } else {
//     chrome.storage.local.set({ rewind: false });
//   }
// });

rewindButton.addEventListener("click", () => {
  console.log("rewind button");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("tabs", tabs);
    for (const tab of tabs) {
      if (tab.url.includes("https://www.youtube.com/watch")) {
        chrome.tabs.sendMessage(tab.id, { message: "rewind" }, (response) => {
          console.log(response);
        });
      }
    }
  });
});

async function fetchStorage(key, element, callback) {
  try {
    const store = await browser.storage.local.get([key]);
    if (store[key] === true) {
      element.checked = true;
      callback();
    }
  } catch (e) {
    console.log("error", e);
  }
}

function rewindEnabled() {
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    browser.tabs.sendMessage(
      tabs[0].id,
      { message: "stopPlayer" },
      (response) => {
        console.log(response);
      }
    );
  });
}
