import { afterRenderEffect, ChangeDetectionStrategy, Component, computed, inject, signal, untracked, viewChild } from '@angular/core';
import { SdBreadcrumb, type SdBreadcrumbItem } from '@sdcorejs/angular/components/breadcrumb';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdDataState } from '@sdcorejs/angular/components/data-state';
import { SdHighlight } from '@sdcorejs/angular/components/highlight';
import { SdOperator } from '@sdcorejs/angular/components/operator';
import { SdQueryBuilder, type SdQueryBuilderField } from '@sdcorejs/angular/components/query-builder';
import { SdQuickAction } from '@sdcorejs/angular/components/quick-action';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdTable, SdTableCellDefDirective, SdTableRowMobileDefDirective, type SdTableOption } from '@sdcorejs/angular/components/table';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdInputNumber } from '@sdcorejs/angular/forms/input-number';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdConfirmService } from '@sdcorejs/angular/services/confirm';
import { type Filter, type Operator } from '@sdcorejs/utils/models';
import {
  pauseQueryDemoProjects,
  QUERY_DEMO_PROJECTS,
  queryDemoPreset,
  selectQueryDemoProjects,
  type QueryDemoProject,
} from './query-demo.data';

@Component({
  selector: 'app-query-builder-demo',
  standalone: true,
  imports: [
    SdBreadcrumb,
    SdButton,
    SdCodeEditor,
    SdDataState,
    SdHighlight,
    SdOperator,
    SdQueryBuilder,
    SdQuickAction,
    SdSection,
    SdTable,
    SdTableCellDefDirective,
    SdTableRowMobileDefDirective,
    SdInput,
    SdInputNumber,
    SdSelect,
    SdSwitch,
    SdPageComponent,
  ],
  templateUrl: './query-builder.component.html',
  styleUrl: './query-builder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryBuilderDemoComponent {
  private readonly confirm = inject(SdConfirmService);
  readonly table = viewChild(SdTable);
  readonly trail: SdBreadcrumbItem[] = [{ label: 'Component', url: '/component/button' }, { label: 'Query Builder' }];
  readonly teams = [
    { value: 'product', display: 'Sản phẩm' },
    { value: 'design', display: 'Thiết kế' },
    { value: 'engineering', display: 'Kỹ thuật' },
  ];
  readonly fields: SdQueryBuilderField[] = [
    { key: 'name', label: 'Dự án', type: 'string' },
    { key: 'team', label: 'Nhóm', type: 'values', values: this.teams },
    { key: 'budget', label: 'Ngân sách', type: 'number', compareGroup: 'money' },
    { key: 'spent', label: 'Đã chi', type: 'number', compareGroup: 'money' },
    { key: 'active', label: 'Hoạt động', type: 'boolean', trueLabel: 'Đang chạy', falseLabel: 'Tạm dừng' },
    { key: 'createdAt', label: 'Ngày tạo', type: 'date' },
  ];
  readonly rows = signal<QueryDemoProject[]>(structuredClone([...QUERY_DEMO_PROJECTS]));
  readonly value = signal<Filter | null>(queryDemoPreset('and'));
  readonly applied = signal<Filter | null>(queryDemoPreset('and'));
  readonly preset = signal('and');
  readonly mode = signal<'edit' | 'view'>('edit');
  readonly disabled = signal(false);
  readonly comparisonMode = signal<'value-only' | 'value-or-field'>('value-or-field');
  readonly search = signal('');
  readonly operator = signal<Operator>('GREATER_THAN');
  readonly threshold = signal<number | null>(80);
  readonly operators: Operator[] = ['GREATER_THAN', 'GREATER_OR_EQUAL', 'LESS_THAN'];
  readonly state = signal<'success' | 'loading' | 'error'>('success');
  readonly failNext = signal(false);
  readonly error = signal('');
  readonly status = signal('Bộ lọc AND mẫu trả về 2 dự án. Sửa điều kiện rồi Áp dụng để xem kết quả.');
  readonly undoIds = signal<string[]>([]);
  readonly presetOptions = [
    { id: 'and', name: 'AND · Đang chạy & ngân sách > 80' },
    { id: 'or', name: 'OR · Thiết kế hoặc ngân sách > 120' },
    { id: 'nested', name: 'Nhóm AND/OR lồng nhau' },
    { id: 'field', name: 'So sánh Đã chi > Ngân sách' },
    { id: 'date', name: 'Ngày tạo trong tháng 9' },
    { id: 'all', name: 'Không có điều kiện' },
  ];
  readonly modeOptions = [
    { id: 'edit', name: 'Chỉnh sửa' },
    { id: 'view', name: 'Chỉ xem' },
  ];
  readonly results = computed(() => selectQueryDemoProjects(this.rows(), this.applied(), this.search()));
  readonly resultState = computed(() => (this.state() === 'success' && this.results().length === 0 ? 'empty' : this.state()));
  readonly json = computed(() => JSON.stringify(this.value(), null, 2));
  readonly tableOption = computed<SdTableOption<QueryDemoProject>>(() => ({
    type: 'local',
    rowKey: 'id',
    items: () => this.results(),
    sort: { enable: true },
    columns: [
      { field: 'id', title: 'Mã', type: 'string', width: '110px', sortable: true },
      { field: 'name', title: 'Dự án', type: 'string', width: '220px', sortable: true },
      {
        field: 'team',
        title: 'Nhóm',
        type: 'values',
        width: '150px',
        option: { items: this.teams, valueField: 'value', displayField: 'display' },
        sortable: true,
      },
      { field: 'budget', title: 'Ngân sách (triệu)', type: 'number', width: '160px', sortable: true },
      { field: 'spent', title: 'Đã chi (triệu)', type: 'number', width: '140px', sortable: true },
      { field: 'active', title: 'Hoạt động', type: 'boolean', width: '120px' },
    ],
    filter: { hideInlineFilter: true, hideExternalFilterToolbar: true },
    paginate: { pageSize: 6 },
    selector: {
      visible: true,
      disabled: row => !row.active,
      actions: [{ title: 'Tạm dừng đã chọn', icon: 'pause', click: rows => this.pause(rows ?? []) }],
    },
    commands: [{ title: 'Tạm dừng', icon: 'pause', disabled: row => !row.active, click: row => this.pause([row]) }],
    mobile: { rowLabel: row => row.id + ' · ' + row.name },
  }));
  readonly htmlCode = computed(
    () =>
      `<sd-query-builder\n  [fields]="fields"\n  [(value)]="filter"${this.mode() === 'view' ? '\n  mode="view"' : ''}${this.disabled() ? '\n  [disabled]="true"' : ''}\n  comparisonMode="${this.comparisonMode()}"\n/>`
  );
  readonly tsCode = `import { Component, signal } from '@angular/core';
import { SdQueryBuilder } from '@sdcorejs/angular/components/query-builder';
import { FilterUtilities } from '@sdcorejs/utils/fns';
import type { Filter } from '@sdcorejs/utils/models';

@Component({ imports: [SdQueryBuilder],
  template: '<sd-query-builder [fields]="fields" [(value)]="filter" />' })
export class QueryExample {
  fields = [{ key: 'budget', label: 'Ngân sách', type: 'number' as const }];
  filter = signal<Filter | null>(null);
  search(rows: { budget: number }[]) {
    const filter = this.filter();
    return rows.filter(row => !filter || FilterUtilities.evaluateFilter(row, filter));
  }
}`;

  constructor() {
    afterRenderEffect(() => {
      this.results();
      const table = this.table();
      untracked(() => table?.reload());
    });
  }

  loadPreset(): void {
    this.value.set(queryDemoPreset(this.preset()));
  }
  selectPreset(value: unknown): void {
    this.preset.set(typeof value === 'string' && this.presetOptions.some(item => item.id === value) ? value : 'and');
  }
  quickFilter(): void {
    if (this.threshold() === null) return;
    this.value.set({ field: 'budget', operator: this.operator(), data: this.threshold() } as Filter);
    this.status.set('Đã đưa bộ lọc nhanh vào trình thiết kế. Bấm Áp dụng để truy vấn.');
  }

  async apply(): Promise<void> {
    if (this.state() === 'loading') return;
    const draft = structuredClone(this.value());
    try {
      selectQueryDemoProjects(this.rows(), draft);
    } catch {
      this.error.set('Điều kiện không hợp lệ. Sửa bộ lọc trước khi áp dụng.');
      return;
    }
    this.error.set('');
    this.state.set('loading');
    await new Promise(resolve => setTimeout(resolve, 450));
    if (this.failNext()) {
      this.failNext.set(false);
      this.state.set('error');
      this.status.set('Truy vấn demo gặp lỗi. Bộ lọc đã áp dụng trước đó vẫn được giữ.');
      return;
    }
    this.applied.set(draft);
    this.state.set('success');
    this.status.set('Đã áp dụng bộ lọc. Có ' + this.results().length + ' / ' + this.rows().length + ' dự án phù hợp.');
  }

  async pause(selected: QueryDemoProject[]): Promise<void> {
    const ids = selected.filter(row => row.active).map(row => row.id);
    if (!ids.length) return;
    try {
      await this.confirm.confirm('Tạm dừng ' + ids.length + ' dự án đã chọn trong phiên demo? Bạn có thể hoàn tác ngay sau đó.', {
        title: 'Tạm dừng dự án',
        yesTitle: 'Tạm dừng',
        noTitle: 'Hủy',
      });
    } catch {
      this.status.set('Đã hủy. Trạng thái dự án được giữ nguyên.');
      return;
    }
    const currentIds = ids.filter(id => this.rows().some(row => row.id === id && row.active));
    this.rows.update(rows => pauseQueryDemoProjects(rows, currentIds));
    this.undoIds.set(currentIds);
    this.status.set('Đã tạm dừng ' + currentIds.length + ' dự án.');
  }
  undo(): void {
    const ids = new Set(this.undoIds());
    this.rows.update(rows => rows.map(row => (ids.has(row.id) ? { ...row, active: true } : row)));
    this.undoIds.set([]);
    this.status.set('Đã hoàn tác thao tác tạm dừng.');
  }
  reset(): void {
    this.rows.set(structuredClone([...QUERY_DEMO_PROJECTS]));
    this.preset.set('and');
    this.value.set(queryDemoPreset('and'));
    this.applied.set(queryDemoPreset('and'));
    this.search.set('');
    this.undoIds.set([]);
    this.state.set('success');
    this.error.set('');
    this.failNext.set(false);
    this.mode.set('edit');
    this.disabled.set(false);
    this.comparisonMode.set('value-or-field');
    this.operator.set('GREATER_THAN');
    this.threshold.set(80);
    this.status.set('Đã khôi phục 6 dự án mẫu và bộ lọc AND.');
  }
}
SdTabComponent({ component: QueryBuilderDemoComponent, name: 'Query Builder', icon: 'filter_alt' })(QueryBuilderDemoComponent);
