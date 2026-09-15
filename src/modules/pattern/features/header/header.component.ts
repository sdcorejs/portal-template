import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, signal, viewChild } from '@angular/core';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdBadge } from '@sdcorejs/angular/components/badge';
import { SdSection, SdSectionItem } from '@sdcorejs/angular/components/section';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdNotifyService } from '@sdcorejs/angular/services/notify';
import { SdSideDrawer } from '@sdcorejs/angular/components/side-drawer';
import { SdPermissionService } from '@sdcorejs/angular/modules/permission';
import { MatMenuModule } from '@angular/material/menu';
import { SdIcon } from '@sdcorejs/angular/modules/icon';
import { SdTable, SdTableOption } from '@sdcorejs/angular/components/table';
import { PatternOrder, seedOrders, STATUS_LABELS } from '../../data/pattern-query';
@Component({
  selector: 'app-pattern-header',
  imports: [SdPageComponent, SdButton, SdBadge, SdSection, SdSectionItem, SdInput, SdSideDrawer, MatMenuModule, SdIcon, SdTable],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly permission = inject(SdPermissionService);
  readonly canEdit = () => this.permission.hasPermission('OMS_ORDER_C_UPDATE');
  edit(scope: 'page' | 'drawer'): void {
    if (!this.canEdit() || this.pending()[scope === 'page' ? 'detail' : scope]) return;
    if (scope === 'drawer') this.drawerMode.set('update');
    else this.pageVariant.set('update');
  }
  readonly variant = input('page');
  readonly pageVariant = signal('basic');
  readonly pageVariants = [
    ['basic', 'Cơ bản'],
    ['advanced', 'Nâng cao'],
    ['actions', 'Tác vụ'],
    ['compact', 'Tác vụ nhỏ gọn'],
    ['grouped', 'Tác vụ có gom nhóm'],
  ];
  readonly examples = [
    { id: 'list', label: 'Danh sách', title: 'Danh sách đơn hàng', description: 'Quản lý đơn hàng theo trạng thái xử lý.' },
    { id: 'detail', label: 'Chi tiết', title: 'Chi tiết đơn hàng', description: 'Công ty An Phát · Miền Bắc' },
    { id: 'create', label: 'Tạo mới', title: 'Tạo đơn hàng', description: '' },
    { id: 'update', label: 'Cập nhật', title: 'Cập nhật đơn hàng', description: 'Công ty An Phát · Miền Bắc' },
  ];
  readonly messages = signal<Record<string, string>>({});
  readonly visibleExamples = computed(() => (this.pageVariant() === 'update' ? [this.examples[3]] : this.examples.slice(0, 2)));
  readonly secondaryActions = {
    list: [{ title: 'Import', icon: 'upload', color: 'secondary' as const }],
    detail: [
      { title: 'Từ chối', icon: 'close', color: 'warning' as const },
      { title: 'Duyệt', icon: 'check', color: 'success' as const },
    ],
  };
  readonly pending = signal<Record<string, boolean>>({});
  readonly statuses = signal<Record<string, string>>({});
  readonly drawerMode = signal('create');
  readonly drawerExamples = [
    { mode: 'create', label: 'Ví dụ tạo mới', button: 'Mở tạo mới', icon: 'add' },
    { mode: 'update', label: 'Ví dụ chỉnh sửa', button: 'Mở chỉnh sửa', icon: 'edit' },
    { mode: 'detail', label: 'Ví dụ chi tiết', button: 'Mở chi tiết', icon: 'visibility' },
    { mode: 'grouped', label: 'Gom tác vụ ở header phải', button: 'Gom tác vụ', icon: 'more_vert' },
    { mode: 'table', label: 'Xem bảng dữ liệu liên quan', button: 'Xem bảng', icon: 'table_view' },
    { mode: 'selection', label: 'Chọn dữ liệu từ bảng', button: 'Chọn dữ liệu', icon: 'checklist' },
  ];
  readonly groupedDrawer = signal(false);
  readonly tableMode = signal('table');
  readonly tableDrawer = viewChild<SdSideDrawer>('tableDrawer');
  readonly picked = signal<PatternOrder[]>([]);
  readonly confirmed = signal<PatternOrder[]>([]);
  readonly tableOption = computed<SdTableOption<PatternOrder>>(() => ({
    type: 'local',
    rowKey: 'id',
    items: () => seedOrders(),
    columns: [
      { field: 'code', title: 'Mã đơn', type: 'string', width: '120px' },
      { field: 'name', title: 'Khách hàng', type: 'string', width: '180px' },
      { field: 'region', title: 'Khu vực', type: 'string', width: '120px' },
      {
        field: 'status',
        title: 'Trạng thái',
        type: 'string',
        useBadge: (_value, row) => ({ title: STATUS_LABELS[row.status], color: row.status === 'done' ? 'success' : 'warning' }),
      },
    ],
    paginate: { pageSize: 10, pages: [10, 20] },
    filter: {
      cacheable: false,
      hideInlineFilter: true,
      hideExternalFilterToolbar: true,
      quickSearch: { containFields: ['code', 'name'], placeholder: 'Tìm mã đơn hoặc khách hàng' },
    },
    selector: {
      visible: this.tableMode() === 'selection',
      onSelect: (_row, rows) => this.picked.set(rows ?? []),
      onSelectAll: rows => this.picked.set(rows),
    },
  }));
  confirmSelection(): void {
    if (!this.picked().length) return;
    this.confirmed.set([...this.picked()]);
    void this.tableDrawer()?.requestClose();
  }
  readonly record = signal({ customer: 'Công ty An Phát', region: 'Miền Bắc', amount: '12500000' });
  draft = { ...this.record() };
  private readonly notify = inject(SdNotifyService);
  saveDrawer(): void {
    if (this.pending()['drawer']) return;
    if (
      !this.draft.customer.trim() ||
      !this.draft.region.trim() ||
      !this.draft.amount.trim() ||
      !Number.isFinite(Number(this.draft.amount)) ||
      Number(this.draft.amount) <= 0
    ) {
      this.notify.error('Nhập khách hàng, khu vực và giá trị đơn hàng lớn hơn 0.');
      return;
    }
    this.act('drawer', 'Lưu');
  }
  readonly drawer = viewChild(SdSideDrawer);
  private readonly destroy = inject(DestroyRef);
  private readonly timers = new Set<ReturnType<typeof setTimeout>>();
  constructor() {
    this.destroy.onDestroy(() => {
      for (const timer of this.timers) clearTimeout(timer);
    });
  }
  openDrawer(mode: string): void {
    if (mode === 'table' || mode === 'selection') {
      this.tableMode.set(mode);
      this.picked.set([]);
      this.tableDrawer()?.open();
      return;
    }
    this.groupedDrawer.set(mode === 'grouped');
    this.draft = mode === 'create' ? { customer: '', region: '', amount: '' } : { ...this.record() };
    this.messages.update(value => ({ ...value, drawer: '' }));
    this.drawerMode.set(mode === 'grouped' ? 'detail' : mode);
    this.drawer()?.open();
  }
  closeDrawer(): void {
    if (!this.pending()['drawer']) void this.drawer()?.requestClose();
  }
  readonly beforeClose = () => !this.pending()['drawer'];
  act(scope: string, action: string): void {
    if (this.pending()[scope]) return;
    this.pending.update(value => ({ ...value, [scope]: true }));
    this.messages.update(value => ({ ...value, [scope]: 'Đang xử lý…' }));
    const timer = setTimeout(
      () => {
        this.timers.delete(timer);
        if (this.destroy.destroyed) return;
        if (scope === 'drawer' && action === 'Lưu') {
          this.record.set({ ...this.draft, customer: this.draft.customer.trim(), region: this.draft.region.trim() });
          this.drawerMode.set('detail');
        }
        if (action === 'Duyệt' || action === 'Từ chối')
          this.statuses.update(value => ({ ...value, [scope]: action === 'Duyệt' ? 'Đã duyệt' : 'Đã từ chối' }));
        this.messages.update(value => ({
          ...value,
          [scope]: action === 'Lưu' ? 'Đã lưu dữ liệu mẫu.' : 'Đã thực hiện “' + action + '” trên dữ liệu mẫu.',
        }));
        this.pending.update(value => ({ ...value, [scope]: false }));
      },
      1000 + Math.floor(Math.random() * 1001)
    );
    this.timers.add(timer);
  }
}
