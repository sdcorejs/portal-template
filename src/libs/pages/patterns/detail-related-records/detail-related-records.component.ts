import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DETAIL_IMPORTS, DetailPatternBase } from '../detail-overview/detail-overview.component';
@Component({
  selector: 'app-detail-related-records',
  imports: DETAIL_IMPORTS,
  templateUrl: './detail-related-records.component.html',
  styleUrl: './detail-related-records.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailRelatedRecordsComponent extends DetailPatternBase {}
