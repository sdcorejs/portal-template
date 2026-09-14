# Patterns — Tiêu chuẩn giao diện có code chạy

Mở **Patterns** trên sidebar. Có 36 biến thể thuộc Header, Table, Score card, Button & câu chữ, Form trên page, Side drawer; nhóm **Ghép thành page** có listing/card grid/queue/overview.

Mỗi biến thể có preview Angular, hướng dẫn chọn mẫu và source TS/HTML/SCSS từ file thực tế. Không nhúng HTML wireframe. Chuyển tab hướng dẫn/source giữ instance demo. Đổi biến thể khởi tạo phiên mới; draft chưa lưu có xác nhận trước khi rời màn.

## Chạy trên máy khác

```sh
git checkout feat/portal-core-22-reference-pages
git pull --ff-only
npm ci
npm start
```

Dùng Node theo `engines` trong package.json: `^22.22.3 || ^24.15.0 || ^26.0.0`. App chạy tại `http://localhost:2208/patterns`. Npm prestart/prebuild tự xuất source. Không cần backend, secret hoặc account thật cho các mẫu.

## Các route

- `/patterns/headers/title`
- `/patterns/tables/filter`
- `/patterns/scores/icon-filter` và `/patterns/scores/icon-tile`
- `/patterns/buttons/async`
- `/patterns/forms/lines`
- `/patterns/drawers/create`, `/patterns/drawers/update`, `/patterns/drawers/detail`
- `/patterns/compositions/listing`, `/patterns/compositions/cards`, `/patterns/compositions/queue`, `/patterns/compositions/overview`

Tại compositions, dùng nút chuyển bố cục bên trong preview để giữ các cập nhật mock của phiên. Query gồm status AND search không dấu AND region; metrics tính trên toàn bộ dataset trước lọc/phân trang. Card trạng thái là button; icon decorative. Metric chỉ đọc không có click giả. Overview drill-down chuyển sang listing trong cùng instance với status tương ứng.

Form và drawer lưu trong bộ nhớ của phiên demo; chuyển mẫu/reload khôi phục fixture. Lỗi lưu có thể bật bằng checkbox; chặn invalid/double-submit, giữ draft khi lỗi. Đây là code tham khảo cho cấu trúc và tương tác, không thực hiện auth/backend của một ứng dụng nghiệp vụ.

## Kiểm tra và source

```sh
npm run test:patterns
npm run build
npm run check:patterns
npm run test:e2e:patterns
```

`scripts/export-patterns.mjs` lần theo imports nội bộ và template/style của từng nhóm để tạo `public/patterns-source.json`. Chạy `npm run export:patterns` khi sửa mẫu, commit output cùng source. Diagnostics/screenshot kiểm thử và dist/node_modules không nằm trong commit.
