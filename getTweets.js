let tweets = [];
let tweetContents = [];
let counter = 1;

const mutationObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    // Determine type of mutation e.g.
    identifyMutation(mutation);
    // if mutationType == tweet or retweet, do stuff.
    // this will keep the code clean.

    // Working code below.
    // if (
    //   mutation.addedNodes.length > 0 &&
    //   mutation.target.nodeName == "DIV" &&
    //   mutation.target.classList.value === "" &&
    //   mutation.addedNodes[0].nodeName == "DIV"
    // ) {
    //   if (
    //     mutation.addedNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[2].href.includes(
    //       "status"
    //     ) &&
    //     !tweets.includes(
    //       mutation.addedNodes[0].childNodes[0].childNodes[0].childNodes[0]
    //         .childNodes[1].childNodes[1].childNodes[0].childNodes[0]
    //         .childNodes[2].href
    //     )
    //   ) {
    //     tweets.push(
    //       mutation.addedNodes[0].childNodes[0].childNodes[0].childNodes[0]
    //         .childNodes[1].childNodes[1].childNodes[0].childNodes[0]
    //         .childNodes[2].href
    //     );
    //     const div = document.createElement("div");
    //     div.textContent = tweets.indexOf(
    //       mutation.addedNodes[0].childNodes[0].childNodes[0].childNodes[0]
    //         .childNodes[1].childNodes[1].childNodes[0].childNodes[0]
    //         .childNodes[2].href
    //     );
    //     div.style.backgroundColor = "blue";
    //     div.style.color = "white !important";
    //     mutation.addedNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].appendChild(
    //       div
    //     );
    //   } else {
    //     const div = document.createElement("div");
    //     div.textContent = tweets.indexOf(
    //       mutation.addedNodes[0].childNodes[0].childNodes[0].childNodes[0]
    //         .childNodes[1].childNodes[1].childNodes[0].childNodes[0]
    //         .childNodes[2].href
    //     );
    //     div.style.backgroundColor = "blue";
    //     div.style.color = "white !important";
    //     mutation.addedNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].appendChild(
    //       div
    //     );
    //   }
    // }
    // Working code above.
  });
});

mutationObserver.observe(document.documentElement, {
  subtree: true,
  childList: true
});

// This method works, the only issue is textContent changes -- The time is updated, therefore the entire textContent is different.
function getinitialTweets() {
  const div = document.querySelector(
    "div[aria-label='Timeline: Your Home Timeline']"
  );
  const initialTweets = div.childNodes[0].childNodes[0].childNodes;
  initialTweets.forEach(tweet => {
    if (tweet.textContent !== "") {
      const href =
        tweet.lastChild.childNodes[0].childNodes[0].childNodes[1].lastChild
          .firstChild.firstChild.lastChild.href;
      // const tweetContent = tweet.textContent;
      // const tweetContentLastChars = tweetContent.substring(
      //   tweetContent.length - 25,
      //   tweetContent.length
      // );

      if (!tweets.includes(href)) {
        tweets.push(href);
        console.log(href);
      }

      console.log(tweets.length);

      const num = tweets.indexOf(href);

      const p = document.createElement("p");
      p.style.width = "30px";
      p.style.height = "30px";
      p.style.backgroundColor = "rgb(220, 54, 126)";
      p.style.borderRadius = "50%";
      p.style.display = "flex";
      p.style.alignItems = "center";
      p.style.justifyContent = "center";
      p.style.fontSize = "20px";
      p.style.color = "white";
      p.style.textAlign = "center";
      p.style.fontFamily = "sans-serif";
      p.textContent = String(num);
      // counter++;
      tweet.insertBefore(p, tweet.firstChild);
      // console.log(tweets);
      // console.log(tweetContents);
    }
  });
}

// For now disabled

// UI Pattern
// Create UI object that returns all methods.
// Finally const ui = new UI()
// ui.observe(args)

const identifyMutation = mutation => {
  let mutationType = "";
  // Check mutation type
  // First check: mutation.addedNodes must be equal to greater than 0
  if (
    mutation.addedNodes.length > 0 &&
    mutation.target.nodeName == "DIV" &&
    mutation.target.classList.value === "" &&
    mutation.addedNodes[0].nodeName == "DIV" &&
    mutation.addedNodes[0].textContent != "" &&
    !mutation.addedNodes[0].textContent.includes("Who to Follow") &&
    mutation.addedNodes[0].childNodes[0].childNodes[0].nodeName == "ARTICLE"
  ) {
    // This certainly captures all tweet objects. But does it only capture tweet objects?
    //// First, Check if Captured, If not proceed with the Identification phase.. Because childNodes etc. might be different depending on
    //// Scrolling up or down
    let isCaptured = false;

    // console.log(
    //   mutation.addedNodes[0].childNodes[0].childNodes[0].childNodes[0]
    //     .childNodes[0].textContent
    // );

    const href =
      mutation.addedNodes[0].lastChild.childNodes[0].childNodes[0].childNodes[1]
        .lastChild.firstChild.firstChild.lastChild.href;

    // Check

    //

    if (!isCaptured) {
      // Now capture the tweet...
    }

    let isThread = false;
    let isPreviousThread = false;

    // if (mutation.addedNodes[0].innerHTML.includes("r-432wen")) {
    //   isThread = true;
    //   if (
    //     mutation.addedNodes[0].previousSibling.innerHTML.includes("r-432wen")
    //   ) {
    //     isPreviousThread = true;
    //   }
    // }

    const tweetContent = mutation.addedNodes[0].textContent;
    const tweetContentLastChars = tweetContent.substring(
      tweetContent.length - 25,
      tweetContent.length
    );

    if (!tweets.includes(href)) {
      tweets.push(href);
    }

    const num = tweets.indexOf(href);

    const p = document.createElement("p");
    p.style.width = "30px";
    p.style.height = "30px";
    p.style.backgroundColor = "rgb(220, 54, 126)";
    p.style.borderRadius = "50%";
    p.style.display = "flex";
    p.style.alignItems = "center";
    p.style.justifyContent = "center";
    p.style.fontSize = "20px";
    p.style.color = "white";
    p.style.textAlign = "center";
    p.style.fontFamily = "sans-serif";
    p.textContent = String(num);
    if (isThread) {
      p.style.backgroundColor = "blue";
    }
    if (isPreviousThread) {
      p.style.backgroundColor = "red";
    }
    // counter++;
    mutation.addedNodes[0].insertBefore(p, mutation.addedNodes[0].firstChild);
    // console.log(tweets.length);
    // console.log(tweetContents);
    // console.log(mutation);
  }

  // return mutationType;
};

getinitialTweets();
