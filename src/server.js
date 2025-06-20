const express = require('express');
const cors = require('cors');
const { crawlYouTube, crawlTikTok, crawlFacebook } = require('./crawler');
const { downloadVideo } = require('./downloader');
const { summarizeArticle } = require('./summarizer');

const app = express();
app.use(cors());
app.use(express.json());

// Lấy danh sách video trend/keyword
app.get('/api/videos', async (req, res) => {
    const { platform, keyword } = req.query;
    let results = [];
    try {
        if (platform === 'YouTube' || platform === 'All') {
            results = results.concat(await crawlYouTube(keyword));
        }
        if (platform === 'TikTok' || platform === 'All') {
            results = results.concat(await crawlTikTok(keyword));
        }
        if (platform === 'Facebook' || platform === 'All') {
            results = results.concat(await crawlFacebook(keyword));
        }
        res.json({ success: true, videos: results });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// Tải video
app.post('/api/download', async (req, res) => {
    const { url, title, platform } = req.body;
    try {
        const path = await downloadVideo({ url, title, platform });
        res.json({ success: true, path });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// Tóm tắt bài viết
app.post('/api/summary', async (req, res) => {
    const { url } = req.body;
    try {
        const path = await summarizeArticle(url);
        res.json({ success: true, path });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log('Backend server running at http://localhost:' + PORT);
}); 