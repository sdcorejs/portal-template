import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection } from '@sd-angular/core/components/section';
import { SdTable, SdTableOption } from '@sd-angular/core/components/table';
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
  selector: 'app-table-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, SdTable, SdCodeEditor, SdPageComponent, SdSection, SdSelect, SdSwitch],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableFilterComponent {
  pageDescription = signal(
    'Lọc cột (inline): ô lọc hiển thị ngay trong header mỗi cột. Lọc ngoài (external): panel riêng phía trên bảng với nhiều loại input. Hai chế độ có thể bật đồng thời hoặc chỉ dùng một.'
  );

  // ---- Config signals ----
  showInlineFilter = signal(true);
  showExternalFilter = signal(false);
  hideExternalFilterToolbar = signal(false);
  externalFilterPerRow = signal<number>(6);
  disableSalaryFilter = signal(false);
  disableLevelFilter = signal(false);
  enableNameOperator = signal(false);

  perRowOptions = [
    { id: 4, name: '4 mỗi hàng' },
    { id: 6, name: '6 mỗi hàng' },
  ];

  // ---- Reactive table option ----
  tableOption = computed((): SdTableOption<Employee> => ({
    type: 'local',
    key: 'table-filter-demo',
    items: () => this.getMockData(),
    columns: [
      {
        field: 'fullName',
        title: 'Họ và tên',
        type: 'string',
        width: '200px',
        filter: this.enableNameOperator()
          ? { operator: { enable: true, list: ['CONTAIN', 'EQUAL', 'START_WITH'] } }
          : undefined,
      },
      { field: 'email', title: 'Email', type: 'string', width: '220px' },
      {
        field: 'department',
        title: 'Phòng ban',
        type: 'values',
        width: '195px',
        option: { items: DEPARTMENT_OPTIONS, valueField: 'id', displayField: 'name' },
      },
      {
        field: 'level',
        title: 'Cấp độ',
        type: 'values',
        width: '120px',
        option: { items: LEVEL_OPTIONS, valueField: 'id', displayField: 'name' },
        filter: { disabled: this.disableLevelFilter() },
      },
      {
        field: 'salary',
        title: 'Lương (VNĐ)',
        type: 'number',
        width: '155px',
        align: 'right',
        filter: { disabled: this.disableSalaryFilter() },
      },
      { field: 'birthDate', title: 'Ngày sinh', type: 'date', width: '135px' },
      {
        field: 'isActive',
        title: 'Trạng thái',
        type: 'boolean',
        width: '135px',
        option: { displayOnTrue: 'Hoạt động', displayOnFalse: 'Tạm ngừng' },
      },
    ],
    filter: {
      hideInlineFilter: !this.showInlineFilter(),
      externalFilters: this.showExternalFilter()
        ? [
            { field: 'fullName', title: 'Họ và tên', type: 'string', defaultShowing: true },
            {
              field: 'department', title: 'Phòng ban', type: 'values', defaultShowing: true,
              option: { items: DEPARTMENT_OPTIONS, valueField: 'id', displayField: 'name', selection: 'MULTIPLE' },
            },
            {
              field: 'level', title: 'Cấp độ', type: 'values', defaultShowing: true,
              option: { items: LEVEL_OPTIONS, valueField: 'id', displayField: 'name', selection: 'MULTIPLE' },
            },
            { field: 'salary', title: 'Mức lương (VNĐ)', type: 'number', defaultShowing: true },
            { field: 'birthDate', title: 'Khoảng ngày sinh', type: 'daterange', defaultShowing: true },
            { field: 'isActive', title: 'Trạng thái', type: 'boolean', defaultShowing: true },
          ]
        : undefined,
      hideExternalFilterToolbar: this.showExternalFilter() ? this.hideExternalFilterToolbar() : undefined,
      externalFilterPerRow: this.showExternalFilter() ? (this.externalFilterPerRow() as 4 | 6) : undefined,
    },
    paginate: { pageSize: 10 },
  }));

  tsCode = computed(() => {
    const showInline = this.showInlineFilter();
    const showExt = this.showExternalFilter();
    const hideToolbar = this.hideExternalFilterToolbar();
    const perRow = this.externalFilterPerRow();
    const disableSalary = this.disableSalaryFilter();
    const disableLevel = this.disableLevelFilter();
    const enableOp = this.enableNameOperator();
    return `tableOption: SdTableOption<Employee> = {
  type: 'local',
  items: () => this.getEmployees(),
  columns: [
    {
      field: 'fullName',
      title: 'Họ và tên',
      type: 'string',${
        enableOp
          ? `
      // Bật selector cho phép người dùng chọn kiểu so sánh
      filter: { operator: { enable: true, list: ['CONTAIN', 'EQUAL', 'START_WITH'] } },`
          : ''
      }
    },
    {
      field: 'level',
      title: 'Cấp độ',
      type: 'values',
      option: { /* ... */ },${
        disableLevel
          ? `
      filter: { disabled: true },`
          : ''
      }
    },
    {
      field: 'salary',
      title: 'Lương',
      type: 'number',${
        disableSalary
          ? `
      filter: { disabled: true },`
          : ''
      }
    },
    // ... other columns
  ],
  filter: {
    hideInlineFilter: ${!showInline},${
      showExt
        ? `
    hideExternalFilterToolbar: ${hideToolbar},
    externalFilterPerRow: ${perRow},  // Số filter mỗi hàng (4 hoặc 6)
    externalFilters: [
      { field: 'fullName',   title: 'Họ và tên',   type: 'string',    defaultShowing: true },
      { field: 'department', title: 'Phòng ban',    type: 'values',    defaultShowing: true,
        option: { items: DEPT_OPTIONS, valueField: 'id', displayField: 'name', selection: 'MULTIPLE' } },
      { field: 'salary',     title: 'Mức lương',    type: 'number',    defaultShowing: true },
      { field: 'birthDate',  title: 'Khoảng ngày',  type: 'daterange', defaultShowing: true },
      { field: 'isActive',   title: 'Trạng thái',   type: 'boolean',   defaultShowing: true },
    ],`
        : ''
    }
  },
  paginate: { pageSize: 10 },
};`;
  });

  private getMockData(): Employee[] {
    const firstNames = [
      'Văn An', 'Thị Bình', 'Hoàng Cường', 'Thu Dung', 'Minh Đức',
      'Thị Lan', 'Văn Hùng', 'Thị Mai', 'Quang Nam', 'Thị Oanh',
    ];
    const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô'];
    const depts = ['IT', 'HR', 'FIN', 'MKT', 'OPS'];
    const levels = ['junior', 'mid', 'senior', 'lead'];
    return Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      fullName: `${lastNames[i % lastNames.length]} ${firstNames[i % firstNames.length]}`,
      email: `user${i + 1}@company.vn`,
      department: depts[i % depts.length],
      level: levels[i % levels.length],
      salary: (8 + (i % 7) * 3) * 1_000_000,
      birthDate: new Date(1985 + (i % 15), i % 12, (i % 28) + 1).toISOString(),
      isActive: i % 4 !== 3,
    }));
  }
}
