import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdBadge } from '@sdcorejs/angular/components/badge';
import { SdSideDrawer } from '@sdcorejs/angular/components/side-drawer';
import { SdTable, SdTableCellDefDirective, SdTableItem, SdTableOption } from '@sdcorejs/angular/components/table';

// View model của showcase; children là quan hệ cây, không phải trạng thái selection của DTO.
interface ProductTreeRow {
  id: string;
  code: string;
  name: string;
  kind: 'group' | 'category' | 'product';
  quantity: number;
  status: 'active' | 'paused';
  children?: ProductTreeRow[];
}

@Component({
  selector: 'app-pattern-tree-table',
  imports: [FormsModule, SdButton, SdBadge, SdSideDrawer, SdTable, SdTableCellDefDirective],
  templateUrl: './tree-table.component.html',
  styleUrl: './tree-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeTableComponent {
  readonly table = viewChild.required(SdTable<ProductTreeRow>);
  readonly drawer = viewChild.required(SdSideDrawer);
  readonly selection = signal(true);
  readonly commands = signal(true);
  readonly message = signal('');
  readonly detail = signal<(ProductTreeRow & { path: string }) | null>(null);
  readonly labels = { group: 'Nhóm', category: 'Danh mục', product: 'Sản phẩm' };
  private readonly document = inject(DOCUMENT);
  private opener: HTMLElement | null = null;
  readonly records = signal<ProductTreeRow[]>([
    {
      id: 'office',
      code: 'NH-VP',
      name: 'Thiết bị văn phòng',
      kind: 'group',
      quantity: 30,
      status: 'active',
      children: [
        {
          id: 'print',
          code: 'VP-PRINT',
          name: 'In ấn',
          kind: 'category',
          quantity: 10,
          status: 'active',
          children: [
            { id: 'hp', code: 'SP-001', name: 'HP LaserJet Pro', kind: 'product', quantity: 6, status: 'active' },
            { id: 'canon', code: 'SP-002', name: 'Canon PIXMA G3010', kind: 'product', quantity: 4, status: 'active' },
          ],
        },
        {
          id: 'display',
          code: 'VP-DISPLAY',
          name: 'Hiển thị',
          kind: 'category',
          quantity: 20,
          status: 'active',
          children: [
            { id: 'dell', code: 'SP-003', name: 'Màn hình Dell 27 inch', kind: 'product', quantity: 12, status: 'active' },
            { id: 'lg', code: 'SP-004', name: 'Màn hình LG UltraWide', kind: 'product', quantity: 8, status: 'paused' },
          ],
        },
      ],
    },
    {
      id: 'it',
      code: 'NH-CNTT',
      name: 'Thiết bị CNTT',
      kind: 'group',
      quantity: 8,
      status: 'active',
      children: [
        {
          id: 'laptop',
          code: 'IT-LAPTOP',
          name: 'Máy tính xách tay',
          kind: 'category',
          quantity: 8,
          status: 'active',
          children: [
            { id: 'mac', code: 'SP-005', name: 'MacBook Air M3', kind: 'product', quantity: 3, status: 'active' },
            { id: 'thinkpad', code: 'SP-006', name: 'Lenovo ThinkPad T14', kind: 'product', quantity: 5, status: 'active' },
          ],
        },
      ],
    },
  ]);
  readonly option = computed<SdTableOption<ProductTreeRow>>(() => ({
    type: 'local',
    // Giữ option ổn định khi sửa dữ liệu để Core bảo toàn nhánh đang mở theo rowKey.
    items: () => this.records(),
    rowKey: 'id',
    tree: { loadType: 'static', childrenKey: 'children', defaultExpanded: true, indentSize: 16 },
    index: { enabled: false },
    paginate: { pageSize: 20, hidden: true },
    filter: { cacheable: false, hideInlineFilter: true, hideExternalFilterToolbar: true },
    columns: [
      { field: 'name', title: 'Nhóm / danh mục / sản phẩm', type: 'string', width: '350px' },
      { field: 'kind', title: 'Loại dòng', type: 'string', width: '110px' },
      { field: 'quantity', title: 'Số lượng', type: 'number', align: 'right', width: '100px' },
      { field: 'status', title: 'Trạng thái', type: 'string', width: '130px' },
    ],
    rowCss: row =>
      row.kind === 'group' ? { background: 'color-mix(in srgb, var(--sd-primary) 7%, var(--sd-surface))', fontWeight: '600' } : {},
    selector: {
      visible: this.selection(),
      disabled: row => row?.kind !== 'product',
      preserveSelection: false,
      message: selected => `Đã chọn ${selected?.length ?? 0} sản phẩm`,
      actions: [
        { title: 'Tạm ngừng sản phẩm đã chọn', icon: 'pause_circle', click: rows => this.setStatus(rows ?? [], 'paused') },
        { title: 'Mở bán sản phẩm đã chọn', icon: 'play_circle', click: rows => this.setStatus(rows ?? [], 'active') },
      ],
    },
    command: {
      align: 'right',
      commands: this.commands()
        ? [
            { title: 'Xem chi tiết', icon: 'visibility', click: row => this.openDetail(row) },
            {
              title: row => (row.status === 'active' ? 'Tạm ngừng' : 'Mở bán'),
              icon: row => (row.status === 'active' ? 'pause_circle' : 'play_circle'),
              hidden: row => row.kind !== 'product',
              click: row => this.setStatus([row], row.status === 'active' ? 'paused' : 'active'),
            },
          ]
        : [],
    },
  }));

  toggleSelection(value: boolean): void {
    this.table().onClearSelection();
    this.selection.set(value);
  }

  toggleCommands(value: boolean): void {
    this.table().onClearSelection();
    this.commands.set(value);
  }

  async setStatus(rows: ProductTreeRow[], status: ProductTreeRow['status']): Promise<void> {
    const ids = new Set(rows.filter(row => row.kind === 'product').map(row => row.id));
    if (!ids.size) return;
    const flattened = (items: SdTableItem<ProductTreeRow>[]): SdTableItem<ProductTreeRow>[] =>
      items.flatMap(item => [item, ...flattened(item.meta.tree?.childItems ?? [])]);
    const collapsed = new Set(
      flattened(this.table().items())
        .filter(item => item.meta.tree?.hasChildren && !item.meta.tree.isExpanded)
        .map(item => item.data.id)
    );
    const update = (items: ProductTreeRow[]): ProductTreeRow[] =>
      items.map(row => ({
        ...row,
        status: ids.has(row.id) ? status : row.status,
        ...(row.children ? { children: update(row.children) } : {}),
      }));
    this.table().onClearSelection();
    this.records.update(update);
    await this.table().reload(true);
    // Core áp dụng lại defaultExpanded khi reload; khôi phục nhánh người dùng đã thu gọn.
    for (const item of flattened(this.table().items())) {
      if (collapsed.has(item.data.id) && item.meta.tree?.isExpanded) await this.table().onTreeToggle(item);
    }
    this.message.set(`Đã ${status === 'paused' ? 'tạm ngừng' : 'mở bán'} ${ids.size} sản phẩm.`);
  }

  openDetail(row: ProductTreeRow): void {
    const findPath = (items: ProductTreeRow[], parents: string[] = []): string[] | undefined => {
      for (const item of items) {
        const path = [...parents, item.name];
        if (item.id === row.id) return path;
        const found = item.children && findPath(item.children, path);
        if (found) return found;
      }
      return undefined;
    };
    this.opener = this.document.activeElement as HTMLElement;
    this.detail.set({ ...row, path: findPath(this.records())!.join(' / ') });
    this.drawer().open();
  }

  restoreFocus(): void {
    requestAnimationFrame(() => {
      if (this.opener?.isConnected) this.opener.focus();
    });
  }
}
