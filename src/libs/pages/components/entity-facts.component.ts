import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { SdView } from '@sdcorejs/angular/components/view';
import { SdSection } from '@sdcorejs/angular/components/section';
import { GROUP_OPTIONS, DemoEntity } from '../data/models';
@Component({
  selector: 'app-entity-facts',
  imports: [SdView, SdSection, DatePipe, CurrencyPipe],
  templateUrl: './entity-facts.component.html',
  styleUrl: './entity-facts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityFactsComponent {
  readonly entity = input.required<DemoEntity>();
  readonly group = computed(() => GROUP_OPTIONS.find(x => x.id === this.entity().group)?.name ?? this.entity().group);
}
