import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdQueryBar, SdQueryField, SdQueryLogic } from '@sd-angular/core/components/query-bar';
import { SdSection } from '@sd-angular/core/components/section';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdSwitch } from '@sd-angular/core/forms/switch';
import { SdPageComponent } from '@sd-angular/core/modules/layout';
import { Filter } from '@sd-angular/core/utilities/models';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
  joinDate: Date;
  active: boolean;
}

@Component({
  selector: 'app-query-bar-modes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdCodeEditor,
    SdPageComponent,
    SdQueryBar,
    SdSection,
    SdSelect,
    SdSwitch,
  ],
  templateUrl: './modes.component.html',
  styleUrls: ['./modes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryBarModesComponent {
  pageDescription = signal(
    'Toggle các thuộc tính UX của <sd-query-bar>: mode (popover/inline GitLab-style), density (compact 28 / comfortable 32), showSearch, showLogicToggle (AND/OR), showOperatorOnChip, showClearAll. Mỗi toggle ảnh hưởng cấu trúc bar trực tiếp.'
  );

  modeOptions = [
    { id: 'popover', name: 'popover — Compact, click chip mở popover' },
    { id: 'inline', name: 'inline — GitLab-style, control trên bar' },
  ];

  densityOptions = [
    { id: 'compact', name: 'compact — Cao 28px' },
    { id: 'comfortable', name: 'comfortable — Cao 32px' },
  ];

  departmentOptions = [
    { value: 'TECH', display: 'Công nghệ' },
    { value: 'SALES', display: 'Kinh doanh' },
    { value: 'HR', display: 'Nhân sự' },
  ];

  fields: SdQueryField<Employee>[] = [
    { kind: 'string', key: 'name', label: 'Họ tên' },
    { kind: 'string', key: 'email', label: 'Email', icon: 'alternate_email', operators: true },
    {
      kind: 'values',
      key: 'department',
      label: 'Phòng ban',
      icon: 'apartment',
      option: { items: this.departmentOptions, valueField: 'value', displayField: 'display' },
    },
    {
      kind: 'number',
      key: 'salary',
      label: 'Lương',
      icon: 'payments',
      operators: ['EQUAL', 'GREATER_OR_EQUAL', 'LESS_OR_EQUAL', 'BETWEEN'],
      min: 0,
      max: 100_000_000,
      step: 1_000_000,
    },
    { kind: 'date', key: 'joinDate', label: 'Ngày vào', operators: true },
    { kind: 'boolean', key: 'active', label: 'Hoạt động' },
  ];

  // Config signals
  mode = signal<'popover' | 'inline'>('popover');
  density = signal<'compact' | 'comfortable'>('compact');
  showSearch = signal(true);
  showLogicToggle = signal(true);
  showOperatorOnChip = signal(false);
  showClearAll = signal(true);

  // State
  filters = signal<Filter[]>([
    { field: 'name', operator: 'CONTAIN', data: 'Nguyễn' },
    { field: 'department', operator: 'IN', data: ['TECH', 'SALES'] },
  ]);
  logic = signal<SdQueryLogic>('AND');
  search = signal('');
  applyCount = signal(0);

  filtersJson = computed(() => JSON.stringify(this.filters(), null, 2));

  queryJson = computed(() =>
    JSON.stringify(
      {
        filters: this.filters(),
        logic: this.logic(),
        ...(this.showSearch() ? { search: this.search() } : {}),
      },
      null,
      2
    )
  );

  onApply(): void {
    this.applyCount.update(n => n + 1);
  }

  tsCode = computed(() => `<sd-query-bar
  [fields]="fields"
  [(filters)]="filters"
  [(logic)]="logic"
  [(search)]="search"
  [mode]="'${this.mode()}'"
  [density]="'${this.density()}'"
  [showSearch]="${this.showSearch()}"
  [showLogicToggle]="${this.showLogicToggle()}"
  [showOperatorOnChip]="${this.showOperatorOnChip()}"
  [showClearAll]="${this.showClearAll()}"
  (apply)="onApply()">
</sd-query-bar>

/*
 * mode:
 *   - 'popover'  → click chip mở mat-menu, chỉnh operator+value, đóng → commit.
 *   - 'inline'   → operator+value render thẳng trên bar (GitLab-style), edit live.
 *
 * density:
 *   - 'compact'      → height 28px (mặc định).
 *   - 'comfortable'  → height 32px, ưu tiên touch / app desktop ít chip.
 *
 * showLogicToggle:  AND/OR segmented (chỉ render khi có ≥2 filter).
 * showOperatorOnChip: in operator label lên mặt chip (mặc định ẩn, chỉ trong popover).
 * showClearAll:      nút "Xoá hết" khi có filter active.
 * showSearch:        free-text search box bên trái.
 */`);
}
