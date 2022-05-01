const stopPlayerButton = document.getElementById("stop-player");
const choiceForm = document.getElementById("choice-form");

fetchStorage("rewind", stopPlayerButton);

choiceForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (stopPlayerButton.checked) {
    browser.storage.local.set({ rewind: true });
  } else {
    browser.storage.local.set({ rewind: false });
  }
});

async function fetchStorage(key, element) {
  try {
    const store = await browser.storage.local.get([key]);
    console.log("store", store);
    if (store[key] === true) {
      element.checked = true;
    }
  } catch (e) {
    console.log("error", e);
  }
}
