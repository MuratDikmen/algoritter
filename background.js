// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ color: "#311221" }, () => {
//     console.log("The color is which color?");
//   });
// });

// This listens to extension being installed the first time.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: "#3aa757" }, () => {
    console.log("The color is green.");
  });
  // declarativeContent API sets the rules on (1) when the extension will be available to use
  // and (2) set certain functonality to be only available in certain URLs.
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "developer.chrome.com" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});
