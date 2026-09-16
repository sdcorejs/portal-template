import { ChangeDetectionStrategy, Component, afterNextRender, computed, input, signal } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdInputNumber } from '@sdcorejs/angular/forms/input-number';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdTable, SdTableCellDefDirective, SdTableOption } from '@sdcorejs/angular/components/table';
import { LineItem } from '../data/models';
/** Core controls register into an empty row group; seed values stay separate from registration. */
export class LineItemGroup extends FormGroup {
  constructor(readonly seed: LineItem) {
    super({});
  }
}
@Component({
  selector: 'app-line-item-editor',
  imports: [SdInput, SdInputNumber, SdButton, SdSection, CurrencyPipe, SdTable, SdTableCellDefDirective],
  templateUrl: './line-item-editor.component.html',
  styleUrl: './line-item-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemEditorComponent {
  readonly Math = Math;
  constructor() {
    afterNextRender(() => this.update());
  }

  readonly lines = input.required<FormArray<LineItemGroup>>();
  readonly revision = signal(0);
  readonly rows = computed(() => {
    this.revision();
    return this.lines().controls.map(form => ({ ...form.seed, form, action: '' }));
  });
  readonly option = computed<SdTableOption<LineItem & { form: LineItemGroup; action: string }>>(() => {
    const rows = this.rows();
    return {
      type: 'local',
      items: () => rows,
      rowKey: 'id',
      columns: [
        { field: 'name', title: 'Sản phẩm / dịch vụ', type: 'string', width: '40%' },
        { field: 'quantity', title: 'Số lượng', type: 'number', width: '180px' },
        { field: 'unitPrice', title: 'Đơn giá (VND)', type: 'number', width: '220px' },
        { field: 'action', title: '', type: 'string', width: '64px' },
      ],
      paginate: { hidden: true, pageSize: Math.max(rows.length, 1) },
      filter: { disabled: true },
      sort: { enable: false },
      config: { visible: false },
    };
  });
  removeRow(row: LineItemGroup) {
    this.remove(this.lines().controls.indexOf(row));
  }
  readonly total = signal(0);
  change(row: LineItemGroup, field: string, value: unknown) {
    Object.assign(row.seed, { [field]: value });
    this.update();
  }
  update() {
    this.total.set(
      this.lines().controls.reduce((sum, row) => {
        const v = { ...row.seed, ...row.getRawValue() };
        return sum + Number(v.quantity || 0) * Number(v.unitPrice || 0);
      }, 0)
    );
  }
  add() {
    this.lines().markAsDirty();
    this.lines().push(new LineItemGroup({ id: 'line-' + Date.now(), name: '', quantity: 1, unitPrice: 0 }));
    this.revision.update(x => x + 1);
    this.update();
  }
  remove(index: number) {
    this.lines().markAsDirty();
    this.lines().removeAt(index);
    this.revision.update(x => x + 1);
    this.update();
  }
}
