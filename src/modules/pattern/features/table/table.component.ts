import { ChangeDetectionStrategy, Component, computed, inject, input, signal, viewChild } from '@angular/core';
import { SdFormatNumberPipe } from '@sdcorejs/angular/pipes';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdDataState, SdDataStateTemplateDirective } from '@sdcorejs/angular/components/data-state';
import { SdTable, SdTableOption, SdMaterialFooterDefDirective } from '@sdcorejs/angular/components/table';
import { ResultsTableComponent } from '../../components/results-table.component';

import { OrderDetailComponent } from '../../components/order-detail.component';
import { PatternStore } from '../../data/pattern-store';
import { TreeTableComponent } from './tree-table.component';
import { InlineTableComponent } from './inline-table.component';
import { normalizeSearch, PatternOrder } from '../../data/pattern-query';

interface RelatedLine {
  id: number;
  name: string;
  quantity: number;
  price: number;
  amount: number;
}

@Component({
  selector: 'app-pattern-table',
  imports: [
    FormsModule,
    SdFormatNumberPipe,
    SdButton,
    SdDataState,
    SdDataStateTemplateDirective,
    SdTable,
    SdMaterialFooterDefDirective,
    ResultsTableComponent,
    OrderDetailComponent,
    TreeTableComponent,
    InlineTableComponent,
  ],
  providers: [PatternStore],
  templateUrl: './table.component.html',
  styleUrls: ['../../styles/pattern.scss', './table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  readonly variant = input('standard');
  readonly store = inject(PatternStore);
  readonly lines: RelatedLine[] = [
    { id: 1, name: 'Máy in', quantity: 2, price: 3000000 },
    { id: 2, name: 'Màn hình', quantity: 3, price: 2500000 },
    { id: 3, name: 'Bàn phím', quantity: 5, price: 400000 },
  ].map(row => ({ ...row, amount: row.quantity * row.price }));
  readonly totalQuantity = this.lines.reduce((total, row) => total + row.quantity, 0);
  readonly totalAmount = this.lines.reduce((total, row) => total + row.amount, 0);
  readonly relatedOption: SdTableOption<RelatedLine> = {
    type: 'local',
    items: () => this.lines,
    rowKey: 'id',
    selector: { visible: false },
    paginate: { hidden: true, pageSize: 20 },
    filter: { disabled: true },
    columns: [
      { field: 'name', title: 'Sản phẩm', type: 'string' },
      { field: 'quantity', title: 'Số lượng', type: 'number', align: 'right' },
      { field: 'price', title: 'Đơn giá (VND)', type: 'number', align: 'right' },
      { field: 'amount', title: 'Thành tiền (VND)', type: 'number', align: 'right' },
    ],
  };
  readonly state = signal<'ready' | 'empty' | 'error'>('ready');
  private readonly errorScenarioRevision = signal(0);
  readonly stateTable = viewChild<SdTable<PatternOrder>>('stateTable');
  readonly stateOption = computed<SdTableOption<PatternOrder>>(() => {
    this.errorScenarioRevision();
    const scenario = this.state();
    // Mỗi lần chọn kịch bản lỗi chỉ làm thất bại request đầu; retry dùng lại query của Core.
    let failNextRead = scenario === 'error';
    return {
      type: 'server',
      rowKey: 'id',
      items: async request => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (failNextRead) {
          failNextRead = false;
          throw new Error('Không thể tải đơn hàng mẫu.');
        }
        const term = normalizeSearch(request.quickSearch?.term ?? '');
        const rows =
          scenario === 'empty' ? [] : this.store.records().filter(row => normalizeSearch(row.code + ' ' + row.name).includes(term));
        const start = request.pageNumber * request.pageSize;
        return { items: rows.slice(start, start + request.pageSize), total: rows.length };
      },
      selector: { visible: false },
      paginate: { pageSize: 6, pages: [6, 12, 24] },
      filter: {
        cacheable: false,
        hideInlineFilter: true,
        hideExternalFilterToolbar: true,
        quickSearch: { containFields: ['code', 'name'], placeholder: 'Tìm mã hoặc tên khách hàng' },
      },
      columns: [
        { field: 'code', title: 'Mã đơn', type: 'string' },
        { field: 'name', title: 'Khách hàng', type: 'string' },
        { field: 'region', title: 'Khu vực', type: 'string' },
        { field: 'amount', title: 'Giá trị (VND)', type: 'number', align: 'right' },
      ],
    };
  });

  showState(state: 'ready' | 'empty' | 'error'): void {
    if (this.state() === state) {
      if (state === 'error') {
        this.errorScenarioRevision.update(value => value + 1);
      } else {
        void this.stateTable()?.reload(true);
      }
    } else this.state.set(state);
  }
}
