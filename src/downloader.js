const youtubedl = require('youtube-dl-exec');
const os = require('os');
const path = require('path');
const fs = require('fs-extra');

function getDownloadsFolder() {
    return 'D:\\Downloads';
}

async function downloadVideo({ url, title, platform }) {
    const downloadsDir = getDownloadsFolder();
    await fs.ensureDir(downloadsDir);
    const safeTitle = title.replace(/[^a-zA-Z0-9-_ ]/g, '').slice(0, 50);
    const filename = `${safeTitle || platform}-video.mp4`;
    const output = path.join(downloadsDir, filename);
    await youtubedl(url, {
        output,
        format: 'mp4',
        restrictFilenames: true,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: [
            'referer:youtube.com',
            'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        ]
    });
    return output;
}

module.exports = { downloadVideo }; 