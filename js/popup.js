const chaseAddress =
  "https://secure05b.chase.com/web/auth/dashboard#/dashboard/overviewAccounts/overview/multiDeposit";
const chaseOffers =
  "https://secure05b.chase.com/web/auth/dashboard#/dashboard/overviewAds/merchantFundedOffers/";

const amexAddress = "https://global.americanexpress.com/offers/eligible";

// Initialize buttons
let chaseBtn = document.getElementById("chaseBtn");
let amexBtn = document.getElementById("amexBtn");

let openChaseBtn = document.getElementById("openChaseBtn");
let openAmexBtn = document.getElementById("openAmexBtn");

chaseBtn.addEventListener("click", addChaseClickHandler);
amexBtn.addEventListener("click", addAmexClickHandler);
openChaseBtn.addEventListener("click", openChase);
openAmexBtn.addEventListener("click", openAmex);

async function addChaseClickHandler() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url.includes(chaseOffers)) {
    chaseBtn.textContent = "Open Chase Offers First";
    return;
  }
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: chaseOffersClicker,
  });
  chaseBtn.textContent = "Done";
  chaseBtn.disabled = true;
  chaseBtn.classList.add("done");
}

async function openChase() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.url !== chaseAddress || !tab.url.includes(chaseOffers)) {
    await chrome.tabs.update(undefined, { url: chaseAddress });
  }
  await new Promise((r) => setTimeout(r, 1000));
  [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await new Promise((r) => setTimeout(r, 2000));
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: traverseChase,
  });
}

async function addAmexClickHandler() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url.includes(amexAddress)) {
    chaseBtn.textContent = "Open Amex Offers First";
    return;
  }
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: amexOffersClicker,
  });
  amexBtn.textContent = "Done";
  amexBtn.disabled = true;
  amexBtn.classList.add("done");
}

async function openAmex() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.url !== amexAddress) {
    await chrome.tabs.update(undefined, { url: amexAddress });
  }
  await new Promise((r) => setTimeout(r, 2000));
}

async function chaseOffersClicker() {
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

async function amexOffersClicker() {
  let offerButtons = Array.from(
    document.getElementsByClassName(
      "btn btn-sm btn-fluid offer-cta btn-secondary"
    )
  ).filter((btn) => btn.title == "Add to Card");
  let index;
  for (index = 0; index < offerButtons.length; ++index) {
    console.log("Clicking offer button");
    offerButtons[index].click();
    // Wait 2seconds to be nice to AMEX servers :)
    await new Promise((r) => setTimeout(r, 2000));
  }
}

async function traverseChase(params) {
  const offersLink = document.getElementById("cardlyticsSeeAllOffers");
  offersLink.click();
  await new Promise((r) => setTimeout(r, 1000));
}
