import puppeteer from 'puppeteer-core';
const SBR_WS_ENDPOINT = 'wss://brd-customer-hl_f6e821a2-zone-scraping_browser1-country-us:63ag3t61ir7l@brd.superproxy.io:9222';

async function main(keyword) {
    console.log('Connecting to Scraping Browser...');
    const browser = await puppeteer.connect({
        browserWSEndpoint: SBR_WS_ENDPOINT,
    });
    try {
        console.log('Connected! Navigating to YouTube search results...');
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2 * 60 * 1000);
        await page.goto(`https://www.youtube.com/results?search_query=${keyword}+playlist`);
        console.log(`Navigated! Scraping video titles and links for '${keyword}' mixes...`);

        const videoElements = await page.$$('#video-title');
        const shuffledElements = shuffleArray(videoElements);

        const videos = [];
        for (let i = 0; i < Math.min(shuffledElements.length, 5); i++) {
            const title = await page.evaluate(element => element.innerText, shuffledElements[i]);
            const link = await page.evaluate(element => element.href, shuffledElements[i]);
            videos.push({ title, link });
        }

        console.log(`Here are 5 YouTube mixes with the "${keyword}" keyword:`);
        let returnStatement = "";
        videos.forEach((video, index) => {
            returnStatement += `${index + 1}. Title: ${video.title}, Link: ${video.link}\n`;
        });

        return returnStatement;

    } finally {
        await browser.close();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default main;
