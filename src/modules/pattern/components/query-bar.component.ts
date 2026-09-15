import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { PatternQuery, REGIONS } from '../data/pattern-query';
@Component({
  selector: 'app-pattern-query',
  imports: [FormsModule, SdButton],
  templateUrl: './query-bar.component.html',
  styleUrl: '../styles/pattern.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryBarComponent {
  readonly query = input.required<PatternQuery>();
  readonly changed = output<PatternQuery>();
  readonly regions = REGIONS;
  change(patch: Partial<PatternQuery>): void {
    this.changed.emit({ ...this.query(), ...patch });
  }
  clear(): void {
    this.changed.emit({ search: '', status: '', region: '', sort: 'code' });
  }
}
