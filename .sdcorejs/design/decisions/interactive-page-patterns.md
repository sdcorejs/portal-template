---
status: implemented
feature: interactive-page-patterns
change_ref: interactive-page-patterns
owner: sdcorejs-design
commit_policy: with-change
source_spec: .sdcorejs/specs/angular/2026-09-14-interactive-page-patterns.md
source_plan: .sdcorejs/plans/angular/2026-09-14-interactive-page-patterns.md
---
# Định hướng thiết kế — Module Patterns

Cập nhật 14/09/2026: đã thực hiện module Angular theo yêu cầu implement và push của người dùng. Các phần dưới lưu lại phương án/nhận định ở thời điểm thiết kế; source và trạng thái thực hiện hiện hành xem `docs/patterns.md` và ledger Angular.

## Nguồn và phạm vi

Yêu cầu trực tiếp: đa dạng page mẫu làm tiêu chuẩn cho dev, có cả code chạy trong portal; listing có score card, click card để lọc, quick search. Bản này đề xuất chi tiết để xác nhận; không gán phê duyệt của bộ mẫu cũ cho tính năng mới.

Cập nhật từ người dùng: tổ chức trong module Patterns theo header/table/score card/button/form page/side drawer create-update-detail. Vì vậy catalog chính chuyển thành sáu nhóm pattern; bốn page trước đây nằm ở mục Ghép thành page. Giữ `change_ref` để không tạo hai bản thiết kế cạnh tranh.

Owner: portal-template; experience_scope: portal-composition. Baseline `532cef8090a44576e54eab88d7619c59817bf598`, Angular 22.1.6, Core 22.2.8. Không thay dependencies.

## Các phương án

| Phương án | Lợi ích | Đánh đổi |
| --- | --- | --- |
| Mở rộng catalog hiện có — đề xuất | Cùng shell, fixture/store, source và navigation; dev so sánh trực tiếp | Cần bổ sung metadata và kiểm tra route/catalog |
| Chỉ thêm score card vào list hiện có | Nhanh, ít thay đổi | Chưa đạt mục tiêu đa dạng page |
| Xây một ứng dụng showcase riêng | Tự do trình bày | Lặp shell/theme, code mẫu xa cấu trúc portal thực tế |

## Frontend design plan

Subject: theo dõi và xử lý đơn hàng. Audience: dev học mẫu, người vận hành thử luồng. Single job: từ chỉ số tổng hợp tới đúng tập bản ghi và hành động tiếp theo.

Giữ màn làm việc phẳng, header gọn, vùng preview rộng. Signature element là score card đóng vai trò bộ lọc có trạng thái chọn rõ: số lớn, nhãn, mô tả phạm vi, dấu chọn và viền. Không dùng số tăng trưởng không có dữ liệu kỳ trước.

| Token | Vai trò | Giá trị fallback | Ánh xạ |
| --- | --- | --- | --- |
| Surface | Nội dung/card | #ffffff | `--sd-surface` |
| Canvas | Nền vùng preview | #f8f9fa | theme light |
| Text | Nội dung chính | #212121 | `--sd-text`, black500 |
| Secondary | Metadata | #757575 | `--sd-text-secondary`, black400 |
| Action | Link, focus, card chọn | #2962ff | theme info; dùng `--sd-primary` trong code portal |
| Border | Phân vùng | #e6e6e6 | `--sd-border`, black200 |

Status dùng palette success/warning/error có sẵn; luôn có chữ. Màu warning sáng chỉ làm nền hoặc điểm nhấn, không dùng làm chữ nhỏ trên nền trắng. Không thêm font hay icon pack. Font kế thừa shell; title 20/600, metric 28/700 tabular-nums, body 14/400, label 12–13/500. Radius 6–8px, khoảng cách 8/12/16/24px, không bóng trang trí.

Desktop: score cards 4 cột, toolbar ngang, bảng có vùng cuộn riêng. Tablet: cards 2 cột, toolbar wrap. Mobile 320/390: cards 2 cột rồi 1 cột dưới 360px, quick search toàn dòng, card grid 1 cột, queue xếp dọc. Detail panel thành dialog toàn chiều rộng khả dụng.

Copy: tiếng Việt, động từ cụ thể “Xem đơn hàng”, “Đưa vào xử lý”, “Xóa bộ lọc”; nêu kết quả và cách khôi phục. Preview có nhãn dữ liệu mẫu. Metadata, lựa chọn pattern và source nằm ở hướng dẫn, không chen vào luồng nghiệp vụ khi tích hợp.

## Self-critique

Ý tưởng đầu: nhân nhiều bảng với tên khác nhau dễ tạo catalog đông nhưng ít giá trị. Điều chỉnh: bốn pattern có nhiệm vụ và hình học khác nhau: so sánh theo cột; nhận diện bằng card; xử lý theo giai đoạn; đọc tổng hợp và drill-down. Chỉ score card + query dùng chung, không tạo một component khổng lồ có nhiều cờ layout.

Điều chỉnh tiếp theo theo brief: dev cần chọn cả từng phần của page. Thêm navigation nhóm + variants + preview/rules/source. 32 biến thể có tên theo tình huống; màn phối hợp minh họa cách ghép. Code cuối cùng phải là module Angular thật, không nhúng HTML prototype làm implementation. Source preview hiện ghi rõ giới hạn HTML.

## Mobile design plan

Cập nhật scorecard theo yêu cầu: thêm bốn biến thể icon, nâng tổng số lên 36. Dùng icon cùng nét outline, kích thước 20–24px; tile 44px. Màu trạng thái luôn kèm chữ. Không thêm dependency; SVG chỉ thuộc wireframe, Angular dùng hệ icon hiện có. Mẫu icon-filter hiển thị bảng bốn dòng đầu của tập lọc để kiểm chứng hành vi, counts vẫn từ toàn bộ 24 bản ghi.

Responsive mobile web, không giả lập native app. Dùng tra cứu nhanh hoặc mở một hồ sơ; ngữ cảnh này là giả định cần xác nhận. Touch target ≥44px, input font 16px, nút đóng dialog có tên, Escape đóng và trả focus. Không bắt buộc kéo thả để đổi giai đoạn. Safe area dùng env() cho dialog. Không auto-focus search khi chuyển page trên điện thoại; bàn phím không che hành động. Zoom 200% không mất nội dung; giảm motion theo hệ thống.

Dữ liệu mock không cần mạng sau khi tải HTML; không mô tả đó là offline support của portal. Mất mạng/lỗi tải được mô phỏng bằng state selector; retry khôi phục cùng query. Bản production phải giữ form khi save lỗi và xử lý resume theo store hiện có; prototype này không có autosave/background sync.

## Ranh giới và triển khai

Chi tiết component, state, tương tác, route và kế hoạch thực hiện ở [spec](../specs/interactive-page-patterns.md). HTML là wireframe tương tác dùng để duyệt, không phải mã Angular đã tích hợp hay bằng chứng build portal.
