import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
export interface ScoreCard {
  id: string;
  label: string;
  value: string | number;
  hint: string;
  icon?: string;
  tone?: string;
  progress?: number;
}
@Component({
  selector: 'app-pattern-scorecards',
  imports: [MatIconModule],
  templateUrl: './scorecard-strip.component.html',
  styleUrl: './scorecard-strip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScorecardStripComponent {
  readonly cards = input.required<ScoreCard[]>();
  readonly selected = input('');
  readonly interactive = input(false);
  readonly iconLayout = input<'none' | 'inline' | 'tile'>('none');
  readonly compact = input(false);
  readonly selection = output<string>();
  choose(id: string): void {
    this.selection.emit(this.selected() === id ? '' : id);
  }
}
