import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LIST_IMPORTS, ListPatternBase } from '../list-standard/list-standard.component';
@Component({
  selector: 'app-list-master-detail',
  imports: LIST_IMPORTS,
  templateUrl: './list-master-detail.component.html',
  styleUrl: './list-master-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListMasterDetailComponent extends ListPatternBase {}
