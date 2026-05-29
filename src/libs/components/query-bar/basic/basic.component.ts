import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdQueryBar, SdQueryField } from '@sd-angular/core/components/query-bar';
import { SdSection } from '@sd-angular/core/components/section';
import { SdPageComponent } from '@sd-angular/core/modules/layout';
import { Filter } from '@sd-angular/core/utilities/models';

interface Employee {
  id: number;
  name: string;
  department: string;
  status: string;
  active: boolean;
  joinDate: Date;
}

@Component({
  selector: 'app-query-bar-basic',
  standalone: true,
  imports: [CommonModule, FormsModule, SdCodeEditor, SdPageComponent, SdQueryBar, SdSection],
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryBarBasicComponent {
  pageDescription = signal(
    '<sd-query-bar> — unified filter chip row. Cấu hình `fields[]`, bind 2-way `[(filters)]`, lắng `(apply)` để gọi API. Demo này dùng cấu hình tối thiểu (popover mode, không AND/OR toggle, không search box).'
  );

  departmentOptions = [
    { value: 'TECH', display: 'Công nghệ' },
    { value: 'SALES', display: 'Kinh doanh' },
    { value: 'HR', display: 'Nhân sự' },
    { value: 'FINANCE', display: 'Tài chính' },
  ];

  statusOptions = [
    { value: 'ACTIVE', display: 'Đang làm việc' },
    { value: 'PROBATION', display: 'Thử việc' },
    { value: 'RESIGNED', display: 'Đã nghỉ' },
  ];

  fields: SdQueryField<Employee>[] = [
    { kind: 'string', key: 'name', label: 'Họ tên' },
    {
      kind: 'values',
      key: 'department',
      label: 'Phòng ban',
      icon: 'apartment',
      option: { items: this.departmentOptions, valueField: 'value', displayField: 'display' },
    },
    {
      kind: 'values',
      key: 'status',
      label: 'Trạng thái',
      icon: 'flag',
      option: { items: this.statusOptions, valueField: 'value', displayField: 'display' },
    },
    { kind: 'boolean', key: 'active', label: 'Hoạt động', trueLabel: 'Có', falseLabel: 'Không' },
    { kind: 'date', key: 'joinDate', label: 'Ngày vào' },
  ];

  filters = signal<Filter[]>([
    { field: 'name', operator: 'CONTAIN', data: 'Nguyễn' },
    { field: 'department', operator: 'IN', data: ['TECH'] },
  ]);

  applyCount = signal(0);
  lastApply = signal<string>('—');

  filtersJson = computed(() => JSON.stringify(this.filters(), null, 2));

  onApply(): void {
    this.applyCount.update(n => n + 1);
    this.lastApply.set(new Date().toLocaleTimeString('vi-VN'));
  }

  seedSample(): void {
    this.filters.set([
      { field: 'name', operator: 'CONTAIN', data: 'Nguyễn' },
      { field: 'department', operator: 'IN', data: ['TECH', 'SALES'] },
      { field: 'active', operator: 'EQUAL', data: true },
    ] as Filter[]);
  }

  clearAll(): void {
    this.filters.set([]);
  }

  tsCode = `import { SdQueryBar, SdQueryField } from '@sd-angular/core/components/query-bar';
import { Filter } from '@sd-angular/core/utilities/models';

@Component({
  selector: 'app-employee-list',
  imports: [SdQueryBar],
  template: \`
    <sd-query-bar
      [fields]="fields"
      [(filters)]="filters"
      (apply)="onApply()">
    </sd-query-bar>
  \`,
})
export class EmployeeListComponent {
  fields: SdQueryField<Employee>[] = [
    { kind: 'string', key: 'name', label: 'Họ tên' },
    { kind: 'values', key: 'department', label: 'Phòng ban',
      option: { items: DEPT_OPTIONS, valueField: 'value', displayField: 'display' } },
    { kind: 'boolean', key: 'active', label: 'Hoạt động' },
    { kind: 'date', key: 'joinDate', label: 'Ngày vào' },
  ];

  filters = signal<Filter[]>([]);

  onApply() {
    // Filter[] có shape: { field, operator, data }
    // Gọi API search với filters() — backend nhận pagingReq.filters chuẩn
    this.api.searchEmployees(this.filters()).subscribe(...)
  }
}`;
}
