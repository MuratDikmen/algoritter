let tweets = [];
let tweetContents = [];
let counter = 1;
let tweetsToCompare = [];

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
const getinitialTweets = () => {
  const div = document.querySelector(
    "div[aria-label='Timeline: Your Home Timeline']"
  );
  const initialTweets = div.childNodes[0].childNodes[0].childNodes;
  initialTweets.forEach(tweet => {
    if (
      tweet.textContent !== "" &&
      tweet.textContent.substring(
        tweet.textContent.length - 8,
        tweet.textContent.length
      ) !== "Promoted" &&
      !tweet.textContent.includes("Who to Follow")
    ) {
      const href =
        tweet.lastChild.firstChild.firstChild.lastChild.lastChild.firstChild
          .firstChild.firstChild.lastChild.href;

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
        isThread = true;
        const p = document.createElement("p");
        p.style.width = "450px";
        p.style.height = "30px";
        p.style.backgroundColor = "rgb(220, 54, 126)";
        p.style.display = "flex";
        p.style.alignItems = "center";
        p.style.justifyContent = "center";
        p.style.fontSize = "20px";
        p.style.color = "white";
        p.style.textAlign = "center";
        p.style.fontFamily = "sans-serif";
        p.textContent = "This is a thread and will be ignored";
        tweet.insertBefore(p, tweet.firstChild);
        return;
      }

      const tweetId = href.split("/").pop();

      if (!tweets.includes(tweetId)) {
        tweets.push(tweetId);
        console.log(href);
      }

      console.log(tweets.length);

      const num = tweets.indexOf(tweetId);
      const num2 = tweetsToCompare.indexOf(tweetId);
      const rankChange = num2 == -1 ? 999 : num2 - num;
      const p = document.createElement("p");
      p.style.width = "450px";
      p.style.height = "30px";
      p.style.backgroundColor = "rgb(220, 54, 126)";
      p.style.display = "flex";
      p.style.alignItems = "center";
      p.style.justifyContent = "center";
      p.style.fontSize = "20px";
      p.style.color = "white";
      p.style.textAlign = "center";
      p.style.fontFamily = "sans-serif";
      p.textContent =
        "On the page: " +
        String(num) +
        " ** " +
        "Actual on the list: " +
        String(num2) +
        " ** " +
        "Rank Change: " +
        String(rankChange) +
        " Is this thread? " +
        isThread;
      // counter++;
      tweet.insertBefore(p, tweet.firstChild);
      // console.log(tweets);
      // console.log(tweetContents);
    }
  });
};

// For now disabled

// UI Pattern
// Create UI object that returns all methods.
// Finally const ui = new UI()
// ui.observe(args)

// ==============================
//
// ==============================
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

    console.log(mutation);

    let isCaptured = false;

    const href =
      mutation.addedNodes[0].lastChild.firstChild.firstChild.lastChild.lastChild
        .firstChild.firstChild.firstChild.lastChild.href;

    console.log(href);

    // const href =
    //   mutation.addedNodes[0].lastChild.childNodes[0].childNodes[0].childNodes[1]
    //     .lastChild.firstChild.firstChild.lastChild.href;

    if (!isCaptured) {
      // Now capture the tweet...
    }

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

    // Implement isThread

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
      isThread = true;
      const p = document.createElement("p");
      p.style.width = "450px";
      p.style.height = "30px";
      p.style.backgroundColor = "rgb(220, 54, 126)";
      p.style.display = "flex";
      p.style.alignItems = "center";
      p.style.justifyContent = "center";
      p.style.fontSize = "20px";
      p.style.color = "white";
      p.style.textAlign = "center";
      p.style.fontFamily = "sans-serif";
      p.textContent = "This is a thread and will be ignored";
      mutation.addedNodes[0].insertBefore(p, mutation.addedNodes[0].firstChild);
      return;
    }

    const tweetContent = mutation.addedNodes[0].textContent;
    const tweetContentLastChars = tweetContent.substring(
      tweetContent.length - 25,
      tweetContent.length
    );

    const tweetId = href.split("/").pop();

    if (!tweets.includes(tweetId)) {
      tweets.push(tweetId);
    }

    // tweetsToCompare.push({ tweetId, isRetweet });
    const num = tweets.indexOf(tweetId);
    const num2 = tweetsToCompare.indexOf(tweetId);
    const rankChange = num2 == -1 ? 999 : num2 - num;
    const ui = new UI();
    const symbol = ui.createRankSymbol(rankChange);
    const p = document.createElement("p");
    p.style.width = "450px";
    p.style.height = "30px";
    p.style.backgroundColor = "rgb(220, 54, 126)";
    p.style.display = "flex";
    p.style.alignItems = "center";
    p.style.justifyContent = "center";
    p.style.fontSize = "20px";
    p.style.color = "white";
    p.style.textAlign = "center";
    p.style.fontFamily = "sans-serif";
    p.textContent =
      "On the page: " +
      String(num) +
      " ** " +
      "Actual on the list: " +
      String(num2) +
      " ** " +
      "Rank Change: " +
      String(rankChange) +
      "Is this a thread? " +
      isThread;
    if (isThread) {
      p.style.backgroundColor = "blue";
    }
    if (isPreviousThread) {
      p.style.backgroundColor = "red";
    }
    // counter++;

    const aNode =
      mutation.addedNodes[0].lastChild.firstChild.firstChild.lastChild.lastChild
        .firstChild.firstChild.firstChild.lastChild;
    aNode.parentNode.insertBefore(symbol, aNode.nextSibling);
    mutation.addedNodes[0].insertBefore(p, mutation.addedNodes[0].firstChild);
    mutation.addedNodes[0].insertBefore(
      symbol,
      mutation.addedNodes[0].firstChild
    );
    aNode.parentNode.insertBefore(symbol, aNode.nextSibling);
    // console.log(tweets.length);
    // console.log(tweetContents);
    // console.log(mutation);
  }

  // return mutationType;
};

// ==============================
// Initialization of the App
// ==============================
async function init() {
  try {
    const res = await fetch("https://algoritter.herokuapp.com/");
    const data = await res.json();
    console.log(data.data);
    let threadFreeTweetList = [];
    let tweetsToRemove = [];
    data.data.forEach(tweet => {
      if (tweet.in_reply_to_status_id_str !== null) {
        tweetsToRemove.push(tweet.in_reply_to_status_id_str);
        tweetsToRemove.push(tweet.id_str);
      }
    });

    console.log(tweetsToRemove);
    threadFreeTweetList = data.data.filter(
      tweet => !tweetsToRemove.includes(tweet.id_str)
    );
    tweetsToCompare = threadFreeTweetList.map(tweet =>
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

// const app = () => {

//   const init = () => {
//     return "gogog";
//   };

//   return {
//     init: init
//   };

// };

function UI() {
  const createRankSymbol = rankDiff => {
    const div = document.createElement("div");
    const arrow = document.createElement("div");
    arrow.style.width = "0";
    arrow.style.height = "0";
    arrow.style.display = "inline-block";
    arrow.style.borderColor = "transparent";
    arrow.style.borderStyle = "inset";
    arrow.style.borderWidth = "10px";

    if (rankDiff > 0) {
      arrow.style.borderBottom = "10px solid green";
      arrow.style.transform = "translate(0px, 30%) rotate(-90deg)";
      div.style.color = "green";
    } else if (rankDiff === -1) {
      arrow.style.borderRight = "10px solid black";
      arrow.style.transform = "translate(0px, 30%) rotate(45deg)";
      div.style.color = "black";
    } else if (rankDiff < 0) {
      arrow.style.transform = "translate(30%, 30%) rotate(-90deg)";
      arrow.style.borderTop = "10px solid red";
      div.style.color = "red";
    } else {
      arrow.style.borderLeft = "10px solid yellow";
      arrow.style.transform = "translate(-30%, 30%) rotate(180deg)";
      div.style.color = "yellow";
    }

    div.appendChild(arrow);
    div.appendChild(document.createTextNode(`${rankDiff}`));

    return div;
  };

  return {
    createRankSymbol: createRankSymbol
  };
}
