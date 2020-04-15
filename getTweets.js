let tweets = [];
let tweetContents = [];
let counter = 1;
let tweetsToCompare = [];

const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // Determine type of mutation e.g.
    identifyMutation(mutation);
  });
});

mutationObserver.observe(document.documentElement, {
  subtree: true,
  childList: true,
});

const getinitialTweets = () => {
  const div = document.querySelector(
    "div[aria-label='Timeline: Your Home Timeline']"
  );
  const initialTweets = div.childNodes[0].childNodes[0].childNodes;
  initialTweets.forEach((tweet) => {
    if (
      tweet.textContent !== "" &&
      tweet.textContent.substring(
        tweet.textContent.length - 8,
        tweet.textContent.length
      ) !== "Promoted" &&
      !tweet.textContent.includes("Who to Follow")
    ) {
      let href;
      let hrefParent;

      if (
        tweet.lastChild.firstChild.firstChild.firstChild.lastChild.lastChild
          .firstChild.firstChild.firstChild.firstChild.lastChild.href !==
        undefined
      ) {
        href =
          tweet.lastChild.firstChild.firstChild.firstChild.lastChild.lastChild
            .firstChild.firstChild.firstChild.firstChild.lastChild.href;
        hrefParent =
          tweet.lastChild.firstChild.firstChild.firstChild.lastChild.lastChild
            .firstChild.firstChild.firstChild.firstChild.lastChild;
      } else {
        href =
          tweet.lastChild.firstChild.firstChild.firstChild.lastChild.lastChild
            .lastChild.firstChild.firstChild.firstChild.firstChild.lastChild
            .href;
        hrefParent =
          tweet.lastChild.firstChild.firstChild.firstChild.lastChild.lastChild
            .lastChild.firstChild.firstChild.firstChild.firstChild;
      }

      console.log(href);

      let isRetweet = false;
      let isThread = false;
      if (
        tweet.lastChild.firstChild.firstChild.firstChild.textContent.includes(
          "Retweeted"
        )
      ) {
        isRetweet = true;
      }

      // Thread Elimination

      if (
        tweet.lastChild.firstChild.firstChild.lastChild.firstChild.lastChild.classList.contains(
          "r-m5arl1"
        ) ||
        (tweet.lastChild.firstChild.firstChild.firstChild.firstChild.childNodes
          .length > 0 &&
          tweet.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild.classList.contains(
            "r-m5arl1"
          ))
      ) {
        console.log("returning");
        return;
      }

      const tweetId = href.split("/").pop();

      if (!tweets.includes(tweetId)) {
        tweets.push(tweetId);
      }

      console.log(tweets.length);

      const num = tweets.indexOf(tweetId);
      const num2 = tweetsToCompare.indexOf(tweetId);
      const rankChange = num2 == -1 ? 999 : num2 - num;
      const ui = new UI();
      const icon = ui.createRankIcon(rankChange);

      console.log("lol");
      console.log(icon);

      // const aNode =
      //   tweet.lastChild.firstChild.firstChild.firstChild.lastChild.lastChild
      //     .firstChild.firstChild.firstChild.firstChild.lastChild;
      // hrefParent.parentNode.parentNode.insertBefore(
      //   icon,
      //   hrefParent.parentNode.nextSibling
      // );

      hrefParent.appendChild(icon);
    }
  });
};

// For now disabled

// UI Pattern
// Create UI object that returns all methods.
// Finally const ui = new UI()
// ui.observe(args)

// ==============================
// IDENTIFY EACH MUTATION AND PROCESS IF IT IS A TWEET
// ==============================
const identifyMutation = (mutation) => {
  let mutationType = "";

  // Check to see if the added node is the div that contains the tweet.
  // Note that this method is very fragile and doesn't work if Twitter changes the DOM structure.
  if (
    mutation.addedNodes.length > 0 &&
    mutation.target.tagName == "DIV" &&
    mutation.target.classList.value === "" &&
    mutation.addedNodes[0].tagName == "DIV" &&
    mutation.addedNodes[0].textContent != "" &&
    !mutation.addedNodes[0].textContent.includes("Who to Follow") &&
    mutation.addedNodes[0].childNodes[0].childNodes[0].childNodes[0]
      .childNodes[0].tagName == "ARTICLE"
  ) {
    // Defining the link in steps, otherwise it is very difficult to troubleshoot when Twitter changes the DOM structure.
    let article =
      mutation.addedNodes[0].childNodes[0].childNodes[0].childNodes[0]
        .childNodes[0];
    let tweetColumn = article.firstChild.lastChild.lastChild;
    let upperBar = tweetColumn.firstChild.firstChild.firstChild;
    let link = upperBar.firstChild.lastChild;

    // Get the tweet handle link.
    const href = link.href;

    let isThread = false;
    let isPreviousThread = false;
    let isRetweet = false;

    if (
      mutation.addedNodes[0].lastChild.firstChild.firstChild.firstChild.textContent.includes(
        "Retweeted"
      )
    ) {
      isRetweet = true;
    }

    // Return if isThread -- Need to find a cleaner way of implementing this.
    if (
      mutation.addedNodes[0].lastChild.firstChild.firstChild.lastChild.firstChild.lastChild.classList.contains(
        "r-m5arl1"
      ) ||
      (mutation.addedNodes[0].lastChild.firstChild.firstChild.firstChild
        .firstChild.childNodes.length > 0 &&
        mutation.addedNodes[0].lastChild.firstChild.firstChild.firstChild.firstChild.firstChild.classList.contains(
          "r-m5arl1"
        ))
    ) {
      return;
    }

    const tweetContent = mutation.addedNodes[0].textContent;
    const tweetContentLastChars = tweetContent.substring(
      tweetContent.length - 25,
      tweetContent.length
    );

    // Get tweet handle from the URL.
    const tweetId = href.split("/").pop();

    // Add tweet handle to the list of tweets to keep track of.
    if (!tweets.includes(tweetId)) {
      tweets.push(tweetId);
    }

    // Get indices of the tweet in client tweet list and server tweet list and get the difference in ranks.
    const num = tweets.indexOf(tweetId);
    const num2 = tweetsToCompare.indexOf(tweetId);
    const rankChange = num2 == -1 ? 999 : num2 - num;

    // Initialize a new UI object and create an icon based on the rank differences between client and server.
    const ui = new UI();
    const icon = ui.createRankIcon(rankChange);

    // Add icon next to the Tweet title.
    link.parentNode.appendChild(icon);
  } else {
    console.log("This is not a Tweet / Failed to catch the Tweet");
  }
};

// ==============================
// Initialization of the App
// ==============================
async function init() {
  try {
    const res = await fetch("https://algoritter.herokuapp.com/");
    const data = await res.json();
    let threadFreeTweetList = [];
    let tweetsToRemove = [];
    data.data.forEach((tweet) => {
      if (tweet.in_reply_to_status_id_str !== null) {
        tweetsToRemove.push(tweet.in_reply_to_status_id_str);
        tweetsToRemove.push(tweet.id_str);
      }
    });

    console.log(tweetsToRemove);
    threadFreeTweetList = data.data.filter(
      (tweet) => !tweetsToRemove.includes(tweet.id_str)
    );
    tweetsToCompare = threadFreeTweetList.map((tweet) =>
      tweet.retweeted_status == null
        ? tweet.id_str
        : tweet.retweeted_status.id_str
    );
    console.log(threadFreeTweetList);
    getinitialTweets();
    console.log(data);
    console.log(tweetsToCompare);
  } catch (error) {
    console.log(error);
  }
}

init();

function UI() {
  const createRankIcon = (rankDiff) => {
    const div = document.createElement("div");
    const arrow = document.createElement("div");
    div.style.fontFamily = "Arial";
    div.style.fontSize = "0.9rem";
    div.style.textAlign = "center";
    arrow.style.width = "0";
    arrow.style.height = "0";
    arrow.style.display = "inline-block";
    arrow.style.borderColor = "transparent";
    arrow.style.borderStyle = "inset";
    arrow.style.borderWidth = "10px";

    if (rankDiff === 999) {
      arrow.style.border = "10px solid purple";
      arrow.style.transform = "translate(0%, 20%) scale(.8)";
      arrow.style.borderRadius = "50%";
      div.appendChild(arrow);
    } else if (rankDiff > 0) {
      arrow.style.borderBottom = "10px solid #00c853";
      arrow.style.transform = "translate(5%, -5%)";
      div.style.color = "#00c853";
      div.appendChild(arrow);
      div.appendChild(document.createTextNode(`+${rankDiff}`));
    } else if (rankDiff < 0) {
      arrow.style.transform = "translate(0%, 50%) rotate(0deg)";
      arrow.style.borderTop = "10px solid #dd2c00";
      div.style.color = "#dd2c00";
      div.appendChild(arrow);
      div.appendChild(document.createTextNode(`${rankDiff}`));
    } else {
      arrow.style.border = "10px solid yellow";
      arrow.style.transform = "translate(0%, 25%) scale(.7, .2)";
      div.style.color = "yellow";
      div.appendChild(arrow);
    }

    return div;
  };

  return {
    createRankIcon: createRankIcon,
  };
}
