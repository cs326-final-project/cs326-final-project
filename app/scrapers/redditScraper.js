const snoowrap = require("snoowrap");

const CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;

// TODO handle errors more gracefully.
async function scrapeUser(userName, authorizationCode) {
    const wrapper = await snoowrap.fromAuthCode({
        code: authorizationCode,
        userAgent: "Digital Mirror (by /u/Derpthemeus)",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        // TODO set this (it must mach the URL provided for the app on the Reddit developer portal)
        redirectUri: "http://192.168.99.100:3000/redditOAuthCallback",
    });

    const user = wrapper.getUser(userName);
    console.log("Got Reddit user");

    // TODO change this to use whatever format is used in MongoDB.
    const scrapedData = {
        comments: [],
        submissions: [],
        upvoted: [],
        downvoted: []
    };

    for (const comment of await user.getComments()) {
        // TODO change this to use whatever format is used in MongoDB.
        scrapedData.comments.push({
            timestamp: comment.created_utc,
            text: comment.body,
            upvotes: comment.ups,
            downvotes: comment.downs
        });
    }
    console.log("Scraped comments");

    for (const submission of await user.getSubmissions()) {
        // Skip non-text posts.
        if (!submission.is_self) {
            continue;
        }

        // TODO change this to use whatever format is used in MongoDB.
        scrapedData.submissions.push({
            timestamp: submission.created_utc,
            text: submission.selftext,
            upvotes: submission.ups,
            downvotes: submission.downs
        });
    }
    console.log("Scraped submissions");

    for (const content of await user.getUpvotedContent()) {
        // Skip votes on non-text posts.
        if (!content.is_self) {
            continue;
        }

        // TODO change this to use whatever format is used in MongoDB.
        scrapedData.upvoted.push({
            text: content.selftext
        });
    }
    console.log("Scraped upvoted posts");

    for (const content of await user.getDownvotedContent()) {
        // Skip votes on non-text posts.
        if (!content.is_self) {
            continue;
        }

        // TODO change this to use whatever format is used in MongoDB.
        scrapedData.downvoted.push({
            text: content.selftext
        });
    }
    console.log("Scraped downvoted posts");

    // TODO add the data to the database.
    console.log(scrapedData);
}