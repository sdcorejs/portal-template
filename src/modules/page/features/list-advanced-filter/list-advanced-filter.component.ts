import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LIST_IMPORTS, ListPatternBase } from '../list-standard/list-standard.component';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdIcon } from '@sdcorejs/angular/modules/icon';
@Component({
  selector: 'app-list-advanced-filter',
  imports: [...LIST_IMPORTS, SdSection, SdIcon],
  templateUrl: './list-advanced-filter.component.html',
  styleUrl: './list-advanced-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListAdvancedFilterComponent extends ListPatternBase {}
