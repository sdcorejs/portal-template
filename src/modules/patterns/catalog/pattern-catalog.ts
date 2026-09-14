export interface PatternGroup {
  name: string;
  description: string;
  variants: readonly (readonly [string, string, string, string])[];
}
export const PATTERN_GROUPS: Record<string, PatternGroup> = {
  headers: {
    name: 'Header',
    description: 'Chọn header theo ngữ cảnh của trang, mức độ thông tin và hành động chính.',
    variants: [
      ['title', 'Chỉ có title', 'Màn danh sách đơn giản, tên trang đã đủ rõ.', 'Giữ một heading chính; không thêm mô tả lặp lại tên.'],
      [
        'description',
        'Title + mô tả ngắn',
        'Cần giải thích ngắn phạm vi hoặc nhiệm vụ của màn.',
        'Mô tả một câu; hướng dẫn dài đặt ở khu vực riêng.',
      ],
      [
        'detail',
        'Header màn detail',
        'Xem một hồ sơ và quay lại danh sách.',
        'Có back, mã/tên bản ghi. Quay lại giữ query và vị trí danh sách.',
      ],
      [
        'status',
        'Title + status',
        'Trạng thái ảnh hưởng quyết định xử lý hồ sơ.',
        'Badge nằm cạnh title, wrap khi dài; luôn có nhãn, không chỉ màu.',
      ],
      [
        'actions',
        'Title + nhóm hành động',
        'Có một hành động chính và hành động phụ.',
        'Tối đa một CTA nổi bật; action phụ dùng outline/text.',
      ],
      [
        'editing',
        'Header create / update',
        'Đang nhập hoặc chỉnh sửa hồ sơ.',
        'Tên màn nêu thao tác; hành động lưu/hủy có cùng vị trí, không nhân đôi CTA.',
      ],
    ],
  },
  tables: {
    name: 'Table',
    description: 'Mẫu bảng theo nhiệm vụ: tra cứu, lọc, chọn tập, phân cấp hoặc đọc dữ liệu liên quan.',
    variants: [
      ['standard', 'Tra cứu cơ bản', 'So sánh các bản ghi phẳng theo cột.', 'Định danh có link; số căn phải; phân trang sau lọc/sort.'],
      [
        'filter',
        'Quick search + filter',
        'Cần tìm nhanh rồi thu hẹp trạng thái/khu vực.',
        'Một query owner; các điều kiện kết hợp AND, đổi filter về trang đầu.',
      ],
      [
        'selection',
        'Chọn nhiều + bulk action',
        'Thao tác trên tập bản ghi được chọn.',
        'Chỉ chọn current page; thể hiện số lượng và indeterminate; đổi query xóa selection.',
      ],
      [
        'tree',
        'Bảng phân cấp',
        'Dữ liệu có quan hệ cha–con thực tế.',
        'Có nút expand bằng bàn phím; không giả lập phân cấp chỉ bằng thụt lề.',
      ],
      [
        'related',
        'Bảng dòng liên quan',
        'Dòng hàng thuộc một bản ghi chính.',
        'Thông tin header không lặp lại từng dòng; tổng lấy từ số lượng × đơn giá.',
      ],
      [
        'states',
        'Loading / empty / error',
        'Chưa có hoặc chưa lấy được dữ liệu.',
        'Phân biệt empty với no-results; error có retry giữ query.',
      ],
    ],
  },
  scores: {
    name: 'Score card',
    description: 'Phân biệt chỉ số đọc, bộ lọc nhanh và điểm bắt đầu drill-down.',
    variants: [
      [
        'metric',
        'Metric chỉ đọc',
        'Hiển thị tổng tiền hoặc số lượng.',
        'Có đơn vị và phạm vi; không tạo hover/cursor hành động khi không click được.',
      ],
      [
        'icon-inline',
        'Icon cạnh nhãn',
        'Cần nhận diện nhanh chỉ số trong không gian gọn.',
        'Icon 20–24px cùng hàng nhãn; giá trị vẫn là điểm nhìn chính. Icon không thay tên chỉ số.',
      ],
      [
        'icon-tile',
        'Icon trong nền màu',
        'Nhóm chỉ số tổng quan cần phân biệt nhanh theo ý nghĩa.',
        'Icon 24px trong ô 44px; màu theo vai trò/status, cùng một phong cách icon. Metric chỉ đọc không có hành vi click.',
      ],
      [
        'icon-status',
        'Icon trạng thái',
        'Theo dõi số bản ghi ở từng bước xử lý.',
        'Clock / đang xử lý / check đi cùng nhãn trạng thái; chữ giải thích ý nghĩa, không chỉ màu.',
      ],
      [
        'icon-filter',
        'Icon + click để lọc',
        'Chọn nhanh tập bản ghi qua score card có icon.',
        'Cả card là một button, icon decorative; aria-pressed và dấu chọn thể hiện selection. Click lại về Tất cả; counts không đổi theo lựa chọn.',
      ],
      [
        'filter',
        'Count card để lọc',
        'Chuyển nhanh giữa các trạng thái của danh sách.',
        'Một card được chọn; aria-pressed, toggle, count toàn bộ dataset, giao tập với search.',
      ],
      [
        'progress',
        'Tiến độ / tỷ lệ',
        'Theo dõi phần hoàn thành trên tổng có nghĩa.',
        'Hiển thị cả tử số/mẫu số; tổng 0 thì 0%, không chia cho 0.',
      ],
      [
        'comparison',
        'So sánh hai kỳ',
        'Có dữ liệu kỳ hiện tại và kỳ trước cùng định nghĩa.',
        'Delta ghi đơn vị và kỳ; không mặc định tăng là tốt cho mọi chỉ số.',
      ],
      ['compact', 'Score card gọn', 'Không gian hẹp hoặc nhóm chỉ số phụ.', 'Giảm khoảng trắng, không giảm chữ đến khó đọc.'],
    ],
  },
  buttons: {
    name: 'Button & câu chữ',
    description: 'Tên nút mô tả chính xác kết quả, thống nhất với mode và trạng thái thao tác.',
    variants: [
      [
        'crud',
        'Create / update / detail',
        'Tạo mới, chỉnh sửa và xem hồ sơ.',
        'Tạo đơn hàng → Lưu thay đổi → Chỉnh sửa; tránh dùng một chữ Lưu cho mọi ngữ cảnh.',
      ],
      [
        'query',
        'Search / filter',
        'Tìm và điều chỉnh tập kết quả.',
        'Tìm kiếm, Áp dụng bộ lọc, Xóa bộ lọc; live search không thêm nút Tìm kiếm dư thừa.',
      ],
      [
        'workflow',
        'Hành động nghiệp vụ',
        'Chuyển bước xử lý có kết quả rõ.',
        'Gửi duyệt, Duyệt đơn hàng, Từ chối; đừng dùng Xác nhận khi không rõ xác nhận gì.',
      ],
      [
        'danger',
        'Hành động nguy hiểm',
        'Xóa hoặc hủy một đối tượng cụ thể.',
        'Ghi tên và hậu quả trong bước xác nhận; nút cuối là Xóa đơn hàng, nút thoát Giữ lại.',
      ],
      ['async', 'Đang lưu / lỗi / thử lại', 'Thao tác bất đồng bộ.', 'Đang lưu… disabled chống gửi lặp; lỗi giữ input và có Thử lại.'],
    ],
  },
  forms: {
    name: 'Form trên page',
    description: 'Layout theo cấu trúc dữ liệu, dùng cùng form cho create/update và chuyển sang read-only ở detail.',
    variants: [
      ['simple', 'Một cột ngắn', 'Một nhóm trường ngắn, cùng ý nghĩa.', 'Giới hạn chiều rộng đọc; label trên control; lỗi cạnh trường.'],
      [
        'two-column',
        'Hai cột cân đối',
        'Thông tin ngắn có thể đối chiếu theo hàng.',
        'Tab order theo DOM; trường dài chiếm cả dòng; mobile thành một cột.',
      ],
      [
        'sections',
        'Chia section',
        'Nhiều nhóm thông tin có ý nghĩa khác nhau.',
        'Heading nhóm rõ ràng; một footer lưu chung cho một giao dịch.',
      ],
      ['lines', 'Header + dòng hàng', 'Đơn hàng có tập dòng con và tổng tiền.', 'Add/remove/recalculate; dòng chưa hợp lệ không được lưu.'],
      [
        'readonly',
        'Detail dạng label/value',
        'Xem dữ liệu đã lưu.',
        'Không trình bày toàn bộ dữ liệu bằng input disabled; giữ thứ tự nhóm như form.',
      ],
    ],
  },
  drawers: {
    name: 'Side drawer',
    description: 'Thao tác trong ngữ cảnh danh sách: header rõ mode, body cuộn riêng, footer ổn định.',
    variants: [
      [
        'create',
        'Create · Tạo mới',
        'Nhập một hồ sơ ngắn mà không rời danh sách.',
        'Form rỗng; nút Tạo liên hệ / Hủy; validation và pending state.',
      ],
      [
        'update',
        'Update · Chỉnh sửa',
        'Thay đổi một hồ sơ đã chọn.',
        'Prefill record; Lưu thay đổi / Hủy; chỉ dirty khi giá trị khác bản đã lưu.',
      ],
      ['detail', 'Detail · Xem thông tin', 'Đọc nhanh rồi quay lại danh sách.', 'Label/value; Chỉnh sửa / Đóng; không hiển thị nút Lưu.'],
      [
        'sections',
        'Drawer nhiều section',
        'Một hồ sơ có vài nhóm ngắn cần cùng giao dịch.',
        'Rộng 640–800px nếu cần; nội dung dài/phức tạp ưu tiên full page.',
      ],
      [
        'dirty',
        'Đóng khi chưa lưu',
        'Ngăn mất draft do Escape/nút đóng.',
        'Giữ drawer khi dirty; Tiếp tục chỉnh sửa hoặc Bỏ thay đổi. Khi saving chặn đóng.',
      ],
    ],
  },
  compositions: {
    name: 'Ghép thành page',
    description: 'Phối hợp patterns thành các màn làm việc có tương tác.',
    variants: [
      ['listing', 'Listing + score card', 'So sánh bản ghi theo cột.', 'Count toàn bộ dữ liệu; query AND trước sort/phân trang.'],
      ['cards', 'Danh sách dạng card', 'Nhận diện hồ sơ có metadata ngắn.', 'Không dùng khi cần so sánh nhiều cột.'],
      ['queue', 'Hàng đợi xử lý', 'Theo dõi bản ghi theo giai đoạn.', 'Đổi trạng thái bằng nút, không phụ thuộc kéo thả.'],
      ['overview', 'Tổng quan vận hành', 'Từ chỉ số tới danh sách cần xử lý.', 'Drill-down giữ cùng tập dữ liệu.'],
    ],
  },
};
