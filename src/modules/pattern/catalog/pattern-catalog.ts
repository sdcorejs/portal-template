export const PATTERN_PATHS: Record<string, string> = {
  'tab-group': 'tab-group',
  stepper: 'stepper',
  header: 'header',
  table: 'table',
  score: 'score',
  button: 'button',
  form: 'form',
  drawer: 'drawer',
  composition: 'composition',
};
export interface PatternGroup {
  name: string;
  description: string;
  variants: readonly (readonly [string, string, string, string])[];
}
export const PATTERN_GROUPS: Record<string, PatternGroup> = {
  'tab-group': {
    name: 'Tab Group',
    description: 'Chọn cách chia nội dung theo số nhóm, loại dữ liệu và công việc.',
    variants: [
      [
        'basic',
        'Ít nhóm, nội dung ngắn',
        '2–3 nhóm thông tin cùng một đối tượng.',
        'Tab ngang không kéo giãn. Nhãn ngắn và icon có ý nghĩa.',
      ],
      ['many', 'Nhiều nhóm nội dung', '8–12 nhóm với nhãn dài.', 'Thanh tab tự cuộn khi thiếu chỗ; không ép toàn bộ nhãn vào một hàng.'],
      [
        'counts',
        'Phân nhóm có số lượng',
        'Danh sách đơn hàng theo trạng thái.',
        'Badge dùng số lượng thật của từng nhóm; bấm hoàn tất để thấy số lượng thay đổi.',
      ],
      [
        'appearance',
        'Line / Pills / Segmented',
        'So sánh cách thể hiện cùng nội dung.',
        'Line cho nhóm nội dung; pills cho nhóm độc lập; segmented cho ít lựa chọn ngang hàng.',
      ],
      [
        'views',
        'Chuyển cách xem dữ liệu',
        'Cùng tập dữ liệu, cần bảng hoặc thẻ.',
        'Segmented cho hai cách xem. Giữ nguyên nguồn dữ liệu khi chuyển.',
      ],
      [
        'mixed',
        'Nội dung hỗn hợp',
        'Hồ sơ khách hàng gồm thông tin, đơn hàng và lịch sử.',
        'Chọn cấu trúc phù hợp từng tab, không ép mọi nội dung thành bảng.',
      ],
      [
        'table',
        'Tab chứa bảng',
        'Danh sách nhiều dòng cần tìm kiếm và phân trang.',
        'Dùng quickSearch từ option Core Table; bảng tự quản lý trang và số dòng.',
      ],
      [
        'form',
        'Form chia nhóm',
        'Các trường không bắt buộc nhập theo thứ tự.',
        'Giữ dữ liệu khi đổi tab; khi lưu, chuyển tới nhóm lỗi và báo Notify.',
      ],
      [
        'loading',
        'Tải / Rỗng / Lỗi',
        'Các tab có nguồn dữ liệu độc lập.',
        'Loading 1–2 giây; lỗi có thử lại; trạng thái rỗng có lời giải thích.',
      ],
      [
        'disabled',
        'Nhóm chưa khả dụng',
        'Nội dung phụ thuộc việc hoàn tất hồ sơ.',
        'Không chỉ vô hiệu hóa: giải thích điều kiện và cung cấp thao tác đáp ứng điều kiện.',
      ],
      ['closable', 'Mở nhiều hồ sơ', 'Đối chiếu một vài bản ghi.', 'Tab đóng được; thay tên rồi đóng để thử xác nhận dữ liệu chưa lưu.'],
    ],
  },
  stepper: {
    name: 'Stepper',
    description: 'Chia quy trình nhập dữ liệu thành các bước có mục tiêu và điều kiện rõ ràng.',
    variants: [
      ['basic', 'Quy trình ngắn', '3 bước, mỗi bước có ít trường.', 'Thông tin → Liên hệ → Xác nhận; nhập dữ liệu và thử lưu.'],
      [
        'vertical',
        'Stepper dọc',
        'Nội dung dài hoặc không gian ngang hẹp.',
        'Dùng orientation vertical của Core; chỉ hiển thị nội dung bước hiện tại.',
      ],
      ['many', 'Nhiều bước', '6 nhóm dữ liệu khác nhau.', 'Dùng bố cục dọc, nhãn theo nhiệm vụ. Giữ bước bổ sung là tùy chọn.'],
      [
        'linear',
        'Bắt buộc theo thứ tự',
        'Dữ liệu bước sau phụ thuộc bước trước.',
        'Dùng linear và stepControl; thử bấm Tiếp tục khi chưa nhập.',
      ],
      [
        'editable',
        'Quay lại chỉnh sửa',
        'Người dùng cần rà soát trước khi lưu.',
        'Từ bước xác nhận có thể mở lại từng nhóm, dữ liệu vẫn được giữ.',
      ],
      [
        'optional',
        'Bước tùy chọn',
        'Ghi chú bổ sung không bắt buộc.',
        'Đánh dấu optional và có nút Bỏ qua, không bắt người dùng điền dữ liệu giả.',
      ],
      [
        'branch',
        'Nhánh theo loại hồ sơ',
        'Cá nhân và doanh nghiệp có trường khác nhau.',
        'Doanh nghiệp có bước mã số thuế; đổi loại đưa về bước đầu để rà soát.',
      ],
      [
        'selection',
        'Chọn dữ liệu từ bảng',
        'Tạo hồ sơ từ nhiều đơn hàng.',
        'Dùng selector của Core Table; phải chọn ít nhất một dòng trước khi xác nhận.',
      ],
      [
        'lines',
        'Dữ liệu nhiều dòng',
        'Một hồ sơ có nhiều dịch vụ.',
        'Thêm/xóa dòng; kiểm tra tên và số lượng nguyên dương trước khi tiếp tục.',
      ],
      [
        'async',
        'Kiểm tra bất đồng bộ',
        'Mã hồ sơ cần kiểm tra trùng trước khi chuyển bước.',
        'CUS-001 mô phỏng mã đã tồn tại. Thử mã khác; chặn thao tác lặp trong lúc kiểm tra.',
      ],
      [
        'review',
        'Xác nhận và lưu',
        'Rà soát dữ liệu trước thao tác tạo hồ sơ.',
        'Hiển thị dữ liệu đã nhập, cho sửa từng nhóm; lưu có loading và chống gửi lặp.',
      ],
      [
        'draft',
        'Lưu nháp và tiếp tục',
        'Quy trình dài có thể bị gián đoạn.',
        'Lưu nháp vào session storage; tải lại trang rồi khôi phục. Xóa nháp khi lưu thành công.',
      ],
    ],
  },
  header: {
    name: 'Header/Footer',
    description: 'Tiêu đề và nhóm hành động theo ngữ cảnh page, Side Drawer và section.',
    variants: [
      [
        'page',
        'Page Header',
        'Năm mẫu header, mỗi mẫu có màn danh sách và chi tiết.',
        'List dùng Tạo mới/Tạo + tên entity và Import. Detail ưu tiên Chỉnh sửa primary fill bên phải; Duyệt success, Từ chối warning. Mẫu nhỏ gọn dùng icon và tooltip cho tác vụ phụ; mẫu gom nhóm dùng menu ba chấm. Create/update dùng Lưu và Quay lại. Không đặt link trở về danh sách cạnh title. Mỗi nhóm xếp từ trái sang phải: text, outline, primary fill; tác vụ ưu tiên nhất ở bên phải.',
      ],
      [
        'side-drawer',
        'Side Drawer Header',
        'Không gian header hẹp; cần giữ hành động luôn dễ thấy.',
        'Header gọn chỉ có tiêu đề, mô tả ngắn và đóng. Đặt nhóm hành động ở footer: từ trái sang phải là text, outline, primary fill; tác vụ chính nằm bên phải.',
      ],
      [
        'section',
        'Section Header',
        'Các tác vụ chỉ tác động lên một vùng nội dung.',
        'Đặt tác vụ ở header của sd-section, không có footer. Ít nhất một hành động primary fill ở bên phải; các tác vụ phụ text và outline đứng bên trái.',
      ],
    ],
  },
  table: {
    name: 'Table',
    description: 'Mẫu bảng theo nhiệm vụ: tra cứu, lọc, chọn tập, phân cấp hoặc đọc dữ liệu liên quan.',
    variants: [
      ['standard', 'Tra cứu cơ bản', 'So sánh các bản ghi phẳng theo cột.', 'Định danh có link; số căn phải; phân trang sau lọc/sort.'],
      [
        'quick-search',
        'Quick search',
        'Tìm nhanh theo mã đơn hoặc tên khách hàng.',
        'Dùng option.filter.quickSearch của sd-table; không cấu hình externalFilters cùng lúc.',
      ],
      [
        'external-filter',
        'External filter',
        'Lọc theo khách hàng và trạng thái.',
        'Dùng option.filter.externalFilters của sd-table; không cấu hình quickSearch cùng lúc.',
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
  score: {
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
  button: {
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
  form: {
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
  drawer: {
    name: 'Side Drawer',
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
  composition: {
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
