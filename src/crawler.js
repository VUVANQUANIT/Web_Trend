const puppeteer = require('puppeteer');

async function crawlYouTube(keyword = null) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let url = keyword
        ? `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}`
        : 'https://www.youtube.com/feed/trending';
    await page.goto(url, { waitUntil: 'networkidle2' });
    await new Promise(res => setTimeout(res, 2000));
    const videos = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('ytd-video-renderer,ytd-video-preview,ytd-video-renderer.style-scope'));
        return items.slice(0, 10).map(item => {
            const a = item.querySelector('a#video-title');
            return a ? {
                title: a.textContent.trim(),
                url: 'https://www.youtube.com' + a.getAttribute('href'),
                platform: 'YouTube',
            } : null;
        }).filter(Boolean);
    });
    await browser.close();
    return videos;
}

async function crawlTikTok(keyword = null) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let url = keyword
        ? `https://www.tiktok.com/search?q=${encodeURIComponent(keyword)}`
        : 'https://www.tiktok.com/foryou';
    await page.goto(url, { waitUntil: 'networkidle2' });
    await new Promise(res => setTimeout(res, 3000));
    const videos = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('a[href*="/video/"]'));
        return items.slice(0, 10).map(a => ({
            title: a.textContent.trim() || 'TikTok Video',
            url: a.href,
            platform: 'TikTok',
        }));
    });
    await browser.close();
    return videos;
}

async function crawlFacebook(keyword = null) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let url = keyword
        ? `https://www.facebook.com/watch/search/?q=${encodeURIComponent(keyword)}`
        : 'https://www.facebook.com/watch';
    await page.goto(url, { waitUntil: 'networkidle2' });
    await new Promise(res => setTimeout(res, 4000));
    const videos = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('a[href*="/videos/"]'));
        return items.slice(0, 10).map(a => ({
            title: a.textContent.trim() || 'Facebook Video',
            url: a.href,
            platform: 'Facebook',
        }));
    });
    await browser.close();
    return videos;
}

module.exports = {
    crawlYouTube,
    crawlTikTok,
    crawlFacebook,
}; 