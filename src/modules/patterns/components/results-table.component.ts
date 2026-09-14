import { ChangeDetectionStrategy, Component, computed, effect, input, output, viewChild } from '@angular/core';
import { SdTable, SdTableCellDefDirective, SdTableOption } from '@sdcorejs/angular/components/table';
import { PatternOrder, STATUS_LABELS } from '../data/pattern-query';
@Component({
  selector: 'app-pattern-results',
  imports: [SdTable, SdTableCellDefDirective],
  templateUrl: './results-table.component.html',
  styleUrl: '../styles/patterns.scss',
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
  readonly openRecord = output<PatternOrder>();
  readonly approve = output<number[]>();
  readonly option = computed<SdTableOption<PatternOrder>>(() => {
    const rows = this.rows();
    return {
      type: 'local',
      rowKey: 'id',
      sort: { enable: true },
      items: () => rows,
      columns: [
        { field: 'code', title: 'Mã đơn', type: 'string', width: '120px', sortable: true },
        { field: 'name', title: 'Khách hàng', type: 'string', width: '180px', sortable: true },
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
        { field: 'amount', title: 'Giá trị (VND)', type: 'number', align: 'right', width: '150px', sortable: true },
      ],
      paginate: { pageSize: 6, pages: [6, 12, 24] },
      config: { visible: true },
      filter: {
        cacheable: false,
        hideInlineFilter: true,
        hideExternalFilterToolbar: true,
        ...(this.quickSearch() ? { quickSearch: { containFields: ['code', 'name'], placeholder: 'Tìm mã hoặc tên' } } : {}),
      },
      ...(this.selectable()
        ? {
            selector: {
              visible: true,
              actions: [
                {
                  title: 'Duyệt đơn hàng',
                  icon: 'check_circle',
                  click: (selected: PatternOrder[]) => this.approve.emit(selected.map(r => r.id)),
                },
              ],
            },
          }
        : {}),
    };
  });
}
