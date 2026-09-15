# Pattern — Tiêu chuẩn giao diện có code chạy

Mở **Pattern** trên sidebar, ngay trước **Pages**. Các nhóm gồm Header/Footer, Table, Score card, Button & câu chữ, Form trên page, Side Drawer; nhóm **Ghép thành page** có listing/card grid/queue/overview.

**Header/Footer** có ba submenu: **Page Header**, **Side Drawer Header**, **Section Header**. Năm biến thể Page Header (Cơ bản, Nâng cao, Tác vụ, Tác vụ nhỏ gọn, Tác vụ có gom nhóm), mỗi biến thể gồm danh sách và chi tiết, chọn bên trong page, không đưa thêm vào sidebar. **Table** có bảy submenu cho từng mẫu: tra cứu cơ bản, quick search, external filter, chọn tập, phân cấp, dữ liệu liên quan và trạng thái dữ liệu. Các nhóm còn lại giữ bộ chọn biến thể trong page.

Preview Table vừa chiều cao trang; dữ liệu cuộn trong bảng và phân trang luôn hiển thị. Bộ lọc do Core render từ `option.filter.quickSearch` hoặc `option.filter.externalFilters`, tách thành hai mẫu riêng, không bật đồng thời và không dựng thêm control lọc bên ngoài.

Quick search dùng dữ liệu local. External filter dùng `type: 'server'` với callback truy vấn dữ liệu giả lập, hỗ trợ lọc, sort, phân trang và loading 1–2 giây; Core 22.2.10 chưa áp dụng external filter trong truy vấn local. Nhập khách hàng rồi nhấn Enter để áp dụng; chọn trạng thái sẽ lọc trực tiếp.

Xem trước, Hướng dẫn và Mã nguồn dùng `SdTabGroup`/`SdTab`. Preview được giữ khi đổi tab; Mã nguồn dùng `SdCodeEditor` ở chế độ xem với ngôn ngữ TS/HTML/SCSS tương ứng.

Title màn list dùng “Danh sách + tên”, ví dụ “Danh sách đơn hàng”. Màn và drawer chi tiết có nút Chỉnh sửa khi `SdPermissionService.hasPermission` cho phép: `OMS_ORDER_C_UPDATE` cho đơn hàng, `CRM_CONTACT_C_UPDATE` cho liên hệ. Portal demo mặc định tắt kiểm tra quyền; consumer bật cấu hình quyền và cấp mã tương ứng. Drawer dùng nền mặc định của Core, không gán `bg-white`.

Header list dùng Tạo mới hoặc Tạo + tên entity, Import. Detail đặt Chỉnh sửa primary fill bên phải, Duyệt success light, Từ chối warning light và Quay lại text; create/update dùng Lưu và Quay lại. Không đặt link trở về danh sách cạnh tiêu đề. Nhóm hành động từ trái sang phải: text, outline, primary fill; tác vụ ưu tiên nhất nằm bên phải. Drawer có header gọn, tác vụ nằm ở footer; section chỉ đặt tác vụ trong header và không có footer. Các thao tác ở mẫu header trả phản hồi giả lập sau 1–2 giây để kiểm tra trạng thái loading và kết quả; đây là các mẫu bố cục, không phải form CRUD đầy đủ.

Mỗi biến thể có preview Angular, hướng dẫn chọn mẫu và source TS/HTML/SCSS từ file thực tế. Không nhúng HTML wireframe. Chuyển tab hướng dẫn/source giữ instance demo. Đổi biến thể khởi tạo phiên mới; draft chưa lưu có xác nhận trước khi rời màn.

Lỗi tác vụ trên form (validation khi lưu hoặc lưu thất bại) dùng SdNotifyService.error. Không đặt lỗi tổng quát dưới form; vẫn giữ lỗi tại từng trường để chỉ rõ dữ liệu cần sửa. Khi lưu thất bại, giữ nguyên dữ liệu và cho phép thử lại.

## Chạy trên máy khác

```sh
git checkout feat/portal-core-22-reference-pages
git pull --ff-only
npm ci
npm start
```

Dùng Node theo `engines` trong package.json: `^22.22.3 || ^24.15.0 || ^26.0.0`. App chạy tại `http://localhost:2208/patterns`. Npm prestart/prebuild tự xuất source. Không cần backend, secret hoặc account thật cho các mẫu.

## Các route

- `/pattern/header/page` (URL cũ `/pattern/header/title` chuyển về đây)
- `/pattern/header/side-drawer`
- `/pattern/header/section`
- `/pattern/table/quick-search`
- `/pattern/table/external-filter` (URL cũ `/pattern/table/filter` chuyển về đây)
- `/pattern/score/icon-filter` và `/pattern/score/icon-tile`
- `/pattern/button/async`
- `/pattern/form/lines`
- `/pattern/drawer/create`, `/pattern/drawer/update`, `/pattern/drawer/detail`
- `/pattern/composition/listing`, `/pattern/composition/cards`, `/pattern/composition/queue`, `/pattern/composition/overview`

Tại compositions, dùng nút chuyển bố cục bên trong preview để giữ các cập nhật mock của phiên. Query gồm status AND search không dấu AND region; metrics tính trên toàn bộ dataset trước lọc/phân trang. Card trạng thái là button; icon decorative. Metric chỉ đọc không có click giả. Overview drill-down chuyển sang listing trong cùng instance với status tương ứng.

Form và drawer lưu trong bộ nhớ của phiên demo; chuyển mẫu/reload khôi phục fixture. Lỗi lưu có thể bật bằng checkbox; chặn invalid/double-submit, giữ draft khi lỗi. Đây là code tham khảo cho cấu trúc và tương tác, không thực hiện auth/backend của một ứng dụng nghiệp vụ.

## Kiểm tra và source

```sh
npm run test:pattern
npm run build
npm run check:pattern
npm run test:e2e:pattern
```

`scripts/export-pattern.mjs` lần theo imports nội bộ và template/style của từng nhóm để tạo `public/pattern-source.json`. Chạy `npm run export:pattern` khi sửa mẫu, commit output cùng source. Diagnostics/screenshot kiểm thử và dist/node_modules không nằm trong commit.

Header danh sách không hiển thị trạng thái. Chỉ gom menu ba chấm khi có ít nhất hai tác vụ phụ; nếu chỉ có Import thì hiển thị trực tiếp. Các mục menu có icon. Nút đóng Side Drawer dùng chữ Đóng, không có icon.

Side Drawer Header có sáu ví dụ: tạo mới, chỉnh sửa, chi tiết, gom tác vụ ở header phải, xem bảng liên quan và chọn nhiều bản ghi. Nút mở mẫu dùng light kèm icon. Mẫu chọn dùng quick search của sd-table, hiển thị số lượng ở footer và trả dữ liệu ra màn ngoài khi xác nhận; Đóng bỏ lựa chọn chưa xác nhận. URL chuẩn là /pattern/header/side-drawer; URL sidedrawer cũ tự chuyển hướng.
