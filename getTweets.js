let tweets = [];
let tweetContents = [];
let counter = 1;
let tweetsToCompare = [];

const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    handleMutation(mutation);
  });
});

// ==============================
// IDENTIFY EACH MUTATION AND PROCESS IF IT IS A TWEET
// ==============================
const handleMutation = (mutation) => {
  if (
    mutation.addedNodes.length > 0 &&
    mutation.addedNodes[0].tagName === "SECTION" &&
    mutation.addedNodes[0].lastChild.ariaLabel ===
      "Timeline: Your Home Timeline"
  ) {
    console.log(mutation);
  }

  // Check if the tweets are initial tweets - the difference from regular tweets is
  // that the first couple tweets are added together as a section.
  // Therefore, mutationHandler should catch if the addedNode is a section and parse href accordingly.

  // if (mutation.addedNodes.length > 0 &&) {

  // }

  // mutation.addedNodes.length > 0 && console.log(mutation);

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
      .childNodes[0].firstChild.tagName == "ARTICLE"
  ) {
    // Defining the link in steps, otherwise it is very difficult to troubleshoot when Twitter changes the DOM structure.
    let div = mutation.addedNodes[0];
    let article =
      div.childNodes[0].childNodes[0].childNodes[0].childNodes[0].firstChild;
    let tweetColumn = article.firstChild.lastChild.lastChild;
    let upperBar = tweetColumn.firstChild.firstChild.firstChild;
    let link = upperBar.firstChild.lastChild;

    console.log(mutation);

    // Get the tweet handle link.
    const href = link.href;

    // let isThread = false;
    // let isPreviousThread = false;
    // let isRetweet = false;

    // if (
    //   mutation.addedNodes[0].lastChild.firstChild.firstChild.firstChild.textContent.includes(
    //     "Retweeted"
    //   )
    // ) {
    //   isRetweet = true;
    // }

    // Return if the tweet is part of a thread -- Need to find a cleaner way of implementing this.
    if (
      article.firstChild.lastChild.firstChild.lastChild.classList.contains(
        "r-m5arl1"
      ) ||
      (article.firstChild.firstChild.firstChild.firstChild.childNodes.length >
        0 &&
        article.firstChild.firstChild.firstChild.firstChild.firstChild.classList.contains(
          "r-m5arl1"
        ))
    ) {
      return;
    }

    // const tweetContent = mutation.addedNodes[0].textContent;
    // const tweetContentLastChars = tweetContent.substring(
    //   tweetContent.length - 25,
    //   tweetContent.length
    // );

    // Get tweet handle from the URL.
    const tweetId = href.split("/").pop();

    // Add tweet handle to the list of tweets to keep track of.
    if (!tweets.includes(tweetId)) {
      tweets.push(tweetId);
    }

    // Get indices of the tweet in client tweet list and server tweet list and get the difference in ranks.
    const onScreenPosition = tweets.indexOf(tweetId);
    const originalPosition = tweetsToCompare.indexOf(tweetId);
    const rankChange =
      originalPosition == -1 ? 999 : originalPosition - onScreenPosition;

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
    console.log("script is running.");

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

    threadFreeTweetList = data.data.filter(
      (tweet) => !tweetsToRemove.includes(tweet.id_str)
    );
    tweetsToCompare = threadFreeTweetList.map((tweet) =>
      tweet.retweeted_status == null
        ? tweet.id_str
        : tweet.retweeted_status.id_str
    );

    // getinitialTweets();

    mutationObserver.observe(document.documentElement, {
      subtree: true,
      childList: true,
    });
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
