---
status: implemented
feature: interactive-page-patterns
change_ref: interactive-page-patterns
owner: sdcorejs-design
commit_policy: with-change
source_spec: .sdcorejs/specs/angular/2026-09-14-interactive-page-patterns.md
source_plan: .sdcorejs/plans/angular/2026-09-14-interactive-page-patterns.md
---
# Luồng thử và nghiệm thu

Cập nhật 14/09/2026: đã thực hiện module Angular theo yêu cầu implement và push của người dùng. Các phần dưới lưu lại phương án/nhận định ở thời điểm thiết kế; source và trạng thái thực hiện hiện hành xem `docs/patterns.md` và ledger Angular.

Điểm vào hiện tại: Patterns / Header. Chọn nhóm → chọn biến thể → thử preview → đọc Khi dùng/Quy tắc → mở Source HTML. Mục Ghép thành page chứa bốn luồng page dưới đây. Các URL route trong spec là mục tiêu Angular, chưa triển khai trong portal.

| Luồng | Thao tác | Kết quả | AC |
| --- | --- | --- | --- |
| Tìm đơn cần xử lý | Listing → Chờ xử lý → nhập “an phat” → chọn Miền Bắc | AND query, trang đầu, summary toàn dataset giữ nguyên | IP-01/02 |
| Không tìm được | Nhập mã không tồn tại → Xóa bộ lọc | No-results, sau reset thấy dataset | IP-04 |
| So sánh đơn | Sort giá trị → trang tiếp → mở mã hồ sơ → đóng | Cùng sort/page/filter, focus về opener | IP-03/05 |
| Duyệt theo card | Card grid → search → mở card | Grid chỉ chứa tập phù hợp, detail record đúng | IP-02/05 |
| Xử lý queue | Queue → Chờ xử lý → Đưa vào xử lý | Record chuyển cột, counts thay đổi, feedback | IP-06 |
| Drill-down | Tổng quan → Chờ xử lý | Listing với status=pending, result count phù hợp | IP-07 |
| Lỗi dữ liệu | State error → thử lại | Query giữ nguyên, data render lại | IP-04 |
| Thiết bị nhỏ | 390px → chọn card → search → xem detail → đóng | Không overflow trang, control đủ lớn, nội dung không che | IP-09 |
| Header theo tình huống | Header → detail/status/description/actions/editing | Title/back/status/description/actions đúng cấu trúc | IP-11 |
| Chọn tập bản ghi | Table → Selection → chọn một dòng → chọn tất cả → Duyệt | Indeterminate và số chọn đúng; bulk tác động dòng chọn | IP-15 |
| Form dòng hàng | Form → Header + dòng hàng → Thêm dòng → đổi số lượng/giá | Tổng tính lại; xóa dòng cập nhật tổng; thiếu dòng không lưu | IP-13 |
| Drawer có draft | Drawer → Create → nhập tên → Escape → Tiếp tục chỉnh sửa | Không mất draft, focus về input | IP-14 |
| Drawer lỗi lưu | Điền form hợp lệ → mô phỏng lỗi → Lưu → tắt lỗi → Lưu | Giữ input khi lỗi, cập nhật record khi thành công, trả focus opener | IP-14 |
| Detail sang update | Drawer → Detail → Chỉnh sửa | Chỉ detail có facts, update prefill đúng record đã lưu | IP-14 |
| Scorecard có icon | Score card → Icon + click để lọc → focus Chờ xử lý → Enter → Space | Enter lọc đúng pending; Space trên card đang chọn trả về Tất cả; counts không đổi | IP-16 |

Wireframe có sáu nhóm nền tảng và bốn tab composition; khi triển khai dùng route thật và shell hiện tại. Composition modal vẫn chỉ đọc. Nhóm Drawer có create/update/detail, dirty guard và mock save trong bộ nhớ riêng để duyệt tương tác; không thay thế Angular/Core drawer/unsaved guard. Header button và button-copy demo có nhãn phản hồi minh họa, không tự nhận nghiệp vụ chưa thực hiện.
