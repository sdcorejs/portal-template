import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdTable, SdTableColumn, SdTableOption } from '@sdcorejs/angular/components/table';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

interface EmployeeColumnDemo {
  id: number;
  fullName: string;
  email: string;
  department: string;
  note: string;
  isActive: boolean;
}

const DEPARTMENT_OPTIONS = [
  { id: 'IT', name: 'Công nghệ thông tin' },
  { id: 'HR', name: 'Nhân sự & Đào tạo' },
  { id: 'FIN', name: 'Tài chính & Kế toán' },
  { id: 'OPS', name: 'Vận hành' },
];

@Component({
  selector: 'app-table-column',
  standalone: true,
  imports: [CommonModule, FormsModule, SdCodeEditor, SdPageComponent, SdSection, SdSwitch, SdTable],
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableColumnComponent {
  @ViewChild('nameTitleTpl', { static: true }) nameTitleTpl!: TemplateRef<unknown>;
  @ViewChild('nameCellTpl', { static: true }) nameCellTpl!: TemplateRef<unknown>;
  @ViewChild('statusTitleTpl', { static: true }) statusTitleTpl!: TemplateRef<unknown>;
  @ViewChild('statusCellTpl', { static: true }) statusCellTpl!: TemplateRef<unknown>;

  pageDescription = signal(
    'Tùy chỉnh từng cột của sd-table: bật/tắt custom title, custom cell, copy, truncate. Cell Trạng thái dùng sd-switch để trigger trực tiếp giá trị trong bảng.'
  );

  // why: literal `{ ... }` trong template Angular bị parse thành ICU message — đẩy ra string field để render qua interpolation.
  snippetTitleOption = "{ title: 'Tên', templateRef }";
  snippetTruncateOption = '{ enable, type }';
  snippetCellContext = '{ item, column, autoId }';

  // ── Toggle signals ────────────────────────────────────────────────────────
  customTitleName = signal(true);
  customCellName = signal(true);
  customTitleStatus = signal(true);
  customCellStatus = signal(true);
  copyEnabled = signal(true);
  truncateEnabled = signal(true);

  items = signal<EmployeeColumnDemo[]>(this.buildMockData());

  tableOption = signal<SdTableOption<EmployeeColumnDemo> | null>(null);

  constructor() {
    // why: rebuild option khi bất kỳ toggle thay đổi → SdTable re-render với cấu hình mới.
    effect(() => {
      const cols = this.buildColumns();
      this.tableOption.set({
        type: 'local',
        key: 'table-column-demo',
        items: () => this.items(),
        columns: cols,
        paginate: { pageSize: 8, pages: [5, 8, 10] },
        export: { visible: 'ALL', items: () => this.items() },
        config: { visible: true },
        filter: { hideExternalFilterToolbar: true },
      });
    });
  }

  // why: switch trong cell mutate item.isActive — set lại items signal để CD trigger render lại các cell phụ thuộc.
  toggleActive(item: EmployeeColumnDemo, value: boolean): void {
    item.isActive = value;
    this.items.update(list => [...list]);
  }

  configCode = computed(() => {
    const nameTitle = this.customTitleName()
      ? `title: { title: 'Tên', templateRef: this.nameTitleTpl }`
      : `title: 'Tên'`;
    const nameCell = this.customCellName() || this.copyEnabled()
      ? `cell: { ${this.customCellName() ? 'templateRef: this.nameCellTpl' : ''}${this.customCellName() && this.copyEnabled() ? ', ' : ''}${this.copyEnabled() ? 'copiable: true' : ''} }`
      : '';
    const noteCell = this.truncateEnabled()
      ? `cell: { truncate: { enable: true, type: 'tooltip' } }`
      : '';
    const statusTitle = this.customTitleStatus()
      ? `title: { title: 'Trạng thái', templateRef: this.statusTitleTpl }`
      : `title: 'Trạng thái'`;
    const statusCell = this.customCellStatus()
      ? `cell: { templateRef: this.statusCellTpl }`
      : '';

    return `columns: SdTableColumn<EmployeeColumnDemo>[] = [
  { field: 'id', title: 'ID', type: 'number', width: '70px', align: 'right' },
  {
    field: 'fullName',
    ${nameTitle},
    type: 'string',
    width: '220px',${nameCell ? `\n    ${nameCell},` : ''}
  },
  {
    field: 'note',
    title: 'Ghi chú',
    type: 'string',
    width: '260px',${noteCell ? `\n    ${noteCell},` : ''}
  },
  {
    field: 'isActive',
    ${statusTitle},
    type: 'boolean',
    width: '150px',${statusCell ? `\n    ${statusCell},` : ''}
    option: { displayOnTrue: 'Hoạt động', displayOnFalse: 'Tạm ngừng' },
  },
];`;
  });

  templateCode = `<!-- Custom title cho cột Tên: ColumnTitleOption.templateRef -->
<ng-template #nameTitleTpl>
  <div class="custom-title">
    <span class="custom-title__badge">N</span>
    <div>
      <div class="custom-title__label">Tên</div>
      <div class="custom-title__sub">Custom header</div>
    </div>
  </div>
</ng-template>

<!-- Custom cell cho cột Tên: ColumnCellOption.templateRef, context: { item, column, autoId } -->
<ng-template #nameCellTpl let-item="item">
  <div class="name-cell">
    <span class="name-cell__avatar">{{ item.fullName.slice(0, 1) }}</span>
    <div>
      <div class="name-cell__title">{{ item.fullName }}</div>
      <div class="name-cell__sub">{{ item.email }}</div>
    </div>
  </div>
</ng-template>

<!-- Custom title cho cột Trạng thái -->
<ng-template #statusTitleTpl>
  <span class="status-title">⚡ Trạng thái</span>
</ng-template>

<!-- Custom cell cho cột Trạng thái: dùng sd-switch để trigger -->
<ng-template #statusCellTpl let-item="item">
  <sd-switch
    [model]="item.isActive"
    (modelChange)="toggleActive(item, $event)"
    size="sm"
  ></sd-switch>
</ng-template>`;

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
        title: this.customTitleName()
          ? { title: 'Tên', templateRef: this.nameTitleTpl }
          : 'Tên',
        type: 'string',
        width: '220px',
        cell: {
          ...(this.customCellName() ? { templateRef: this.nameCellTpl } : {}),
          ...(this.copyEnabled() ? { copiable: true } : {}),
        },
      },
      {
        field: 'note',
        title: 'Ghi chú',
        type: 'string',
        width: '260px',
        cell: this.truncateEnabled()
          ? { truncate: { enable: true, type: 'tooltip' } }
          : {},
      },
      {
        field: 'isActive',
        title: this.customTitleStatus()
          ? { title: 'Trạng thái', templateRef: this.statusTitleTpl }
          : 'Trạng thái',
        type: 'boolean',
        width: '150px',
        cell: this.customCellStatus() ? { templateRef: this.statusCellTpl } : {},
        option: { displayOnTrue: 'Hoạt động', displayOnFalse: 'Tạm ngừng' },
      },
    ];
  }

  private buildMockData(): EmployeeColumnDemo[] {
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
      note: notes[index % notes.length],
      isActive: index % 3 !== 2,
    }));
  }
}
