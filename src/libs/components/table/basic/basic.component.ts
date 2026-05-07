import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection } from '@sd-angular/core/components/section';
import { SdTable, SdTableColumn, SdTableFilterRequest, SdTableOption } from '@sd-angular/core/components/table';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdSwitch } from '@sd-angular/core/forms/switch';
import { SdPageComponent } from '@sd-angular/core/modules/layout';

interface Employee {
  id: number;
  fullName: string;
  email: string;
  department: string;
  level: string;
  salary: number;
  birthDate: string;
  createdAt: string;
  isActive: boolean;
}

const DEPARTMENT_OPTIONS = [
  { id: 'IT', name: 'Công nghệ thông tin' },
  { id: 'HR', name: 'Nhân sự & Đào tạo' },
  { id: 'FIN', name: 'Tài chính & Kế toán' },
  { id: 'MKT', name: 'Marketing' },
  { id: 'OPS', name: 'Vận hành' },
];

const LEVEL_OPTIONS = [
  { id: 'junior', name: 'Junior' },
  { id: 'mid', name: 'Middle' },
  { id: 'senior', name: 'Senior' },
  { id: 'lead', name: 'Team Lead' },
];

@Component({
  selector: 'app-table-basic',
  standalone: true,
  imports: [CommonModule, FormsModule, SdTable, SdCodeEditor, SdPageComponent, SdSection, SdSelect, SdSwitch],
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableBasicComponent {
  // ---- Config signals ----
  tableType = signal<'local' | 'server'>('local');
  pageSize = signal<number>(5);
  showConfig = signal(true);
  showReload = signal(false);
  showExport = signal(false);
  showSelector = signal(true);
  lastRequest = signal<string>('Chưa có yêu cầu nào');

  tableTypeOptions = [
    { id: 'local', name: 'local — Xử lý phía client' },
    { id: 'server', name: 'server — Gọi API phía server' },
  ];
  pageSizeOptions = [
    { id: 5,  name: '5'  },
    { id: 10, name: '10' },
    { id: 25, name: '25' },
  ];

  pageDescription = computed(() =>
    this.tableType() === 'local'
      ? 'Kiểu local xử lý lọc, sắp xếp và phân trang hoàn toàn phía client. Toàn bộ dữ liệu được tải một lần — phù hợp cho danh sách nhỏ. Mỗi kiểu cột (string, number, date, boolean, values) có bộ lọc và hiển thị riêng.'
      : 'Kiểu server: mỗi lần lọc, sắp xếp hoặc chuyển trang, component gọi hàm items() với filterRequest (thông tin lọc + phân trang) và pagingReq (cấu trúc chuẩn gửi API). Server trả về { items, total }.'
  );

  // ---- Reactive table option ----
  tableOption = computed((): SdTableOption<Employee> => {
    const shared = {
      key: 'table-basic-demo',
      columns: this.buildColumns(),
      config: { visible: this.showConfig() },
      reload: this.showReload() ? { visible: true } : undefined,
      export: this.showExport()
        ? { visible: 'ALL' as const, items: () => this.getMockData() }
        : undefined,
      selector: { visible: this.showSelector() },
      paginate: { pageSize: this.pageSize(), pages: [5, 10, 25] },
      filter: { hideExternalFilterToolbar: true },
    };
    if (this.tableType() === 'server') {
      return { ...shared, type: 'server', items: (fr, pq) => this.simulateServerCall(fr, pq) };
    }
    return { ...shared, type: 'local', items: () => this.getMockData() };
  });

  private buildColumns(): SdTableColumn<Employee>[] {
    return [
      {
        field: 'id',
        title: 'ID',
        type: 'number',
        width: '70px',
        align: 'right',
        filter: { disabled: true },
        sortable: false,
      },
      {
        field: 'fullName',
        title: 'Họ và tên',
        type: 'string',
        width: '200px',
        copiable: true,
        description: 'type: string — copiable: true cho phép sao chép nội dung ô',
      },
      {
        field: 'email',
        title: 'Email',
        type: 'string',
        width: '220px',
        copiable: true,
        description: 'type: string — hỗ trợ htmlTemplate, transform, tooltip',
      },
      {
        field: 'department',
        title: 'Phòng ban',
        type: 'values',
        width: '195px',
        description: 'type: values — tra cứu nhãn từ danh sách tĩnh (items, valueField, displayField)',
        option: { items: DEPARTMENT_OPTIONS, valueField: 'id', displayField: 'name' },
      },
      {
        field: 'level',
        title: 'Cấp độ',
        type: 'values',
        width: '120px',
        description: 'type: values — field lưu khoá, hiển thị nhãn tương ứng',
        option: { items: LEVEL_OPTIONS, valueField: 'id', displayField: 'name' },
      },
      {
        field: 'salary',
        title: 'Lương (VNĐ)',
        type: 'number',
        width: '155px',
        align: 'right',
        description: 'type: number — align: right, lọc khoảng qua filter.type: split-number',
      },
      {
        field: 'birthDate',
        title: 'Ngày sinh',
        type: 'date',
        width: '135px',
        description: 'type: date — hiển thị định dạng ngày, lọc theo ngày hoặc khoảng ngày',
      },
      {
        field: 'createdAt',
        title: 'Ngày tạo',
        type: 'datetime',
        width: '165px',
        description: 'type: datetime — hiển thị cả ngày và giờ',
      },
      {
        field: 'isActive',
        title: 'Trạng thái',
        type: 'boolean',
        width: '135px',
        description: 'type: boolean — tuỳ chỉnh nhãn qua option.displayOnTrue / displayOnFalse',
        option: { displayOnTrue: 'Hoạt động', displayOnFalse: 'Tạm ngừng' },
      },
    ];
  }

  tsCode = computed(() => {
    const type = this.tableType();
    const ps = this.pageSize();
    const cfg = this.showConfig();
    const rld = this.showReload();
    const exp = this.showExport();
    const sel = this.showSelector();
    if (type === 'local') {
      return `tableOption: SdTableOption<Employee> = {
  type: 'local',
  key: 'my-table',                   // Cache key: lưu cấu hình cột ẩn/hiện
  items: () => this.getEmployees(),  // Trả về T[] hoặc Promise<T[]>

  columns: [
    // string — copiable: true cho phép copy ô
    { field: 'fullName', title: 'Họ và tên', type: 'string', copiable: true },
    // number — align: right, lọc khoảng
    { field: 'salary',   title: 'Lương',     type: 'number', align: 'right' },
    // date / datetime
    { field: 'birthDate', title: 'Ngày sinh', type: 'date'     },
    { field: 'createdAt', title: 'Ngày tạo',  type: 'datetime' },
    // boolean — nhãn tuỳ chỉnh
    { field: 'isActive', title: 'Trạng thái', type: 'boolean',
      option: { displayOnTrue: 'Hoạt động', displayOnFalse: 'Tạm ngừng' } },
    // values — tra cứu từ danh sách
    { field: 'department', title: 'Phòng ban', type: 'values',
      option: { items: DEPT_OPTIONS, valueField: 'id', displayField: 'name' } },
  ],
${cfg ? `  config:   { visible: true },  // Nút thiết lập hiển thị cột\n` : ''}${rld ? `  reload:   { visible: true },  // Nút tải lại dữ liệu\n` : ''}${sel ? `  selector: { visible: true },  // Cột checkbox chọn dòng\n` : ''}${exp ? `  export:   { visible: 'ALL', items: () => this.getEmployees() },  // Nút Export\n` : ''}
  paginate: { pageSize: ${ps}, pages: [5, 10, 25] },
};`;
    }
    return `tableOption: SdTableOption<Employee> = {
  type: 'server',
  key: 'my-table',
  // filterRequest: { pageNumber, pageSize, rawColumnFilter, rawExternalFilter, orderBy, orderDirection }
  // pagingReq:     { filters[], orders[], pageNumber, pageSize } — cấu trúc chuẩn backend
  items: async (filterRequest, pagingReq) => {
    const response = await this.employeeService.search(pagingReq);
    return { items: response.data, total: response.total };
  },

  columns: [ /* ... */ ],
${cfg ? `  config:   { visible: true },  // Nút thiết lập hiển thị cột\n` : ''}${rld ? `  reload:   { visible: true },  // Nút tải lại\n` : ''}${sel ? `  selector: { visible: true },  // Cột checkbox\n` : ''}${exp ? `  export:   { visible: 'ALL', items: () => this.getAllEmployees() },\n` : ''}
  paginate: { pageSize: ${ps}, pages: [5, 10, 25] },
};`;
  });

  // ── Server simulation ────────────────────────────────────────────────────────
  private simulateServerCall(
    filterRequest: SdTableFilterRequest<Employee>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _pagingReq: any
  ): Promise<{ items: Employee[]; total: number }> {
    const allData = this.getMockData();
    const { pageNumber, pageSize } = filterRequest;
    const items = allData.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
    this.lastRequest.set(`Trang ${pageNumber + 1}, ${pageSize} dòng/trang — Tổng: ${allData.length}`);
    return new Promise(resolve => setTimeout(() => resolve({ items, total: allData.length }), 300));
  }

  private getMockData(): Employee[] {
    const firstNames = [
      'Văn An', 'Thị Bình', 'Hoàng Cường', 'Thu Dung', 'Minh Đức',
      'Thị Lan', 'Văn Hùng', 'Thị Mai', 'Quang Nam', 'Thị Oanh',
    ];
    const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô'];
    const depts = ['IT', 'HR', 'FIN', 'MKT', 'OPS'];
    const levels = ['junior', 'mid', 'senior', 'lead'];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      fullName: `${lastNames[i % lastNames.length]} ${firstNames[i % firstNames.length]}`,
      email: `user${i + 1}@company.vn`,
      department: depts[i % depts.length],
      level: levels[i % levels.length],
      salary: (8 + (i % 7) * 3) * 1_000_000,
      birthDate: new Date(1985 + (i % 15), i % 12, (i % 28) + 1).toISOString(),
      createdAt: new Date(2022 + Math.floor(i / 12), i % 12, (i % 28) + 1, 8 + (i % 4), i % 60).toISOString(),
      isActive: i % 4 !== 3,
    }));
  }
}
