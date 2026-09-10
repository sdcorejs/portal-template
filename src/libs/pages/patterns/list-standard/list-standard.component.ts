import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  afterRenderEffect,
  computed,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { PageNavigation } from '../../reference/page-navigation';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdTable, SdTableCellDefDirective, SdTableOption } from '@sdcorejs/angular/components/table';
import { SdButton } from '@sdcorejs/angular/components/button';
import { statusBadge } from '../../components/status-badge';
import { queryTablePage } from '../../data/table-query';
import { DemoSessionStore } from '../../data/demo-session.store';
import { DemoEntity, STATUS_OPTIONS, GROUP_OPTIONS } from '../../data/models';

import { DetailOverviewComponent } from '../detail-overview/detail-overview.component';
import { DetailRelatedRecordsComponent } from '../detail-related-records/detail-related-records.component';
import { FormSectionsComponent } from '../form-sections/form-sections.component';
import { FormLineItemsComponent } from '../form-line-items/form-line-items.component';
import { SdDataState } from '@sdcorejs/angular/components/data-state';
@Directive()
export abstract class ListPatternBase {
  readonly store = inject(DemoSessionStore);
  readonly navigation = inject(PageNavigation);
  readonly view = computed(() => (this.navigation.view() === 'update' ? 'detail' : this.navigation.view()));
  readonly bulkMessage = signal('');
  readonly rows = computed(() => this.store.records());
  readonly table = viewChild(SdTable);
  constructor() {
    let previous = this.store.records();
    afterRenderEffect(() => {
      const records = this.store.records();
      if (records === previous) return;
      previous = records;
      // Refresh the source without replacing the table option and resetting applied filters.
      untracked(() => {
        void this.table()?.reload(true, false);
      });
    });
  }
  readonly scoreCards = computed(() => {
    const rows = this.store.records();
    return [
      { label: this.store.kind === 'order' ? 'Tổng đơn hàng' : 'Tổng yêu cầu', value: rows.length, tone: 'default' },
      { label: 'Chờ xử lý', value: rows.filter(row => row.status === 'pending').length, tone: 'warning' },
      { label: 'Đang hoạt động', value: rows.filter(row => row.status === 'active').length, tone: 'success' },
    ];
  });
  readonly option = computed<SdTableOption<DemoEntity>>(() => {
    return {
      ...(this.store.kind === 'order' || this.store.kind === 'product'
        ? {
            type: 'server' as const,
            items: async (_request, paging) => {
              await new Promise(resolve => setTimeout(resolve, 1000 + Math.floor(Math.random() * 1001)));
              return queryTablePage(this.store.records(), paging, this.store.kind === 'product');
            },
          }
        : { type: 'local' as const, items: () => this.store.records() }),
      rowKey: 'id',
      columns: [
        { field: 'code', title: 'Mã hồ sơ', type: 'string', width: '120px' },
        { field: 'name', title: 'Tên hồ sơ', type: 'string', width: '250px' },
        {
          field: 'group',
          title: 'Khu vực',
          type: 'values',
          option: { items: GROUP_OPTIONS, valueField: 'id', displayField: 'name' },
          width: '120px',
        },
        {
          field: 'status',
          title: 'Trạng thái',
          type: 'values',
          useBadge: (_value, row) =>
            statusBadge(row.status, this.store.kind === 'customer' ? 'tag' : this.store.kind === 'order' ? 'round' : 'icon'),
          option: { items: STATUS_OPTIONS, valueField: 'id', displayField: 'name' },
          width: '150px',
        },
        { field: 'amount', title: 'Giá trị (VND)', type: 'number', align: 'right', width: '150px' },
      ],
      paginate: { pageSize: 10, pages: [10, 20, 30] },
      config: { visible: true },
      filter: {
        cacheable: false,
        hideInlineFilter: true,
        hideExternalFilterToolbar: this.store.kind !== 'order' && this.store.kind !== 'product',
        quickSearch:
          this.store.kind === 'product'
            ? undefined
            : {
                containFields: ['code', 'name'],
                placeholder: 'Tìm theo mã hoặc tên',
                filters:
                  this.store.kind === 'customer' || this.store.kind === 'ticket'
                    ? [
                        {
                          field: 'status',
                          title: 'Trạng thái',
                          type: 'values',
                          option: { items: STATUS_OPTIONS, valueField: 'id', displayField: 'name' },
                        },
                      ]
                    : undefined,
              },
        externalFilters:
          this.store.kind === 'order' || this.store.kind === 'product'
            ? [
                ...(this.store.kind === 'product'
                  ? [{ field: 'name', title: 'Tên sản phẩm', type: 'string' as const, defaultShowing: true }]
                  : []),
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
              ]
            : undefined,
      },
      selector:
        this.store.kind === 'order'
          ? {
              visible: true,
              actions: [
                {
                  title: 'Duyệt đơn hàng',
                  icon: 'check_circle',
                  click: rows => this.approve(rows),
                },
              ],
            }
          : undefined,
    };
  });
  open(row: DemoEntity) {
    return this.navigation.go('detail', row.id);
  }
  create() {
    return this.navigation.go('create');
  }
  async approve(rows: DemoEntity[]) {
    try {
      await this.store.updateStatus(
        rows.map(row => row.id),
        'active'
      );
      this.bulkMessage.set('Đã duyệt ' + rows.length + ' đơn hàng.');
    } catch {
      this.bulkMessage.set('Không thể cập nhật. Vui lòng thử lại.');
    }
  }
  back() {
    void this.navigation.backToList();
  }
}
export const LIST_IMPORTS = [
  SdPageComponent,
  SdTable,
  SdTableCellDefDirective,
  SdButton,
  SdDataState,
  DetailOverviewComponent,
  DetailRelatedRecordsComponent,
  FormSectionsComponent,
  FormLineItemsComponent,
];
@Component({
  selector: 'app-list-standard',
  imports: LIST_IMPORTS,
  templateUrl: './list-standard.component.html',
  styleUrl: './list-standard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListStandardComponent extends ListPatternBase {}
