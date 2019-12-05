const graph = require("fbgraph");

const CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const REDIRECT_URL = process.env.FACEBOOK_REDIRECT_URL;

// TODO handle errors more gracefully.
function scrapeUser(authorizationCode) {
	return new Promise((resolve, reject) => {
		graph.authorize({
			"client_id": CLIENT_ID,
			"redirect_uri": REDIRECT_URL,
			"client_secret": CLIENT_SECRET,
			"code": authorizationCode
		}, async (err, res) => {
			if (err) {
				reject(err);
			}
			console.log("Authorized Facebook application");
			graph.setAccessToken(res.access_token);
			// Recursively scrape all pages.
			const scrapedData = await scrapePage([], "me/posts");
			resolve(scrapedData);
		});
	});
}

/** Recursively scrapes a page and the next one until all pages have been scraped. */
function scrapePage(scrapedData, url) {
	return new Promise((resolve, reject) => {
		graph.get(url, async (err, res) => {
			if (err) {
				reject(err);
			}

			for (const post of res.data) {
				// Skip non-text posts.
				if (!post.message) {
					continue;
				}

				// TODO change this to use whatever format is used in MongoDB.
				scrapedData.push({
					timestamp: +new Date(post.created_time),
					text: post.message,
				})
			}

			if (res.paging && res.paging.next) {
				resolve(await scrapePage(scrapedData, res.paging.next));
			} else {
				resolve(scrapedData);
			}
		});
	})
}

module.exports = {
	scrapeUser: scrapeUser
};
