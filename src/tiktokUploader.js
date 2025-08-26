const axios = require('axios');
const readline = require('readline-sync');
require('dotenv').config();

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  fgCyan: '\x1b[36m',
  fgGreen: '\x1b[32m',
  fgYellow: '\x1b[33m',
  fgMagenta: '\x1b[35m',
};

async function generateTitle(description) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log('Thiếu OPENAI_API_KEY, dùng tiêu đề mặc định.');
    return `Video: ${description}`;
  }
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `Viết tiêu đề ngắn gọn cho: ${description}` }],
        max_tokens: 20,
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.log('Tạo tiêu đề bằng AI thất bại:', err.message);
    return `Video: ${description}`;
  }
}

function getLoginUrl() {
  const clientKey = process.env.TT_CLIENT_KEY;
  const redirectUri = encodeURIComponent(process.env.TT_REDIRECT_URI || 'https://example.com/callback');
  const scope = encodeURIComponent('user.info.basic,video.upload');
  return `https://www.tiktok.com/auth/authorize?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}`;
}

async function exchangeCodeForToken(code) {
  const clientKey = process.env.TT_CLIENT_KEY;
  const clientSecret = process.env.TT_CLIENT_SECRET;
  const redirectUri = process.env.TT_REDIRECT_URI || 'https://example.com/callback';
  try {
    const res = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });
    return res.data;
  } catch (err) {
    console.log('Lấy token thất bại:', err.response?.data || err.message);
    return null;
  }
}

async function uploadVideo(accessToken, path, title) {
  if (!accessToken) {
    console.log('Không có access token, bỏ qua upload.');
    return;
  }
  try {
    const res = await axios.post(
      'https://open.tiktokapis.com/v2/post/publish/',
      { title },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Đã gọi API upload:', res.data);
  } catch (err) {
    console.log('Upload thất bại:', err.response?.data || err.message);
  }
}

async function main() {
  console.log(
    `${COLORS.fgMagenta}${COLORS.bright}\n📤 Demo TikTok Upload\n${COLORS.reset}`
  );
  console.log(
    `🔗 URL đăng nhập TikTok:\n${COLORS.fgCyan}${getLoginUrl()}${COLORS.reset}\n`
  );

  let token = null;
  if (readline.keyInYN('Bạn đã có code TikTok sau khi đăng nhập?')) {
    const code = readline.question('Nhập code: ');
    token = await exchangeCodeForToken(code);
    if (token) {
      console.log(
        `${COLORS.fgGreen}✔ Đã nhận token.${COLORS.reset}`
      );
    }
  }

  const desc = readline.question('\n📄 Mô tả video: ');
  const title = await generateTitle(desc);
  console.log(
    `\n🏷  Tiêu đề đề xuất: ${COLORS.fgYellow}${title}${COLORS.reset}`
  );

  const videoPath = readline.question(
    '\n📁 Đường dẫn video (bỏ trống để bỏ qua upload): '
  );
  if (videoPath) {
    await uploadVideo(token?.access_token, videoPath, title);
  }

  console.log(`\n${COLORS.fgGreen}Hoàn thành demo.${COLORS.reset}`);
}

main();
