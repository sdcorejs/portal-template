import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdTable, SdTableColumn, SdTableOption } from '@sdcorejs/angular/components/table';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

interface OrderRow {
  code: string;
  customer: string;
  total: number;
  status: 'NEW' | 'PAID' | 'SHIPPED';
  createdAt: string;
}

const STATUS_OPTIONS = [
  { id: 'NEW', name: 'Mới' },
  { id: 'PAID', name: 'Đã thanh toán' },
  { id: 'SHIPPED', name: 'Đã giao' },
];

@Component({
  selector: 'app-table-index-column',
  standalone: true,
  imports: [CommonModule, FormsModule, SdTable, SdCodeEditor, SdPageComponent, SdSection, SdSelect, SdSwitch, SdInput],
  templateUrl: './index-column.component.html',
  styleUrls: ['./index-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableIndexColumnComponent {
  // ── Config signals ──────────────────────────────────────────────────────────
  indexEnabled = signal(true);
  indexTitle = signal('#');
  indexWidth = signal('60px');
  pageSize = signal(5);
  showSelector = signal(false);

  pageSizeOptions = [
    { id: 5, name: '5' },
    { id: 10, name: '10' },
    { id: 25, name: '25' },
  ];

  pageDescription = signal(
    'Bật/tắt cột STT (Số thứ tự) của sd-table thông qua thuộc tính `index`. STT được tính theo global index `pageIndex * pageSize + i + 1`, do đó tương thích với phân trang server lẫn local. Cột STT sticky đầu, hiển thị ngay sau cột selector (nếu có).'
  );

  // ── Reactive table option ──────────────────────────────────────────────────
  tableOption = computed((): SdTableOption<OrderRow> => ({
    type: 'local',
    key: 'table-index-demo',
    columns: this.buildColumns(),
    items: () => this.getMockData(),
    index: this.indexEnabled()
      ? { enabled: true, title: this.indexTitle() || '#', width: this.indexWidth() || '60px' }
      : { enabled: false },
    selector: { visible: this.showSelector() },
    paginate: { pageSize: this.pageSize(), pages: [5, 10, 25] },
    filter: { hideExternalFilterToolbar: true },
    config: { visible: true },
  }));

  // ── Generated TS snippet ───────────────────────────────────────────────────
  tsCode = computed(() => {
    const enabled = this.indexEnabled();
    const title = this.indexTitle() || '#';
    const width = this.indexWidth() || '60px';
    const ps = this.pageSize();
    const sel = this.showSelector();
    return `tableOption: SdTableOption<OrderRow> = {
  type: 'local',
  key: 'order-list',
  items: () => this.getOrders(),

  // Bật/tắt cột STT (Số thứ tự) — STT tính theo global index khi phân trang
  // pageIndex * pageSize + i + 1 → trang 2 (pageSize 5) bắt đầu từ 6
  index: ${enabled ? `{
    enabled: true,
    title: '${title}',     // mặc định '#'
    width: '${width}',     // mặc định '50px'
  }` : `{ enabled: false }`},
${sel ? `  selector: { visible: true },  // STT render ngay sau selector
` : ''}
  columns: [
    { field: 'code',      title: 'Mã đơn',   type: 'string' },
    { field: 'customer',  title: 'Khách',    type: 'string' },
    { field: 'total',     title: 'Tổng (₫)', type: 'number', align: 'right' },
    { field: 'status',    title: 'Trạng thái', type: 'values',
      option: { items: STATUS_OPTIONS, valueField: 'id', displayField: 'name' } },
    { field: 'createdAt', title: 'Tạo lúc',  type: 'datetime' },
  ],

  paginate: { pageSize: ${ps}, pages: [5, 10, 25] },
};`;
  });

  // ── Columns ────────────────────────────────────────────────────────────────
  private buildColumns(): SdTableColumn<OrderRow>[] {
    return [
      { field: 'code', title: 'Mã đơn', type: 'string', width: '120px', cell: { copiable: true } },
      { field: 'customer', title: 'Khách hàng', type: 'string', width: '220px' },
      {
        field: 'total',
        title: 'Tổng (VNĐ)',
        type: 'number',
        width: '150px',
        align: 'right',
        transform: v => new Intl.NumberFormat('vi-VN').format(v as number),
      },
      {
        field: 'status',
        title: 'Trạng thái',
        type: 'values',
        width: '160px',
        option: { items: STATUS_OPTIONS, valueField: 'id', displayField: 'name' },
      },
      { field: 'createdAt', title: 'Tạo lúc', type: 'datetime', width: '170px' },
    ];
  }

  private getMockData(): OrderRow[] {
    const customers = [
      'Nguyễn Văn An',
      'Trần Thị Bình',
      'Lê Hoàng Cường',
      'Phạm Thu Dung',
      'Hoàng Minh Đức',
      'Vũ Thị Lan',
      'Đặng Văn Hùng',
      'Bùi Thị Mai',
    ];
    const statuses: OrderRow['status'][] = ['NEW', 'PAID', 'SHIPPED'];
    return Array.from({ length: 28 }, (_, i) => ({
      code: `DH-${String(i + 1).padStart(4, '0')}`,
      customer: customers[i % customers.length],
      total: (1 + (i % 10)) * 1_250_000,
      status: statuses[i % statuses.length],
      createdAt: new Date(2025, i % 12, (i % 28) + 1, 8 + (i % 8), (i * 7) % 60).toISOString(),
    }));
  }
}
