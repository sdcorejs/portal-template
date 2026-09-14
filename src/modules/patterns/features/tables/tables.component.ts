import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdDataState } from '@sdcorejs/angular/components/data-state';
import { ResultsTableComponent } from '../../components/results-table.component';
import { QueryBarComponent } from '../../components/query-bar.component';
import { OrderDetailComponent } from '../../components/order-detail.component';
import { PatternStore } from '../../data/pattern-store';
import { EMPTY_QUERY, PatternQuery, queryOrders } from '../../data/pattern-query';
@Component({
  selector: 'app-pattern-tables',
  imports: [FormsModule, SdButton, SdDataState, ResultsTableComponent, QueryBarComponent, OrderDetailComponent],
  providers: [PatternStore],
  templateUrl: './tables.component.html',
  styleUrl: '../../styles/patterns.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesComponent {
  readonly variant = input('standard');
  readonly store = inject(PatternStore);
  readonly query = signal<PatternQuery>({ ...EMPTY_QUERY });
  readonly rows = computed(() => queryOrders(this.store.records(), this.query()));
  readonly expanded = signal(true);
  readonly state = signal<'loading' | 'empty' | 'error' | 'no-results'>('loading');
  readonly coreState = computed(() => {
    const state = this.state();
    return state === 'no-results' ? 'empty' : state;
  });
}
