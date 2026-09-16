import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { SdCard, SdCardGroup } from '@sdcorejs/angular/components/card';
import { SdIcon } from '@sdcorejs/angular/modules/icon';
import { SdTableOption } from '@sdcorejs/angular/components/table';
import { Color } from '@sdcorejs/utils/models';
import { LIST_IMPORTS, ListPatternBase } from '../list-standard/list-standard.component';
import { DemoEntity, GROUP_OPTIONS, STATUS_OPTIONS } from '../../data/models';
import { statusBadge } from '../../components/status-badge';
import { OrderSummaryApi, OrderSummary, OrderSummaryFilter } from './order-summary-api';
@Component({
  selector: 'app-list-score-filter',
  imports: [...LIST_IMPORTS, SdCard, SdCardGroup, SdIcon],
  providers: [OrderSummaryApi],
  templateUrl: './list-score-filter.component.html',
  styleUrl: './list-score-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListScoreFilterComponent extends ListPatternBase {
  private readonly api = inject(OrderSummaryApi);
  private readonly destroy = inject(DestroyRef);
  readonly filters = signal<OrderSummaryFilter>({});
  readonly summary = signal<OrderSummary | null>(null);
  readonly summaryLoading = signal(false);
  readonly summaryError = signal(false);
  private summaryRequest = 0;
  private summaryKey = '';
  private summaryRows: DemoEntity[] | null = null;
  readonly cards: { id: keyof OrderSummary; title: string; icon: string; color: Color }[] = [
    { id: 'all', title: 'Tổng đơn hàng', icon: 'receipt_long', color: 'info' },
    { id: 'pending', title: 'Chờ xử lý', icon: 'schedule', color: 'warning' },
    { id: 'active', title: 'Đang hoạt động', icon: 'check_circle', color: 'success' },
    { id: 'inactive', title: 'Tạm dừng', icon: 'pause_circle', color: 'secondary' },
  ];
  async loadSummary(filter = this.filters()) {
    const request = ++this.summaryRequest;
    this.summaryLoading.set(true);
    this.summaryError.set(false);
    try {
      const result = await this.api.summary({ ...filter });
      if (request === this.summaryRequest && !this.destroy.destroyed) this.summary.set(result);
    } catch {
      if (request === this.summaryRequest && !this.destroy.destroyed) this.summaryError.set(true);
    } finally {
      if (request === this.summaryRequest && !this.destroy.destroyed) this.summaryLoading.set(false);
    }
  }
  chooseCard(value: unknown) {
    const status = typeof value === 'string' && value !== 'all' ? value : undefined;
    this.filters.update(filter => ({ ...filter, status }));
    this.table()?.setFilter({ externalFilter: { ...this.filters(), status: status ?? null } });
  }
  override readonly option = computed<SdTableOption<DemoEntity>>(() => ({
    type: 'server',
    rowKey: 'id',
    items: async (request, paging) => {
      const filter: OrderSummaryFilter = { ...request.rawExternalFilter };
      this.filters.set(filter);
      const key = JSON.stringify(filter);
      if (key !== this.summaryKey || this.summaryRows !== this.store.records()) {
        this.summaryKey = key;
        this.summaryRows = this.store.records();
        void this.loadSummary(filter);
      }
      return this.api.list(paging);
    },
    columns: [
      { field: 'code', title: 'Mã đơn hàng', type: 'string', width: '140px' },
      { field: 'name', title: 'Tên đơn hàng', type: 'string', width: '280px' },
      {
        field: 'group',
        title: 'Khu vực',
        type: 'values',
        option: { items: GROUP_OPTIONS, valueField: 'id', displayField: 'name' },
        width: '140px',
      },
      {
        field: 'status',
        title: 'Trạng thái',
        type: 'values',
        option: { items: STATUS_OPTIONS, valueField: 'id', displayField: 'name' },
        useBadge: (_value, row) => statusBadge(row.status, 'round'),
        width: '170px',
      },
      { field: 'amount', title: 'Giá trị (VND)', type: 'number', align: 'right', width: '160px' },
    ],
    paginate: { pageSize: 10, pages: [10, 20, 30] },
    config: { visible: false },
    filter: {
      cacheable: false,
      hideInlineFilter: true,
      hideExternalFilterToolbar: true,
      externalFilters: [
        { field: 'name', title: 'Tên đơn hàng', type: 'string', defaultShowing: true },
        {
          field: 'status',
          title: 'Trạng thái',
          type: 'values',
          defaultShowing: true,
          option: { items: STATUS_OPTIONS, valueField: 'id', displayField: 'name' },
        },
        {
          field: 'group',
          title: 'Khu vực',
          type: 'values',
          defaultShowing: true,
          option: { items: GROUP_OPTIONS, valueField: 'id', displayField: 'name' },
        },
      ],
    },
  }));
}
