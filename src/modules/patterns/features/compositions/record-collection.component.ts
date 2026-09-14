import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { PatternOrder, OrderStatus, STATUS_LABELS } from '../../data/pattern-query';
@Component({
  selector: 'app-pattern-collection',
  imports: [SdButton],
  templateUrl: './record-collection.component.html',
  styleUrl: '../../styles/patterns.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordCollectionComponent {
  readonly rows = input.required<PatternOrder[]>();
  readonly layout = input('cards');
  readonly pending = input<number[]>([]);
  readonly openRecord = output<PatternOrder>();
  readonly transition = output<{ id: number; status: OrderStatus }>();
  readonly labels = STATUS_LABELS;
  readonly statuses = Object.keys(STATUS_LABELS) as OrderStatus[];
  inStatus(status: OrderStatus): PatternOrder[] {
    return this.rows().filter(r => r.status === status);
  }
}
