import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdTable, SdTableCellDefDirective } from '@sdcorejs/angular/components/table';
import { ENTITY_NOUNS } from '../components/record-header.component';
import { ListPatternBase } from '../features/list-standard/list-standard.component';

/** Danh sách dùng chung làm điểm vào cho các biến thể hồ sơ và biểu mẫu. */
@Component({
  selector: 'app-record-list',
  imports: [SdPageComponent, SdButton, SdTable, SdTableCellDefDirective],
  template: `<sd-page [title]="title()" [description]="exampleDescription">
    <sd-button headerRight title="Tạo mới" type="fill" color="primary" prefixIcon="add" (click)="create()" />
    <div class="list-content">
      <sd-table [autoId]="navigation.baseUrl" [option]="option()">
        <ng-template sdTableCellDef="code" let-row="item">
          <a [href]="navigation.href('detail', row.id)" (click)="navigation.openLink($event, row.id)">{{ row.code }}</a>
        </ng-template>
      </sd-table>
    </div>
  </sd-page>`,
  styleUrl: '../styles/list-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordListComponent extends ListPatternBase {
  readonly title = computed(() => 'Danh sách ' + ENTITY_NOUNS[this.store.kind]);
}
