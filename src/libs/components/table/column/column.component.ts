import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, signal } from '@angular/core';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection } from '@sd-angular/core/components/section';
import { SdTable, SdTableColumn, SdTableOption } from '@sd-angular/core/components/table';
import { SdPageComponent } from '@sd-angular/core/modules/layout';

interface EmployeeColumnDemo {
  id: number;
  fullName: string;
  email: string;
  department: string;
  level: string;
  salary: number;
  joinedAt: string;
  note: string;
  isActive: boolean;
}

const DEPARTMENT_OPTIONS = [
  { id: 'IT', name: 'Công nghệ thông tin' },
  { id: 'HR', name: 'Nhân sự & Đào tạo' },
  { id: 'FIN', name: 'Tài chính & Kế toán' },
  { id: 'OPS', name: 'Vận hành' },
];

const LEVEL_OPTIONS = [
  { id: 'junior', name: 'Junior' },
  { id: 'mid', name: 'Middle' },
  { id: 'senior', name: 'Senior' },
  { id: 'lead', name: 'Team Lead' },
];

@Component({
  selector: 'app-table-column',
  standalone: true,
  imports: [CommonModule, SdCodeEditor, SdPageComponent, SdSection, SdTable],
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableColumnComponent implements OnInit {
  @ViewChild('employeeTitleTpl', { static: true }) employeeTitleTpl!: TemplateRef<unknown>;
  @ViewChild('contactCellTpl', { static: true }) contactCellTpl!: TemplateRef<unknown>;
  @ViewChild('statusCellTpl', { static: true }) statusCellTpl!: TemplateRef<unknown>;

  pageDescription = signal(
    'Demo cấu hình column của sd-table: các type chuẩn, title/cell option, export.description, custom title và custom cell bằng TemplateRef.'
  );

  tableOption = signal<SdTableOption<EmployeeColumnDemo> | null>(null);

  propertyItems = [
    {
      title: 'type',
      description: 'Các type chuẩn gồm string, number, boolean, date, datetime, values, lazy-values, children. Mỗi type có formatter và filter hành vi riêng.',
    },
    {
      title: 'title: string | ColumnTitleOption',
      description: 'Nếu chỉ cần text header thì dùng string. Khi cần custom header, dùng ColumnTitleOption với title gốc và templateRef.',
    },
    {
      title: 'cell: ColumnCellOption',
      description: 'Nơi gom các hành vi của ô dữ liệu như templateRef, copiable, truncate. Đây là chỗ để làm custom cell.',
    },
    {
      title: 'custom title / custom cell',
      description: 'title.templateRef render header riêng. cell.templateRef render thân ô với context gồm item, column và autoId.',
    },
    {
      title: 'export.description',
      description: 'Dùng để diễn giải ý nghĩa hoặc lưu ý export của từng cột. Phù hợp cho demo, tài liệu nội bộ và xuất cấu hình.',
    },
  ];

  columnSampleCode = `columns: SdTableColumn<EmployeeColumnDemo>[] = [
  {
    field: 'fullName',
    title: {
      title: 'Nhân viên',
      templateRef: this.employeeTitleTpl,
    },
    type: 'string',
    width: '220px',
    cell: { copiable: true },
    export: { description: 'Header dùng ColumnTitleOption, cell hỗ trợ copy' },
  },
  {
    field: 'email',
    title: 'Liên hệ',
    type: 'string',
    width: '250px',
    cell: { templateRef: this.contactCellTpl },
    export: { description: 'Custom cell lấy thêm row data qua let-item="item"' },
  },
  {
    field: 'note',
    title: 'Ghi chú',
    type: 'string',
    width: '220px',
    cell: { truncate: { enable: true, type: 'tooltip' } },
  },
  {
    field: 'isActive',
    title: 'Trạng thái',
    type: 'boolean',
    cell: { templateRef: this.statusCellTpl },
  },
];

  interface ColumnTitleOption {
    title: string;
    templateRef?: TemplateRef<any>;
  }

  interface ColumnCellOption {
    templateRef?: TemplateRef<any>;
    copiable?: boolean;
    truncate?: {
      enable?: boolean;
      type?: 'more' | 'tooltip';
    };
  }

<ng-template #employeeTitleTpl>
  <div class="custom-title">...</div>
</ng-template>

<ng-template #contactCellTpl let-item="item">
  <div class="contact-cell">
    <div>{{ item.fullName }}</div>
    <div>{{ item.email }}</div>
  </div>
</ng-template>`;

  ngOnInit(): void {
    this.tableOption.set({
      type: 'local',
      key: 'table-column-demo',
      items: () => this.getMockData(),
      columns: this.buildColumns(),
      paginate: { pageSize: 8, pages: [5, 8, 10] },
      export: { visible: 'ALL', items: () => this.getMockData() },
      config: { visible: true },
      filter: { hideExternalFilterToolbar: true },
    });
  }

  private buildColumns(): SdTableColumn<EmployeeColumnDemo>[] {
    return [
      {
        field: 'id',
        title: 'ID',
        type: 'number',
        width: '70px',
        align: 'right',
        sortable: false,
        filter: { disabled: true },
      },
      {
        field: 'fullName',
        title: { title: 'Nhân viên', templateRef: this.employeeTitleTpl },
        type: 'string',
        width: '220px',
        cell: { copiable: true },
        export: { description: 'ColumnTitleOption cho phép custom phần header nhưng vẫn giữ text title để export/config.' },
      },
      {
        field: 'email',
        title: 'Liên hệ',
        type: 'string',
        width: '250px',
        cell: { templateRef: this.contactCellTpl },
        export: { description: 'ColumnCellOption.templateRef render custom cell với context { item, column, autoId }.' },
      },
      {
        field: 'department',
        title: 'Phòng ban',
        type: 'values',
        width: '180px',
        option: { items: DEPARTMENT_OPTIONS, valueField: 'id', displayField: 'name' },
        export: { description: 'type: values dùng option.items để map value sang label hiển thị.' },
      },
      {
        field: 'level',
        title: 'Cấp độ',
        type: 'values',
        width: '120px',
        option: { items: LEVEL_OPTIONS, valueField: 'id', displayField: 'name' },
      },
      {
        field: 'salary',
        title: 'Lương',
        type: 'number',
        width: '150px',
        align: 'right',
        transform: value => `${new Intl.NumberFormat('vi-VN').format(value as number)} đ`,
        export: { description: 'Cột number có thể align phải, transform giá trị trước khi hiển thị/export.' },
      },
      {
        field: 'joinedAt',
        title: 'Ngày vào',
        type: 'date',
        width: '130px',
      },
      {
        field: 'note',
        title: 'Ghi chú',
        type: 'string',
        width: '230px',
        cell: { truncate: { enable: true, type: 'tooltip' } },
        export: { description: 'truncate cho phép rút gọn nội dung dài, xem đầy đủ qua tooltip hoặc nút xem thêm.' },
      },
      {
        field: 'isActive',
        title: 'Trạng thái',
        type: 'boolean',
        width: '130px',
        cell: { templateRef: this.statusCellTpl },
        option: { displayOnTrue: 'Hoạt động', displayOnFalse: 'Tạm ngừng' },
      },
    ];
  }

  private getMockData(): EmployeeColumnDemo[] {
    const firstNames = ['Văn An', 'Thị Bình', 'Hoàng Cường', 'Thu Dung', 'Minh Đức', 'Thị Lan', 'Văn Hùng', 'Thị Mai'];
    const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi'];
    const notes = [
      'Theo dõi nhóm khách hàng doanh nghiệp và cần xử lý nhiều đầu việc song song trong tuần này.',
      'Phụ trách kiểm tra dữ liệu cuối tháng, thường xuyên xuất báo cáo cho quản lý khối.',
      'Tham gia dự án mới nên cần mô tả dài để thấy rõ truncate + tooltip trong cell.',
      'Làm việc với đối tác bên ngoài, có nhiều đầu mối liên lạc và thay đổi lịch linh hoạt.',
    ];

    return Array.from({ length: 18 }, (_, index) => ({
      id: index + 1,
      fullName: `${lastNames[index % lastNames.length]} ${firstNames[index % firstNames.length]}`,
      email: `user${index + 1}@sdcorejs.vn`,
      department: DEPARTMENT_OPTIONS[index % DEPARTMENT_OPTIONS.length].id,
      level: LEVEL_OPTIONS[index % LEVEL_OPTIONS.length].id,
      salary: (10 + (index % 6) * 4) * 1_000_000,
      joinedAt: new Date(2021 + (index % 4), index % 12, (index % 28) + 1).toISOString(),
      note: notes[index % notes.length],
      isActive: index % 3 !== 2,
    }));
  }
}