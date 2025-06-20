const axios = require('axios');
const cheerio = require('cheerio');
const os = require('os');
const path = require('path');
const fs = require('fs-extra');

function getDownloadsFolder() {
    return 'D:\\Downloads';
}

async function summarizeArticle(url) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let text = '';
    $('p').each((i, el) => {
        text += $(el).text() + '\n';
    });
    // Tóm tắt đơn giản: lấy 5 câu đầu tiên
    const summary = text.split('.').slice(0, 5).join('.') + '.';
    const downloadsDir = getDownloadsFolder();
    await fs.ensureDir(downloadsDir);
    const filename = `summary-${Date.now()}.txt`;
    const output = path.join(downloadsDir, filename);
    await fs.writeFile(output, summary, 'utf8');
    return output;
}

module.exports = { summarizeArticle }; 