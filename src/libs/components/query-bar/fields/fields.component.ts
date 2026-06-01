import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSearchReq } from '@sdcorejs/angular/forms/models';
import { SdQueryBar, SdQueryField } from '@sdcorejs/angular/components/query-bar';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { Filter } from '@sdcorejs/angular/utilities/models';

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
    'Đầy đủ 7 type field của <sd-query-bar>: string, number, boolean, date, datetime, values (option tĩnh), lazy-values (option async). Mỗi type có icon mặc định, operator set riêng, và UI value control phù hợp. Demo cũng minh hoạ chế độ simple (1 operator cố định) vs operators: true (full set).'
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

  searchCities = async (req: SdSearchReq): Promise<OptionItem[]> => {
    if (req.type === 'VALUE') {
      const vals = Array.isArray(req.value) ? req.value : req.value !== undefined ? [req.value] : [];
      return this.cityPool.filter(c => vals.includes(c.value));
    }
    const term = (req.searchText ?? '').toLowerCase();
    const filtered = term ? this.cityPool.filter(c => c.display.toLowerCase().includes(term)) : this.cityPool;
    await new Promise(r => setTimeout(r, 150));
    return filtered;
  };

  fields: SdQueryField<Employee>[] = [
    // string simple — luôn CONTAIN
    { type: 'string', key: 'name', label: 'Họ tên (simple)' },
    // string với full operators
    { type: 'string', key: 'email', label: 'Email (operators: true)', icon: 'alternate_email', operators: true },
    // values — option tĩnh, full operators
    {
      type: 'values',
      key: 'department',
      label: 'Phòng ban (full)',
      icon: 'apartment',
      operators: true,
      option: { items: this.departmentOptions, valueField: 'value', displayField: 'display' },
    },
    // values simple — luôn IN
    {
      type: 'values',
      key: 'status',
      label: 'Trạng thái (simple)',
      icon: 'flag',
      option: { items: this.statusOptions, valueField: 'value', displayField: 'display' },
    },
    // lazy-values — async lookup
    {
      type: 'lazy-values',
      key: 'city',
      label: 'Thành phố (lazy)',
      icon: 'location_city',
      operators: ['IN', 'NOT_IN'],
      option: {
        search: this.searchCities,
        valueField: 'value',
        displayField: 'display',
      },
    },
    // number — explicit operator subset
    {
      type: 'number',
      key: 'salary',
      label: 'Lương',
      icon: 'payments',
      operators: ['EQUAL', 'GREATER_OR_EQUAL', 'LESS_OR_EQUAL', 'BETWEEN'],
      min: 0,
      max: 100_000_000,
      step: 1_000_000,
    },
    // boolean
    { type: 'boolean', key: 'active', label: 'Đang hoạt động', trueLabel: 'Có', falseLabel: 'Không' },
    // date
    { type: 'date', key: 'joinDate', label: 'Ngày vào', operators: true },
    // datetime
    { type: 'datetime', key: 'lastLogin', label: 'Đăng nhập cuối', operators: true },
  ];

  filters = signal<Filter[]>([
    { field: 'name', operator: 'CONTAIN', data: 'Nguyễn' },
    { field: 'salary', operator: 'BETWEEN', data: { from: 10_000_000, to: 50_000_000 } },
    { field: 'active', operator: 'EQUAL', data: true },
  ] as Filter[]);

  filtersJson = computed(() => JSON.stringify(this.filters(), null, 2));

  fieldsJson = `[
  { type: 'string', key: 'name', label: 'Họ tên (simple)' },
  // → simple mode: không có operator dropdown, luôn CONTAIN

  { type: 'string', key: 'email', label: 'Email',
    operators: true },
  // → operators: true → cho phép user chọn CONTAIN / EQUAL / NOT_EQUAL / START / END / NULL / NOT_NULL

  { type: 'values', key: 'department', label: 'Phòng ban',
    operators: true,
    option: { items: DEPT_OPTIONS, valueField: 'value', displayField: 'display' } },
  // → values: option tĩnh, multi-select khi operator là IN / NOT_IN

  { type: 'values', key: 'status', label: 'Trạng thái',
    option: { items: STATUS_OPTIONS, valueField: 'value', displayField: 'display' } },
  // → simple → luôn IN (multi-select), không có operator dropdown

  { type: 'lazy-values', key: 'city', label: 'Thành phố (lazy)',
    operators: ['IN', 'NOT_IN'],
    option: {
      // req.type === 'SEARCH' → trả về list theo searchText
      // req.type === 'VALUE'  → resolve display label cho ID đã chọn (chip render)
      search: async (req) => api.searchCities(req),  // SdSearch<K> — Promise<K[]>
      valueField: 'value', displayField: 'display',
    } },
  // → lazy-values: server-backed, searchable + paginated. Một callback search xử lý cả live query (SEARCH) lẫn resolve label (VALUE).

  { type: 'number', key: 'salary', label: 'Lương',
    operators: ['EQUAL', 'GREATER_OR_EQUAL', 'LESS_OR_EQUAL', 'BETWEEN'],
    min: 0, max: 100_000_000, step: 1_000_000 },

  { type: 'boolean', key: 'active', label: 'Đang hoạt động',
    trueLabel: 'Có', falseLabel: 'Không' },

  { type: 'date',     key: 'joinDate',  label: 'Ngày vào',        operators: true },
  // → date: mặc định BETWEEN (khoảng ngày). operators: true cho phép EQUAL/BEFORE/AFTER/BETWEEN/NULL.

  { type: 'datetime', key: 'lastLogin', label: 'Đăng nhập cuối', operators: true },
];`;
}
