const { crawlYouTube, crawlTikTok, crawlFacebook } = require('./crawler');
const { downloadVideo } = require('./downloader');
const { summarizeArticle } = require('./summarizer');
const readline = require('readline-sync');

async function main() {
    console.log('==== AUTO VIDEO TREND/KEYWORD SYSTEM ====');
    const platforms = ['YouTube', 'TikTok', 'Facebook', 'All'];
    const platformIdx = readline.keyInSelect(platforms, 'Chọn nền tảng:');
    if (platformIdx === -1) return console.log('Thoát!');
    const platform = platforms[platformIdx];

    const mode = readline.keyInSelect(['Trend', 'Keyword'], 'Chọn chế độ:');
    if (mode === -1) return console.log('Thoát!');
    let keyword = null;
    if (mode === 1) {
        keyword = readline.question('Nhập keyword: ');
    }

    let results = [];
    if (platform === 'YouTube' || platform === 'All') {
        console.log('Đang lấy video từ YouTube...');
        results = results.concat(await crawlYouTube(keyword));
    }
    if (platform === 'TikTok' || platform === 'All') {
        console.log('Đang lấy video từ TikTok...');
        results = results.concat(await crawlTikTok(keyword));
    }
    if (platform === 'Facebook' || platform === 'All') {
        console.log('Đang lấy video từ Facebook...');
        results = results.concat(await crawlFacebook(keyword));
    }

    if (!results.length) return console.log('Không tìm thấy video phù hợp!');
    results.forEach((v, i) => {
        console.log(`[${i}] ${v.platform}: ${v.title}\n${v.url}\n`);
    });
    const idx = readline.keyInSelect(results.map(v => v.title), 'Chọn video để tải hoặc tóm tắt:');
    if (idx === -1) return console.log('Thoát!');
    const selected = results[idx];

    if (selected.url.match(/(youtube|tiktok|facebook)\.com/)) {
        console.log('Đang tải video...');
        try {
            const path = await downloadVideo(selected);
            console.log('Đã lưu video tại:', path);
        } catch (e) {
            console.log('Tải video thất bại:', e.message);
        }
    } else {
        console.log('Đang tóm tắt bài viết...');
        try {
            const path = await summarizeArticle(selected.url);
            console.log('Đã lưu tóm tắt tại:', path);
        } catch (e) {
            console.log('Tóm tắt thất bại:', e.message);
        }
    }
    console.log('Hoàn thành!');
}
process.stdout.setEncoding('utf8');
main(); 