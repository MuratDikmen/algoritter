// This listens to extension being installed the first time.
chrome.runtime.onInstalled.addListener(() => {
  // Make sure the extension is only available on twitter.com
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "twitter.com" },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
//   if (request.greeting == "hello") sendResponse({ farewell: "goodbye" });
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("From BACKGROUND.JS → Printing request.session");
  console.log(request.session);
  sendResponse(true);
});
