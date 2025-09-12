chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.todo === "showPageAction") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("Message received, no need to show(), action is always visible in MV3.");
    });
  }
});
