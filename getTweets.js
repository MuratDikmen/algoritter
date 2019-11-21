let tweets = [];

const mutationObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (
      mutation.addedNodes.length > 0 &&
      mutation.target.nodeName == "DIV" &&
      mutation.target.classList.value === "" &&
      mutation.addedNodes[0].nodeName == "DIV"
    ) {
      // if (!tweets.includes(mutation.addedNodes[0].textContent)) {
      //   tweets.push(mutation.addedNodes[0].textContent);
      //   console.log(mutation.addedNodes[0].textContent);
      // } else {
      //   console.log("Duplicate found...");
      // }
      console.log(mutation);
    }

    // Original Tweet ID
    // mutation.addedNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[2].href

    // Reweet ID (Tweet Inside Retweet)
    // mutation.addedNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[2].href

    /* Check for retweets or original tweets
    if (
      mutation.addedNodes.length == 1 &&
      mutation.addedNodes[0].nodeName === "DIV"
    ) {
      if (
        mutation.addedNodes[0].childNodes[0].textContent &&
        mutation.addedNodes[0].childNodes[0].textContent.includes("Retweeted")
      ) {
        mutation.addedNodes[0].style.backgroundColor = "green"; // Recognize tweet.
        console.log(
          `This is a retweet. For this one, we will use the retweeted tweet's id to keep track of this tweet in the UI. 
          However, when calculating the position, we will use the main id_str. 
          Here is the retweet message: ${mutation.addedNodes[0].childNodes[0].textContent}`
        );
      } else if (
        mutation.addedNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[2].href.includes(
          "status"
        )
      ) {
        mutation.addedNodes[0].style.backgroundColor = "green"; // Recognize tweet.
        console.log(
          `This is an original tweet. This is straight forward. 
          Here is the string where we\'ll find the id_str: ${mutation.addedNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[2].href}`
        );
      } else {
        console.log("false");
      }
    }
    End checking retweet vs. original tweet*/
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

// Painting captures tweets -- In the future should include numbering, once the capture method is finalized.
// function paintTweets() {
//   let articles;
//   articles = document.querySelectorAll("article");
//   let articleArr = Array.from(articles);
//   console.log(articleArr.length);
//   console.log(articleArr);
//   articleArr[0].style.backgroundColor = "blue";
// }

// paintTweets();

// This method works, the only issue is textContent changes -- The time is updated, therefore the entire textContent is different.
function getinitialTweets() {
  const articles = document.querySelectorAll("article");
  articles.forEach(article => {
    const tweetText = article.parentNode.parentNode.textContent;
    tweets.push(tweetText);
    console.log(tweetText);
  });
}

// For now disabled
// getinitialTweets();
