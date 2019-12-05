// TODO set this.
const REDDIT_CLIENT_ID = "4lLq20IOgHBOiA";
// TODO set this.
const FACEBOOK_APP_ID = "513242592617015";
const REDIRECT_URL = window.location.origin + window.location.pathname;

const REDDIT_CODE_ID = "redditCode";
const FACEBOOK_CODE_ID = "facebookCode";
const services = [
    {
        // A human-readable name for this service that will be shown to users.
        name: "Reddit",
        // The page to send the user to so they can authorize DigitalMirror to access their account.
        oauthUrl: `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=code&state=${REDDIT_CODE_ID}&redirect_uri=${REDIRECT_URL}&duration=temporary&scope=history,identity`,
        /* A variable name for this service's OAuth 2 code. This is the key that will be used when the code is sent to
        the server as a query parameter. Additionally, the `state` query parameter must be set to this value when the user
        is redirected back to this page after authorizing their account for this service. */
        codeId: REDDIT_CODE_ID,
        iconUrl: "https://images-eu.ssl-images-amazon.com/images/I/418PuxYS63L.png"
    },
    {
        name: "Facebook",
        oauthUrl: `https://www.facebook.com/v5.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${REDIRECT_URL}&state=${FACEBOOK_CODE_ID}&scope=user_posts`,
        codeId: FACEBOOK_CODE_ID,
        iconUrl: "https://en.facebookbrand.com/wp-content/uploads/2019/04/f_logo_RGB-Hex-Blue_512.png"
    }
];

const queryParams = new URLSearchParams(window.location.search);
// Save the authorization code from the query string to session storage.
// All OAuth 2 redirects will include a `state` parameter that can be used to determine which service the redirect came from.
if (queryParams.has("state")) {
    const codeId = queryParams.get("state");
    let validCode = false;
    for (const service of services) {
        if (codeId === service.codeId) {
            sessionStorage.setItem(codeId, queryParams.get("code"));
            validCode = true;
            break;
        }
    }

    if (!validCode) {
        alert(`Received unknown state query parameter "${codeId}"`)
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // For each service that has already been connected, add the authorization code to appropriate entry in `services`.
    for (const service of services) {
        service.authorizationCode = sessionStorage.getItem(service.codeId);
    }

    $.get("./connectAccounts.hbs", (template) => {
        // Compile the template and render it.
        document.getElementById("content").innerHTML = Handlebars.compile(template)({
            services: services,
            accountConnected: services.reduce((found, service) => !!service.authorizationCode || found, false)
        });
    });
});

function analyzeData() {
    // Make a list of authorization codes for connected accounts.
    const params = [];
    for (const service of services) {
        if (service.authorizationCode) {
            params.push(`${service.codeId}=${service.authorizationCode}`);
            sessionStorage.removeItem(service.codeId);
        }
    }

    window.location.href = `/analyzeData?${params.join("&")}`;
}
