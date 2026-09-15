import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdDataState } from '@sdcorejs/angular/components/data-state';
import { ResultsTableComponent } from '../../components/results-table.component';

import { OrderDetailComponent } from '../../components/order-detail.component';
import { PatternStore } from '../../data/pattern-store';

@Component({
  selector: 'app-pattern-table',
  imports: [FormsModule, SdButton, SdDataState, ResultsTableComponent, OrderDetailComponent],
  providers: [PatternStore],
  templateUrl: './table.component.html',
  styleUrls: ['../../styles/pattern.scss', './table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  readonly variant = input('standard');
  readonly store = inject(PatternStore);
  readonly expanded = signal(true);
  readonly state = signal<'loading' | 'empty' | 'error' | 'no-results'>('loading');
  readonly coreState = computed(() => {
    const state = this.state();
    return state === 'no-results' ? 'empty' : state;
  });
}
