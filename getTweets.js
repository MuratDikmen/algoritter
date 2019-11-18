console.log("test");

var mutationObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes.length == 1) {
      if (mutation.addedNodes[0].nodeName === "DIV") {
        console.log(mutation.addedNodes);
      }
      //   console.log(mutation.addedNodes);
    }
    // console.log(mutation.addedNodes);
  });
});

mutationObserver.observe(document.documentElement, {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true
});

function paintTweets() {
  let articles;
  articles = document.querySelectorAll("article");
  let articleArr = Array.from(articles);
  console.log(articleArr.length);
  console.log(articleArr);
  articleArr[0].style.backgroundColor = "blue";
  //   articleArr.forEach(article => {
  //     article.style.backgroundColor = "yellow";
  //     article.style.marginBottom = "40px";
  //   });
}

paintTweets();
