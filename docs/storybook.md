# Storybook — inventory và sử dụng

Core 22.2.8 · Storybook Angular 10.6.0. Chạy npm run storybook (port 6006); build bằng npm run build-storybook. Mỗi story dùng component thật của portal và provider chung; không bootstrap auth, interceptors hoặc main.ts.

Chọn Docs để xem source và hướng dẫn. Các playground có controls ngay trong canvas, đồng bộ với code example. DataStates có Controls cho state/title/message; ReferenceTabs cho phép thử chuyển tab. Các state không áp dụng cho một primitive không được thêm giả tạo.

## Inventory

47 entry source: 46 demo hiện có (anchor route container dùng demo Basic làm canvas), cộng Unsaved changes. Ba story bổ sung: Services/loading → DataStates cho SdDataState; Components/anchor → ReferenceTabs cho SdTabGroup/SdTab. Components/section/section-item → ReadOnlyFields cho SdView. Tổng 50 story tương tác, ngoài các trang autodocs.

| Demo | Trạng thái | Source |
| --- | --- | --- |
| Components/anchor | covered | [anchor/anchor.stories.ts](../src/modules/components/features/anchor/anchor.stories.ts) |
| Components/anchor/basic | covered | [basic/basic.stories.ts](../src/modules/components/features/anchor/basic/basic.stories.ts) |
| Components/anchor/with-section | covered | [with-section/with-section.stories.ts](../src/modules/components/features/anchor/with-section/with-section.stories.ts) |
| Components/avatar | covered | [avatar/avatar.stories.ts](../src/modules/components/features/avatar/avatar.stories.ts) |
| Components/badge | covered | [badge/badge.stories.ts](../src/modules/components/features/badge/badge.stories.ts) |
| Components/button | covered | [button/button.stories.ts](../src/modules/components/features/button/button.stories.ts) |
| Components/modal/basic | covered | [basic/basic.stories.ts](../src/modules/components/features/modal/basic/basic.stories.ts) |
| Components/modal/slots | covered | [slots/slots.stories.ts](../src/modules/components/features/modal/slots/slots.stories.ts) |
| Components/modal/view-modes | covered | [view-modes/view-modes.stories.ts](../src/modules/components/features/modal/view-modes/view-modes.stories.ts) |
| Components/preview-image | covered | [preview-image/preview-image.stories.ts](../src/modules/components/features/preview-image/preview-image.stories.ts) |
| Components/preview-pdf | covered | [preview-pdf/preview-pdf.stories.ts](../src/modules/components/features/preview-pdf/preview-pdf.stories.ts) |
| Components/query-bar/basic | covered | [basic/basic.stories.ts](../src/modules/components/features/query-bar/basic/basic.stories.ts) |
| Components/query-bar/fields | covered | [fields/fields.stories.ts](../src/modules/components/features/query-bar/fields/fields.stories.ts) |
| Components/query-bar/modes | covered | [modes/modes.stories.ts](../src/modules/components/features/query-bar/modes/modes.stories.ts) |
| Components/section/basic | covered | [basic/basic.stories.ts](../src/modules/components/features/section/basic/basic.stories.ts) |
| Components/section/header-slots | covered | [header-slots/header-slots.stories.ts](../src/modules/components/features/section/header-slots/header-slots.stories.ts) |
| Components/section/section-item | covered | [section-item/section-item.stories.ts](../src/modules/components/features/section/section-item/section-item.stories.ts) |
| Components/side-drawer/advanced | covered | [advanced/advanced.stories.ts](../src/modules/components/features/side-drawer/advanced/advanced.stories.ts) |
| Components/side-drawer/basic | covered | [basic/basic.stories.ts](../src/modules/components/features/side-drawer/basic/basic.stories.ts) |
| Components/side-drawer/custom | covered | [custom/custom.stories.ts](../src/modules/components/features/side-drawer/custom/custom.stories.ts) |
| Components/side-drawer/loading | covered | [loading/loading.stories.ts](../src/modules/components/features/side-drawer/loading/loading.stories.ts) |
| Components/splitter | covered | [splitter/splitter.stories.ts](../src/modules/components/features/splitter/splitter.stories.ts) |
| Components/table/basic | covered | [basic/basic.stories.ts](../src/modules/components/features/table/basic/basic.stories.ts) |
| Components/table/column | covered | [column/column.stories.ts](../src/modules/components/features/table/column/column.stories.ts) |
| Components/table/filter | covered | [filter/filter.stories.ts](../src/modules/components/features/table/filter/filter.stories.ts) |
| Components/table/index-column | covered | [index-column/index-column.stories.ts](../src/modules/components/features/table/index-column/index-column.stories.ts) |
| Components/table/tree | covered | [tree/tree.stories.ts](../src/modules/components/features/table/tree/tree.stories.ts) |
| Components/upload-file | covered | [upload-file/upload-file.stories.ts](../src/modules/components/features/upload-file/upload-file.stories.ts) |
| Forms/checkbox | covered | [checkbox/checkbox.stories.ts](../src/modules/forms/features/checkbox/checkbox.stories.ts) |
| Forms/chip-calendar | covered | [chip-calendar/chip-calendar.stories.ts](../src/modules/forms/features/chip-calendar/chip-calendar.stories.ts) |
| Forms/chip | covered | [chip/chip.stories.ts](../src/modules/forms/features/chip/chip.stories.ts) |
| Forms/date | covered | [date/date.stories.ts](../src/modules/forms/features/date/date.stories.ts) |
| Forms/datetime | covered | [datetime/datetime.stories.ts](../src/modules/forms/features/datetime/datetime.stories.ts) |
| Forms/input-number | covered | [input-number/input-number.stories.ts](../src/modules/forms/features/input-number/input-number.stories.ts) |
| Forms/input | covered | [input/input.stories.ts](../src/modules/forms/features/input/input.stories.ts) |
| Forms/radio | covered | [radio/radio.stories.ts](../src/modules/forms/features/radio/radio.stories.ts) |
| Forms/select | covered | [select/select.stories.ts](../src/modules/forms/features/select/select.stories.ts) |
| Forms/switch | covered | [switch/switch.stories.ts](../src/modules/forms/features/switch/switch.stories.ts) |
| Forms/textarea | covered | [textarea/textarea.stories.ts](../src/modules/forms/features/textarea/textarea.stories.ts) |
| Forms/validation | covered | [validation/validation.stories.ts](../src/modules/forms/features/validation/validation.stories.ts) |
| Services/confirm/confirm | covered | [confirm/confirm.stories.ts](../src/modules/services/features/confirm/confirm/confirm.stories.ts) |
| Services/confirm/with-date | covered | [with-date/with-date.stories.ts](../src/modules/services/features/confirm/with-date/with-date.stories.ts) |
| Services/confirm/with-input | covered | [with-input/with-input.stories.ts](../src/modules/services/features/confirm/with-input/with-input.stories.ts) |
| Services/confirm/with-radio | covered | [with-radio/with-radio.stories.ts](../src/modules/services/features/confirm/with-radio/with-radio.stories.ts) |
| Services/loading | covered | [loading/loading.stories.ts](../src/modules/services/features/loading/loading.stories.ts) |
| Services/notify | covered | [notify/notify.stories.ts](../src/modules/services/features/notify/notify.stories.ts) |
| Services/Unsaved changes | covered | [unsaved-changes/unsaved-changes.stories.ts](../src/modules/services/features/unsaved-changes/unsaved-changes.stories.ts) |

| Phạm vi khác | Trạng thái | Lý do |
| --- | --- | --- |
| SdPageComponent, SdSection, SdSectionItem, SdBadge, input/select/button, table/drawer | covered | Dùng trực tiếp trong các playground và Pages; source trỏ đúng Core entrypoint. |
| API Core chưa có demo và chưa dùng trong Pages | deferred | Không thuộc inventory đã duyệt; không cam kết bao phủ mọi export của Core. |
| Backend thật, auth và upload endpoint | not-applicable | Đây là thư viện tham khảo với session/adapter cục bộ. |
| 12 page pattern | covered qua portal | Xem /pages và catalog; không nhân đôi logic thành một bộ story riêng. |

## Service và asset isolation

Notify/loading/confirm được gọi từ nút trong harness; các biến thể input/date/radio hiển thị kết quả. Unsaved changes cho phép Save/Discard/Continue editing, đăng ký theo lifecycle và hủy đăng ký khi unmount. Mở lại story tạo instance mới.

Upload dùng uploadLocal/fileDetails và object URL theo phiên, thu hồi URL khi unmount. Image/PDF dùng fixture nhúng hoặc asset local; broken/empty là trạng thái có chủ đích. File người dùng chọn không được gửi lên server. Cần adapter production riêng khi dùng lại component upload trong module.

## Thêm ví dụ

Tạo story cạnh component thật, dùng import Core theo entrypoint công khai, tags autodocs và mô tả hành vi/giới hạn. Mỗi instance tự sở hữu mutable state. Không import main.ts; dùng applicationConfig chung trong .storybook/preview.ts. Cập nhật inventory và kiểm tra render/interaction, rồi chạy build static.
