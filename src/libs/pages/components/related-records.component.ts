import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SdTable, SdTableOption } from '@sdcorejs/angular/components/table';
import { SdSection } from '@sdcorejs/angular/components/section';
import { LineItem } from '../data/models';
@Component({
  selector: 'app-related-records',
  imports: [SdTable, SdSection],
  templateUrl: './related-records.component.html',
  styleUrl: './related-records.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatedRecordsComponent {
  readonly lines = input.required<LineItem[]>();
  readonly option = computed<SdTableOption<LineItem>>(() => {
    const rows = this.lines();
    return {
      type: 'local',
      rowKey: 'id',
      items: () => rows,
      columns: [
        { field: 'name', title: 'Sản phẩm / dịch vụ', type: 'string' },
        { field: 'quantity', title: 'Số lượng', type: 'number', align: 'right' },
        { field: 'unitPrice', title: 'Đơn giá (VND)', type: 'number', align: 'right' },
      ],
      paginate: { pageSize: 10 },
      filter: { hideInlineFilter: true, hideExternalFilterToolbar: true },
    };
  });
}
