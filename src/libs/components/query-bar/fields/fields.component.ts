import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdQueryBar, SdQueryField } from '@sd-angular/core/components/query-bar';
import { SdSection } from '@sd-angular/core/components/section';
import { SdPageComponent } from '@sd-angular/core/modules/layout';
import { Filter } from '@sd-angular/core/utilities/models';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  city: string;
  status: string;
  salary: number;
  joinDate: Date;
  lastLogin: Date;
  active: boolean;
}

interface OptionItem {
  value: string;
  display: string;
}

@Component({
  selector: 'app-query-bar-fields',
  standalone: true,
  imports: [CommonModule, FormsModule, SdCodeEditor, SdPageComponent, SdQueryBar, SdSection],
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryBarFieldsComponent {
  pageDescription = signal(
    'Đầy đủ 7 kind field của <sd-query-bar>: string, number, boolean, date, datetime, values (option tĩnh), lazy-values (option async). Mỗi kind có icon mặc định, operator set riêng, và UI value control phù hợp. Demo cũng minh hoạ chế độ simple (1 operator cố định) vs operators: true (full set).'
  );

  departmentOptions: OptionItem[] = [
    { value: 'TECH', display: 'Công nghệ' },
    { value: 'SALES', display: 'Kinh doanh' },
    { value: 'HR', display: 'Nhân sự' },
    { value: 'FINANCE', display: 'Tài chính' },
    { value: 'MARKETING', display: 'Marketing' },
  ];

  statusOptions: OptionItem[] = [
    { value: 'ACTIVE', display: 'Đang làm việc' },
    { value: 'PROBATION', display: 'Thử việc' },
    { value: 'RESIGNED', display: 'Đã nghỉ' },
    { value: 'SUSPENDED', display: 'Tạm nghỉ' },
  ];

  // Mock async pool — lazy-values
  private cityPool: OptionItem[] = [
    { value: 'HN', display: 'Hà Nội' },
    { value: 'HCM', display: 'TP. Hồ Chí Minh' },
    { value: 'DN', display: 'Đà Nẵng' },
    { value: 'HP', display: 'Hải Phòng' },
    { value: 'CT', display: 'Cần Thơ' },
    { value: 'NT', display: 'Nha Trang' },
    { value: 'HUE', display: 'Huế' },
    { value: 'VT', display: 'Vũng Tàu' },
  ];

  searchCities = (req: { search?: string }): Observable<OptionItem[]> => {
    const term = (req.search ?? '').toLowerCase();
    const filtered = term ? this.cityPool.filter(c => c.display.toLowerCase().includes(term)) : this.cityPool;
    return of(filtered).pipe(delay(150));
  };

  viewCities = async (values: unknown[]): Promise<OptionItem[]> => {
    return this.cityPool.filter(c => values.includes(c.value));
  };

  fields: SdQueryField<Employee>[] = [
    // string simple — luôn CONTAIN
    { kind: 'string', key: 'name', label: 'Họ tên (simple)' },
    // string với full operators
    { kind: 'string', key: 'email', label: 'Email (operators: true)', icon: 'alternate_email', operators: true },
    // values — option tĩnh, full operators
    {
      kind: 'values',
      key: 'department',
      label: 'Phòng ban (full)',
      icon: 'apartment',
      operators: true,
      option: { items: this.departmentOptions, valueField: 'value', displayField: 'display' },
    },
    // values simple — luôn IN
    {
      kind: 'values',
      key: 'status',
      label: 'Trạng thái (simple)',
      icon: 'flag',
      option: { items: this.statusOptions, valueField: 'value', displayField: 'display' },
    },
    // lazy-values — async lookup
    {
      kind: 'lazy-values',
      key: 'city',
      label: 'Thành phố (lazy)',
      icon: 'location_city',
      operators: ['IN', 'NOT_IN'],
      option: {
        search: this.searchCities,
        views: this.viewCities,
        valueField: 'value',
        displayField: 'display',
      },
    },
    // number — explicit operator subset
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
    // boolean
    { kind: 'boolean', key: 'active', label: 'Đang hoạt động', trueLabel: 'Có', falseLabel: 'Không' },
    // date
    { kind: 'date', key: 'joinDate', label: 'Ngày vào', operators: true },
    // datetime
    { kind: 'datetime', key: 'lastLogin', label: 'Đăng nhập cuối', operators: true },
  ];

  filters = signal<Filter[]>([
    { field: 'name', operator: 'CONTAIN', data: 'Nguyễn' },
    { field: 'salary', operator: 'BETWEEN', data: { from: 10_000_000, to: 50_000_000 } },
    { field: 'active', operator: 'EQUAL', data: true },
  ] as Filter[]);

  filtersJson = computed(() => JSON.stringify(this.filters(), null, 2));

  fieldsJson = `[
  { kind: 'string', key: 'name', label: 'Họ tên (simple)' },
  // → simple mode: không có operator dropdown, luôn CONTAIN

  { kind: 'string', key: 'email', label: 'Email',
    operators: true },
  // → operators: true → cho phép user chọn CONTAIN / EQUAL / NOT_EQUAL / START / END / NULL / NOT_NULL

  { kind: 'values', key: 'department', label: 'Phòng ban',
    operators: true,
    option: { items: DEPT_OPTIONS, valueField: 'value', displayField: 'display' } },
  // → values: option tĩnh, multi-select khi operator là IN / NOT_IN

  { kind: 'values', key: 'status', label: 'Trạng thái',
    option: { items: STATUS_OPTIONS, valueField: 'value', displayField: 'display' } },
  // → simple → luôn IN (multi-select), không có operator dropdown

  { kind: 'lazy-values', key: 'city', label: 'Thành phố (lazy)',
    operators: ['IN', 'NOT_IN'],
    option: {
      search: (req) => api.searchCities(req.search),  // Observable<K[]> | Promise<K[]>
      views:  (vals) => api.lookupCities(vals),       // resolve display label cho ID đã chọn
      valueField: 'value', displayField: 'display',
    } },
  // → lazy-values: server-backed, searchable + paginated. views() resolve chip label cho selected IDs.

  { kind: 'number', key: 'salary', label: 'Lương',
    operators: ['EQUAL', 'GREATER_OR_EQUAL', 'LESS_OR_EQUAL', 'BETWEEN'],
    min: 0, max: 100_000_000, step: 1_000_000 },

  { kind: 'boolean', key: 'active', label: 'Đang hoạt động',
    trueLabel: 'Có', falseLabel: 'Không' },

  { kind: 'date',     key: 'joinDate',  label: 'Ngày vào',        operators: true },
  // → date: mặc định BETWEEN (khoảng ngày). operators: true cho phép EQUAL/BEFORE/AFTER/BETWEEN/NULL.

  { kind: 'datetime', key: 'lastLogin', label: 'Đăng nhập cuối', operators: true },
];`;
}
