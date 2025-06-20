# FLEX - Hệ thống lấy video trend/keyword tự động

## Mô tả dự án
FLEX là hệ thống tự động thu thập, tải về và tóm tắt video trending hoặc theo từ khóa từ các nền tảng phổ biến như YouTube, TikTok, Facebook. Dự án gồm 2 phần:
- **Backend**: Node.js/Express, thực hiện crawl, download video, tóm tắt bài viết.
- **Frontend**: React, giao diện người dùng để tìm kiếm, tải video.

## Tính năng chính
- Lấy danh sách video trending hoặc theo từ khóa từ YouTube, TikTok, Facebook.
- Tải video về máy.
- Tóm tắt nội dung bài viết (nếu là link bài báo).

## Cài đặt
### 1. Backend
```bash
cd FLEX
npm install
```

### 2. Frontend
```bash
cd client
npm install
```

## Chạy dự án
### 1. Chạy backend
```bash
cd FLEX
npm start
```
Backend mặc định chạy ở cổng 5000.

### 2. Chạy frontend
```bash
cd client
npm start
```
Frontend mặc định chạy ở cổng 3000.

## Hướng dẫn sử dụng
1. Truy cập [http://localhost:3000](http://localhost:3000) trên trình duyệt.
2. Chọn nền tảng (YouTube, TikTok, Facebook hoặc Tất cả).
3. Nhập từ khóa (hoặc để trống để lấy video trend).
4. Nhấn "Tìm kiếm" để lấy danh sách video.
5. Nhấn "Tải video" để tải video về máy.

## Yêu cầu hệ thống
- Node.js >= 16
- npm >= 8
- Hệ điều hành Windows (mặc định lưu file về D:\Downloads)

## Thư viện cần cài đặt
### Backend
- axios ^1.10.0
- cheerio ^1.1.0
- cors ^2.8.5
- dotenv ^16.5.0
- express ^5.1.0
- fs-extra ^11.3.0
- puppeteer ^24.10.2
- readline-sync ^1.4.10
- youtube-dl-exec ^3.0.22

### Frontend
- @emotion/react ^11.14.0
- @emotion/styled ^11.14.0
- @mui/icons-material ^7.1.2
- @mui/material ^7.1.2
- @testing-library/dom ^10.4.0
- @testing-library/jest-dom ^6.6.3
- @testing-library/react ^16.3.0
- @testing-library/user-event ^13.5.0
- axios ^1.10.0
- react ^19.1.0
- react-dom ^19.1.0
- react-scripts 5.0.1
- web-vitals ^2.1.4

## Ghi chú
- Video và file tóm tắt sẽ được lưu vào thư mục `D:\Downloads`.
- Nếu muốn thay đổi thư mục lưu, sửa hàm `getDownloadsFolder` trong `src/downloader.js` và `src/summarizer.js`.

## Đóng góp
Mọi đóng góp, báo lỗi hoặc ý tưởng mới đều được hoan nghênh! 