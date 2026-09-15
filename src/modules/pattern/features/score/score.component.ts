import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { ScoreCard, ScorecardStripComponent } from '../../components/scorecard-strip.component';
import { seedOrders, STATUS_LABELS } from '../../data/pattern-query';
@Component({
  selector: 'app-pattern-score',
  imports: [ScorecardStripComponent],
  templateUrl: './score.component.html',
  styleUrl: '../../styles/pattern.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreComponent {
  readonly variant = input('metric');
  readonly selected = signal('');
  readonly rows = seedOrders();
  readonly labels = STATUS_LABELS;
  readonly interactive = computed(() => ['filter', 'icon-filter'].includes(this.variant()));
  readonly filtered = computed(() => this.rows.filter(r => !this.selected() || r.status === this.selected()));
  readonly iconLayout = computed(() =>
    this.variant() === 'icon-inline' || this.variant() === 'icon-filter'
      ? ('inline' as const)
      : this.variant().startsWith('icon-')
        ? ('tile' as const)
        : ('none' as const)
  );
  readonly cards = computed<ScoreCard[]>(() => {
    const v = this.variant();
    const status = Object.entries(STATUS_LABELS).map(([id, label]) => ({
      id,
      label,
      value: this.rows.filter(r => r.status === id).length,
      hint: 'Toàn bộ dữ liệu mẫu',
      icon: id === 'pending' ? 'schedule' : id === 'active' ? 'sync' : 'check_circle',
      tone: id,
    }));
    if (this.interactive())
      return [{ id: '', label: 'Tất cả đơn hàng', value: this.rows.length, hint: 'Chọn để lọc', icon: 'receipt_long' }, ...status];
    if (v === 'icon-status' || v === 'compact') return status;
    if (v === 'progress')
      return [{ id: 'progress', label: 'Tiến độ hoàn tất', value: '62%', hint: '31 / 50 yêu cầu đã hoàn tất', progress: 62 }];
    if (v === 'comparison')
      return [{ id: 'comparison', label: 'Đơn hàng tháng 9', value: 120, hint: 'Tháng 8: 100 đơn · Chênh lệch +20%' }];
    const total = this.rows.reduce((sum, r) => sum + r.amount, 0);
    const money = {
      id: 'amount',
      label: 'Giá trị đơn hàng',
      value: total / 1000000 + ' triệu ₫',
      hint: '24 đơn hàng · Toàn bộ dữ liệu mẫu',
      icon: 'payments',
    };
    if (v === 'metric') return [money];
    return [
      { id: 'orders', label: 'Tổng đơn hàng', value: 24, hint: 'Toàn bộ dữ liệu mẫu', icon: 'receipt_long' },
      { id: 'customers', label: 'Khách hàng', value: 8, hint: 'Khách hàng có đơn hàng', icon: 'groups' },
      money,
    ];
  });
}
