import { ChangeDetectionStrategy, Component, afterNextRender, computed, input, signal } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdInputNumber } from '@sdcorejs/angular/forms/input-number';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdSection } from '@sdcorejs/angular/components/section';
import { LineItem } from '../data/models';
/** Core controls register into an empty row group; seed values stay separate from registration. */
export class LineItemGroup extends FormGroup {
  constructor(readonly seed: LineItem) {
    super({});
  }
}
@Component({
  selector: 'app-line-item-editor',
  imports: [SdInput, SdInputNumber, SdButton, SdSection, CurrencyPipe],
  templateUrl: './line-item-editor.component.html',
  styleUrl: './line-item-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemEditorComponent {
  constructor() {
    afterNextRender(() => this.update());
  }

  readonly lines = input.required<FormArray<LineItemGroup>>();
  readonly revision = signal(0);
  readonly rows = computed(() => {
    this.revision();
    return [...this.lines().controls];
  });
  readonly total = signal(0);
  update() {
    this.revision.update(x => x + 1);
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
    this.update();
  }
  remove(index: number) {
    this.lines().markAsDirty();
    this.lines().removeAt(index);
    this.update();
  }
}
