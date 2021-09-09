chrome.runtime.sendMessage({ type: "auth", session: window.location.search.substr(1) }, (res) => {
  console.log("aaaa");
  console.log(window.location.search);
  // Todo - improve this.
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams.get("userId"));
  console.log(urlParams.get("success_token"));
  // Todo - Do parsing here.
  console.log("Will close the window -- currently disabled");
  // window.close();
});
