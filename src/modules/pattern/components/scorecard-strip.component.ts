import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { SdCard, SdCardGroup } from '@sdcorejs/angular/components/card';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdIcon } from '@sdcorejs/angular/modules/icon';
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
  imports: [SdCard, SdCardGroup, SdSection, SdIcon, NgTemplateOutlet],
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
  iconColor(card: ScoreCard): string {
    if (card.tone === 'pending') return 'warning';
    if (card.tone === 'done') return 'success';
    if (card.id === 'customers') return 'success';
    if (card.id === 'amount') return 'warning';
    return 'info';
  }
  choose(value: string | string[] | null): void {
    this.selection.emit(typeof value === 'string' ? value : '');
  }
}
