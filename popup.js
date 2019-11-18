let changeColor = document.getElementById("changeColor");
let showTweets = document.getElementById("showTweets");

// Get data from storage (in this case, color data) and use it.
chrome.storage.sync.get("color", data => {
  console.log(data);
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute("value", data.color);
});

changeColor.onclick = element => {
  let color = element.target.value;
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    tabs => {
      console.log(tabs);
      chrome.tabs.executeScript(tabs[0].id, {
        code: 'document.body.style.backgroundColor = "' + color + '";'
      });
    }
  );
};

showTweets.onclick = element => {
  chrome.tabs.executeScript({ file: "getTweets.js" });
};
