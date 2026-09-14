import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdDataState } from '@sdcorejs/angular/components/data-state';
import { ScoreCard, ScorecardStripComponent } from '../../components/scorecard-strip.component';
import { QueryBarComponent } from '../../components/query-bar.component';
import { ResultsTableComponent } from '../../components/results-table.component';
import { OrderDetailComponent } from '../../components/order-detail.component';
import { RecordCollectionComponent } from './record-collection.component';
import { PatternStore } from '../../data/pattern-store';
import { EMPTY_QUERY, PatternQuery, STATUS_LABELS, queryOrders } from '../../data/pattern-query';
@Component({
  selector: 'app-pattern-compositions',
  imports: [
    FormsModule,
    SdButton,
    SdDataState,
    ScorecardStripComponent,
    QueryBarComponent,
    ResultsTableComponent,
    OrderDetailComponent,
    RecordCollectionComponent,
  ],
  providers: [PatternStore],
  templateUrl: './compositions.component.html',
  styleUrl: '../../styles/patterns.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompositionsComponent implements OnInit {
  readonly variant = input('listing');
  readonly store = inject(PatternStore);
  readonly view = signal('listing');
  readonly query = signal<PatternQuery>({ ...EMPTY_QUERY });
  readonly page = signal(0);
  readonly pageSize = signal(6);
  readonly state = signal('data');
  readonly labels = STATUS_LABELS;
  readonly statuses = Object.keys(STATUS_LABELS);
  private readonly route = inject(ActivatedRoute);
  readonly records = computed(() => (this.state() === 'empty' ? [] : this.store.records()));
  readonly rows = computed(() => queryOrders(this.records(), this.query()));
  readonly paged = computed(() => this.rows().slice(this.page() * this.pageSize(), (this.page() + 1) * this.pageSize()));
  readonly cards = computed<ScoreCard[]>(() => [
    { id: '', label: 'Tất cả đơn hàng', value: this.records().length, hint: 'Toàn bộ dữ liệu mẫu', icon: 'receipt_long' },
    ...Object.entries(STATUS_LABELS).map(([id, label]) => ({
      id,
      label,
      value: this.records().filter(r => r.status === id).length,
      hint: 'Chọn để lọc',
      icon: id === 'pending' ? 'schedule' : id === 'active' ? 'sync' : 'check_circle',
      tone: id,
    })),
  ]);
  readonly metrics = computed<ScoreCard[]>(() => {
    const rows = this.records(),
      done = rows.filter(r => r.status === 'done').length;
    return [
      {
        id: 'amount',
        label: 'Tổng giá trị',
        value: rows.reduce((s, r) => s + r.amount, 0) / 1000000 + ' triệu ₫',
        hint: 'Toàn bộ đơn hàng mẫu',
        icon: 'payments',
      },
      {
        id: 'progress',
        label: 'Tỷ lệ hoàn tất',
        value: (rows.length ? Math.round((done / rows.length) * 100) : 0) + '%',
        hint: done + ' / ' + rows.length + ' đơn hàng',
        icon: 'check_circle',
        progress: rows.length ? (done / rows.length) * 100 : 0,
      },
    ];
  });
  readonly attention = computed(() =>
    this.records()
      .filter(r => r.status === 'pending')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4)
  );
  ngOnInit(): void {
    this.view.set(this.variant());
    const status = this.route.snapshot.queryParamMap.get('status');
    if (status && this.statuses.includes(status)) this.change({ ...EMPTY_QUERY, status });
  }
  change(query: PatternQuery): void {
    this.query.set(query);
    this.page.set(0);
  }
  select(status: string): void {
    this.change({ ...this.query(), status });
  }
  drill(status: string): void {
    this.change({ ...EMPTY_QUERY, status });
    this.view.set('listing');
  }
  setView(view: string): void {
    this.view.set(view);
    this.page.set(0);
  }
  count(status: string): number {
    return this.records().filter(r => r.status === status).length;
  }
}
