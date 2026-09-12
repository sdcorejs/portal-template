import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LIST_IMPORTS, ListPatternBase } from '../list-standard/list-standard.component';
@Component({
  selector: 'app-list-advanced-filter',
  imports: LIST_IMPORTS,
  templateUrl: './list-advanced-filter.component.html',
  styleUrl: './list-advanced-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListAdvancedFilterComponent extends ListPatternBase {}
