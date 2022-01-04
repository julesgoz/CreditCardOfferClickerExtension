// Initialize button with user's preferred color
let mainBtn = document.getElementById("mainBtn");

mainBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: chaseOffersClicker,
  });
  mainBtn.style.background = "#A69F98";
  mainBtn.textContent = "All Done";
  mainBtn.disabled = true;
});
async function chaseOffersClicker(event) {
  function getOffers() {
    var allButtons = Array.from(
      document.getElementsByClassName("mds-button--cpo")
    );
    let offerButtons = [];
    for (let i = 0; i < allButtons.length; ++i) {
      let text = allButtons[i].getAttribute("accessible-text");
      if (text.includes("Add to card")) {
        offerButtons.push(allButtons[i]);
      }
    }
    return offerButtons;
  }

  let index = 0;
  offerButtons = getOffers();
  console.log(`There are ${offerButtons.length} offers available`);
  while (true) {
    offerButtons = getOffers();
    if (offerButtons.length <= 0) {
      break;
    }
    // console.log(offerButtons[0].getAttribute("accessible-text"));
    offerButtons[0].click();
    await new Promise((r) => setTimeout(r, 1000));
    let clsBtn = document.getElementById("flyoutClose");
    console.log("clicking");

    clsBtn.click();
    await new Promise((r) => setTimeout(r, 1000));
    index++;
  }
  console.log(`added ${index} offers`);
}
