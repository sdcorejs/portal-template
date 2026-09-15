import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DETAIL_IMPORTS, DetailPatternBase } from '../detail-overview/detail-overview.component';
@Component({
  selector: 'app-detail-tabbed',
  imports: DETAIL_IMPORTS,
  templateUrl: './detail-tabbed.component.html',
  styleUrl: './detail-tabbed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailTabbedComponent extends DetailPatternBase {}
