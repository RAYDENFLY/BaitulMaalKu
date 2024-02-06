const TikTokScraper = require('tiktok-scraper');
const InstagramApi = require('instagram-private-api');

async function getInstagramEngagement(username) {
    const session = await InstagramApi.Client.Session.create(
        new InstagramApi.Device(username),
        new InstagramApi.CookieFileStorage(`./cookies/${username}.json`)
    );
    const account = await InstagramApi.Account.searchForUser(session, username);
    return account.params.engagement * 100;
}

async function getTikTokEngagement(username) {
    const user = await TikTokScraper.getUserProfileInfo(username);
    return (user.fans / user.following) * 100;
}

const instagramUsername = 'baitulmaalku.official';
const tiktokUsername = 'baitulmaalku.official';

getInstagramEngagement(instagramUsername).then(igEngagement => {
    console.log(`Instagram Engagement Rate: ${igEngagement.toFixed(2)}%`);
});

getTikTokEngagement(tiktokUsername).then(tiktokEngagement => {
    console.log(`TikTok Engagement Rate: ${tiktokEngagement.toFixed(2)}%`);
});
