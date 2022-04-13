let browser;

if (chrome) {
  browser = chrome;
} else {
  browser = browser;
}

const stopPlayerButton = document.getElementById("stop-player");
const skipAdsButton = document.getElementById("skip-ads");
const choiceForm = document.getElementById("choice-form");

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
  if (skipAdsButton.checked) {
    console.log("skip ads checked");
    browser.storage.local.set({ skipAdsAuto: true });
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   chrome.tabs.sendMessage(
    //     tabs[0].id,
    //     { message: "skipAdsAuto" },
    //     (response) => {
    //       console.log(response);
    //     }
    //   );
    // });
  } else {
    browser.storage.local.set({ skipAdsAuto: false });
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

async function fetchStorage(key, element, callback) {
  try {
    const store = await browser.storage.local.get([key]);
    console.log("store", store[key]);
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

// skipAdsButton.addEventListener("change", (event) => {
//   if (event.target.checked) {
//     console.log("checked");
//     chrome.storage.local.set({ skipAdsAuto: true });
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.tabs.sendMessage(
//         tabs[0].id,
//         { message: "skipAdsAuto" },
//         (response) => {
//           console.log(response);
//         }
//       );
//     });
//   } else {
//     chrome.storage.local.set({ skipAdsAuto: false });
//   }
// });
