import { ChangeDetectionStrategy, Component, Directive, DestroyRef, computed, inject, input, output, signal } from '@angular/core';
import { PageNavigation } from '../../reference/page-navigation';
import { RecordHeaderComponent } from '../../components/record-header.component';
import { FormArray, FormGroup } from '@angular/forms';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdDataState } from '@sdcorejs/angular/components/data-state';
import { SdUnsavedChangesService } from '@sdcorejs/angular/services/unsaved-changes';
import { DemoSessionStore } from '../../data/demo-session.store';
import { DemoEntity, SaveEntity } from '../../data/models';
import { EntityFormSectionsComponent } from '../../components/entity-form-sections.component';
import { LineItemEditorComponent, LineItemGroup } from '../../components/line-item-editor.component';
@Directive()
export abstract class FormPatternBase {
  readonly store = inject(DemoSessionStore);
  readonly unsaved = inject(SdUnsavedChangesService);
  readonly done = output<void>();
  readonly embedded = input(false);
  readonly inDrawer = input(false);
  readonly navigation = inject(PageNavigation);
  readonly current = this.store.mode() !== 'create' ? this.store.records().find(x => x.id === this.store.selectedId()) : undefined;
  readonly currentId = signal(this.current?.id);
  get editing() {
    return this.currentId() !== undefined;
  }
  readonly saved = signal(false);
  readonly stale = this.store.mode() !== 'create' && !this.current;
  readonly seed: DemoEntity = this.current
    ? structuredClone(this.current)
    : {
        id: '',
        kind: this.store.kind,
        code: '',
        name: '',
        status: 'active',
        group: 'north',
        email: '',
        description: '',
        amount: 0,
        updatedAt: '',
        lines: this.store.kind === 'order' ? [{ id: 'line-1', name: '', quantity: 1, unitPrice: 0 }] : [],
      };
  readonly lineForms = new FormArray(this.seed.lines.map(x => new LineItemGroup(x)));
  readonly form = new FormGroup({ lines: this.lineForms });
  readonly error = signal('');
  readonly title = computed(() => (this.editing ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ'));
  constructor() {
    const destroy = inject(DestroyRef);
    const sub = this.form.valueChanges.subscribe(() => {
      if (this.form.dirty) {
        this.store.dirty.set(true);
        this.saved.set(false);
      }
    });
    const registration = this.unsaved.register({
      id: 'entity-form',
      scope: this.store,
      isDirty: this.store.dirty,
      save: () => this.save(false),
      discard: () => {
        this.store.dirty.set(false);
        return true;
      },
    });
    destroy.onDestroy(() => {
      sub.unsubscribe();
      registration.destroy();
      this.store.dirty.set(false);
    });
  }
  async save(emitDone = true): Promise<boolean> {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      const labels: Record<string, string> = {
        code: 'Mã hồ sơ',
        name: 'Tên hồ sơ',
        status: 'Trạng thái',
        lines: 'Dòng hàng',
        email: 'Email liên hệ',
        amount: 'Giá trị',
      };
      const fields = Object.entries(this.form.controls)
        .filter(([, control]) => control.invalid)
        .map(([name]) => labels[name] ?? name);
      this.error.set('Kiểm tra thông tin: ' + fields.join(', ') + '.');
      return false;
    }
    const fields = this.form.getRawValue();
    const lines = this.lineForms.controls.map(row => ({ ...row.seed, ...row.getRawValue() }));
    const value: SaveEntity = {
      ...this.seed,
      ...fields,
      lines,
      amount:
        this.store.kind === 'order'
          ? lines.reduce((n, x) => n + x.quantity * x.unitPrice, 0)
          : Number((fields as Partial<SaveEntity>).amount ?? this.seed.amount),
    };
    try {
      const saved = await this.store.save(value, this.currentId());
      this.currentId.set(saved.id);
      this.saved.set(true);
      this.form.markAsPristine();
      this.error.set('');
      if (emitDone) await this.navigation.go('detail', saved.id);
      return true;
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Không thể lưu. Vui lòng thử lại.');
      return false;
    }
  }
  async cancel() {
    if (await this.unsaved.confirmLeave({ scope: this.store, reason: 'close' })) {
      await this.navigation.backFromForm();
    }
  }
}
export const FORM_IMPORTS = [
  RecordHeaderComponent,
  SdPageComponent,
  SdButton,
  SdDataState,
  EntityFormSectionsComponent,
  LineItemEditorComponent,
];
@Component({
  selector: 'app-form-simple',
  imports: FORM_IMPORTS,
  templateUrl: './form-simple.component.html',
  styleUrl: './form-simple.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSimpleComponent extends FormPatternBase {}
