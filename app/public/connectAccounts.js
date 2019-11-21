// TODO set this.
const REDDIT_CLIENT_ID = "4lLq20IOgHBOiA";
const REDIRECT_URL = window.location.origin + window.location.pathname;

const redditAuthUrl = `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=code&state=reddit_oauth&redirect_uri=${REDIRECT_URL}&duration=temporary&scope=history,identity`;

const queryParams = new URLSearchParams(window.location.search);
// All OAuth 2 redirects will include a `state` parameter that can be used to determine which service the redirect came from.
if (queryParams.has("state")) {
    const state = queryParams.get("state");
    if (state === "reddit_oauth") {
        sessionStorage.setItem("redditCode", queryParams.get("code"));
    } else {
        alert(`Received unknown state query parameter "${state}"`)
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Enable or disable the Reddit connect button depending on if account has already been connected.
    const connectRedditLink = document.getElementById("connectRedditLink");
    if (!sessionStorage.getItem("redditCode")) {
        connectRedditLink.href = redditAuthUrl;
    } else {
        connectRedditLink.href = "#";
        connectRedditLink.innerText = "You have already connected your Reddit account.";
    }

    const analyzeLink = document.getElementById("analyzeLink");
    // Disable the submit button if no accounts have been connected.
    if (!sessionStorage.getItem("redditCode")) {
        analyzeLink.href = "#";
        analyzeLink.innerText = "You must connect at least one account before you can analyze your data."
    } else {
        // Make a list of authorization codes for connected accounts.
        
        const params = [];
        if (sessionStorage.getItem("redditCode")) {
            // analyzeLink.innerText = `${sessionStorage.getItem("redditCode")};`
            params.push("redditCode=" + sessionStorage.getItem("redditCode"));
        }

        analyzeLink.href = `${window.location.origin}/analyzeData?${params.join("&")}`;
    }
});
