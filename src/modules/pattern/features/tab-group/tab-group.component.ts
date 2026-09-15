import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { SdTab, SdTabGroup } from '@sdcorejs/angular/components/tab';
import { SdSection, SdSectionItem } from '@sdcorejs/angular/components/section';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdDataState } from '@sdcorejs/angular/components/data-state';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdNotifyService } from '@sdcorejs/angular/services/notify';
import { ResultsTableComponent } from '../../components/results-table.component';
import { seedOrders } from '../../data/pattern-query';

@Component({
  selector: 'app-pattern-tab-group',
  imports: [SdTab, SdTabGroup, SdSection, SdSectionItem, SdButton, SdDataState, SdInput, ResultsTableComponent],
  templateUrl: './tab-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' },
})
export class TabGroupComponent {
  tabIcon(label: string): string {
    if (label.startsWith('CUS-')) return 'business';
    return (
      (
        {
          'Thông tin chung': 'info',
          'Tổng quan': 'dashboard',
          'Thông tin liên hệ': 'contacts',
          'Liên hệ': 'mail',
          'Đơn hàng': 'receipt_long',
          'Lịch sử': 'history',
          'Hợp đồng': 'description',
          'Địa chỉ giao hàng': 'location_on',
          'Công nợ': 'account_balance',
          'Thanh toán': 'payments',
          'Tài liệu': 'folder',
          'Cấu hình': 'settings',
          'Tất cả': 'list_alt',
          'Chờ xử lý': 'schedule',
          'Hoàn tất': 'check_circle',
          Bảng: 'table_chart',
          Thẻ: 'view_module',
        } as Record<string, string>
      )[label] ?? 'info'
    );
  }
  readonly variant = input('basic');
  readonly notify = inject(SdNotifyService);
  readonly selected = signal(0);
  readonly rows = signal(seedOrders());
  readonly shape = signal<'line' | 'pills' | 'segmented'>('line');
  readonly loading = signal(false);
  readonly state = signal<'ready' | 'empty' | 'error'>('ready');
  readonly available = signal(false);
  readonly records = signal(['CUS-001', 'CUS-002', 'CUS-003']);
  readonly names: Record<string, string> = { 'CUS-001': 'Công ty An Phát', 'CUS-002': 'Công ty Minh Long', 'CUS-003': 'Công ty Bình Minh' };
  readonly recordDrafts: Record<string, string> = { ...this.names };
  name = 'Công ty An Phát';
  email = 'contact@anphat.example';
  readonly labels = computed(() => {
    switch (this.variant()) {
      case 'many':
        return [
          'Tổng quan',
          'Thông tin liên hệ',
          'Đơn hàng',
          'Hợp đồng',
          'Địa chỉ giao hàng',
          'Công nợ',
          'Thanh toán',
          'Tài liệu',
          'Lịch sử',
          'Cấu hình',
        ];
      case 'counts':
        return ['Tất cả', 'Chờ xử lý', 'Hoàn tất'];
      case 'views':
        return ['Bảng', 'Thẻ'];
      case 'form':
        return ['Thông tin chung', 'Liên hệ'];
      case 'disabled':
        return ['Thông tin chung', 'Hợp đồng'];
      case 'closable':
        return this.records();
      default:
        return ['Thông tin chung', 'Đơn hàng', 'Lịch sử'];
    }
  });
  readonly filtered = computed(() =>
    this.rows().filter(r => this.selected() === 0 || r.status === (this.selected() === 1 ? 'pending' : 'done'))
  );
  count(index: number): number {
    return this.rows().filter(r => index === 0 || r.status === (index === 1 ? 'pending' : 'done')).length;
  }
  complete(): void {
    const first = this.rows().find(r => r.status === 'pending');
    if (first) this.rows.update(rows => rows.map(r => (r.id === first.id ? { ...r, status: 'done' } : r)));
  }
  async load(): Promise<void> {
    if (this.loading()) return;
    this.loading.set(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    this.loading.set(false);
  }
  change(index: number): void {
    this.selected.set(index);
    if (this.variant() === 'loading') void this.load();
  }
  async save(): Promise<void> {
    if (!(this.name ?? '').trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email ?? '')) {
      this.selected.set(!(this.name ?? '').trim() ? 0 : 1);
      this.notify.error('Nhập tên khách hàng và email hợp lệ.');
      return;
    }
    await this.load();
    this.notify.success('Đã lưu thông tin khách hàng.');
  }
  beforeClose(code: string): () => boolean {
    return () => this.recordDrafts[code] === this.names[code] || window.confirm('Thông tin chưa lưu. Đóng tab này?');
  }
  close(code: string): void {
    this.recordDrafts[code] = this.names[code];
    this.records.update(rows => rows.filter(r => r !== code));
    this.selected.set(0);
  }
  reopen(): void {
    this.records.set(['CUS-001', 'CUS-002', 'CUS-003']);
  }
}
