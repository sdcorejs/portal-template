import { ChangeDetectionStrategy, Component, TemplateRef, computed, effect, input, output, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  SdTable,
  SdTableCellDefDirective,
  SdTableTitleDefDirective,
  SdTableQuickSearchRightDefDirective,
  SdTableOption,
} from '@sdcorejs/angular/components/table';
import { SdFormatNumberPipe } from '@sdcorejs/angular/pipes';
import { normalizeSearch, PatternOrder, STATUS_LABELS } from '../data/pattern-query';
@Component({
  selector: 'app-pattern-results',
  imports: [
    SdTable,
    SdTableCellDefDirective,
    SdTableTitleDefDirective,
    SdTableQuickSearchRightDefDirective,
    NgTemplateOutlet,
    SdFormatNumberPipe,
  ],
  templateUrl: './results-table.component.html',
  styleUrl: '../styles/pattern.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsTableComponent {
  readonly table = viewChild(SdTable);
  constructor() {
    effect(onCleanup => {
      const table = this.table();
      const paginator = table?.paginator();
      if (!table || !paginator) return;
      // The view query resolves before Core applies its configured initial size.
      let pageSize = this.option().paginate?.pageSize ?? 6;
      const subscription = paginator.page.subscribe(event => {
        // Flush Core's pending initial filter notification without resetting this page.
        table.onFilterCommit();
        if (pageSize === event.pageSize) return;
        pageSize = event.pageSize;
        table.onClearSelection();
        paginator.firstPage();
      });
      onCleanup(() => subscription.unsubscribe());
    });
    effect(onCleanup => {
      const table = this.table();
      const sort = table?.sort();
      const paginator = table?.paginator();
      if (!table || !sort || !paginator) return;
      const subscription = sort.sortChange.subscribe(() => {
        table.onClearSelection();
        table.onFilterCommit();
        paginator.firstPage();
      });
      onCleanup(() => subscription.unsubscribe());
    });
  }
  readonly rows = input.required<PatternOrder[]>();
  readonly selectable = input(false);
  readonly quickSearch = input(false);
  readonly quickSearchRight = input<TemplateRef<unknown>>();
  readonly externalFilter = input(false);
  readonly inlineFilter = input(false);
  readonly filterOperators = input(false);
  readonly groupedActions = input(false);
  readonly customCells = input(false);
  readonly fill = input(false);
  readonly openRecord = output<PatternOrder>();
  readonly approve = output<number[]>();
  readonly complete = output<number[]>();
  readonly option = computed<SdTableOption<PatternOrder>>(() => {
    const rows = this.rows();
    return {
      ...(this.externalFilter() || this.filterOperators()
        ? {
            type: 'server' as const,
            items: async request => {
              await new Promise(resolve => setTimeout(resolve, 1000 + Math.floor(Math.random() * 1001)));
              const name = normalizeSearch(String(request.rawExternalFilter['name'] ?? ''));
              const status = request.rawExternalFilter['status'];
              const filtered = rows.filter(row => {
                if (!normalizeSearch(row.name).includes(name) || (status && row.status !== status)) return false;
                if (!this.filterOperators()) return true;
                // Demo server adapter: Core sends the selected operator with each column filter.
                return ['code', 'name', 'region', 'status', 'amount'].every(field => {
                  const value = request.rawColumnFilter[field];
                  if (value == null || value === '') return true;
                  const actual = row[field as keyof PatternOrder];
                  const operator = request.columnOperator?.[field] ?? (field === 'amount' || field === 'status' ? 'EQUAL' : 'CONTAIN');
                  if (field === 'amount') {
                    const left = Number(actual),
                      right = Number(value);
                    switch (operator) {
                      case 'GREATER_THAN':
                        return left > right;
                      case 'GREATER_OR_EQUAL':
                        return left >= right;
                      case 'LESS_THAN':
                        return left < right;
                      case 'LESS_OR_EQUAL':
                        return left <= right;
                      default:
                        return left === right;
                    }
                  }
                  const left = normalizeSearch(String(actual)),
                    right = normalizeSearch(String(value));
                  return operator === 'EQUAL' ? left === right : operator === 'START_WITH' ? left.startsWith(right) : left.includes(right);
                });
              });
              const field = request.orderBy;
              if (field && ['code', 'name', 'amount'].includes(field) && request.orderDirection) {
                filtered.sort((a, b) => {
                  const left = a[field as keyof PatternOrder];
                  const right = b[field as keyof PatternOrder];
                  const comparison =
                    typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right), 'vi');
                  return request.orderDirection === 'DESC' ? -comparison : comparison;
                });
              }
              const start = request.pageNumber * request.pageSize;
              return { items: filtered.slice(start, start + request.pageSize), total: filtered.length };
            },
          }
        : { type: 'local' as const, items: () => rows }),
      rowKey: 'id',
      sort: { enable: true },
      columns: [
        { field: 'code', title: 'Mã đơn', type: 'string', width: '120px', sortable: true },
        {
          field: 'name',
          title: 'Khách hàng',
          type: 'string',
          width: this.filterOperators() ? '240px' : '180px',
          sortable: true,
          filter: this.filterOperators() ? { operator: { enable: true, list: ['CONTAIN', 'EQUAL', 'START_WITH'] } } : undefined,
        },
        { field: 'region', title: 'Khu vực', type: 'string', width: '120px' },
        {
          field: 'status',
          title: 'Trạng thái',
          type: 'values',
          width: '150px',
          option: { items: Object.entries(STATUS_LABELS).map(([id, name]) => ({ id, name })), valueField: 'id', displayField: 'name' },
          useBadge: (_value, row) => ({
            title: STATUS_LABELS[row.status],
            color: row.status === 'pending' ? 'warning' : row.status === 'done' ? 'success' : 'info',
          }),
        },
        {
          field: 'amount',
          title: 'Giá trị (VND)',
          type: 'number',
          align: 'right',
          width: this.filterOperators() ? '240px' : '150px',
          sortable: true,
          filter: this.filterOperators()
            ? {
                operator: {
                  enable: true,
                  list: ['EQUAL', 'GREATER_THAN', 'GREATER_OR_EQUAL', 'LESS_THAN', 'LESS_OR_EQUAL'],
                },
              }
            : undefined,
        },
      ],
      paginate: { pageSize: 6, pages: [6, 12, 24] },
      config: { visible: true },
      filter: {
        cacheable: false,
        hideInlineFilter: !this.inlineFilter(),
        hideExternalFilterToolbar: !this.externalFilter(),
        ...(this.externalFilter()
          ? {
              externalFilters: [
                { field: 'name', title: 'Khách hàng', type: 'string' as const, defaultShowing: true },
                {
                  field: 'status',
                  title: 'Trạng thái',
                  type: 'values' as const,
                  defaultShowing: true,
                  option: {
                    items: Object.entries(STATUS_LABELS).map(([id, name]) => ({ id, name })),
                    valueField: 'id',
                    displayField: 'name',
                  },
                },
              ],
            }
          : this.quickSearch()
            ? { quickSearch: { containFields: ['code', 'name'], placeholder: 'Tìm mã hoặc tên' } }
            : {}),
      },
      ...(this.groupedActions()
        ? {
            command: {
              commands: [
                {
                  title: 'Xử lý đơn hàng',
                  icon: 'more_horiz',
                  children: [
                    { title: 'Xem chi tiết', icon: 'visibility', click: (row: PatternOrder) => this.openRecord.emit(row) },
                    {
                      title: 'Duyệt đơn hàng',
                      icon: 'task_alt',
                      color: 'success' as const,
                      click: (row: PatternOrder) => this.approve.emit([row.id]),
                    },
                    {
                      title: 'Hoàn tất đơn hàng',
                      icon: 'done_all',
                      color: 'info' as const,
                      click: (row: PatternOrder) => this.complete.emit([row.id]),
                    },
                  ],
                },
              ],
            },
          }
        : {}),
      ...(this.selectable() || this.groupedActions()
        ? {
            selector: {
              visible: true,
              actions: this.groupedActions()
                ? [
                    {
                      title: 'Xử lý các đơn đã chọn',
                      icon: 'task_alt',
                      color: 'success',
                      type: 'light',
                      children: [
                        {
                          title: 'Duyệt đơn hàng',
                          icon: 'task_alt',
                          color: 'success',
                          click: selected => this.approve.emit((selected ?? []).map(row => row.id)),
                        },
                        {
                          title: 'Hoàn tất đơn hàng',
                          icon: 'done_all',
                          color: 'info',
                          click: selected => this.complete.emit((selected ?? []).map(row => row.id)),
                        },
                      ],
                    },
                  ]
                : [
                    {
                      title: 'Duyệt đơn hàng',
                      icon: 'task_alt',
                      color: 'success',
                      type: 'light',
                      click: (selected: PatternOrder[]) => this.approve.emit(selected.map(r => r.id)),
                    },
                  ],
            },
          }
        : {}),
    };
  });
}
