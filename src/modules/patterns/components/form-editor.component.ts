import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdTextarea } from '@sdcorejs/angular/forms/textarea';
import { PatternDraft } from '../data/pattern-draft';
import { REGIONS } from '../data/pattern-query';
import { merge } from 'rxjs';
export interface ContactRecord {
  name: string;
  email: string;
  phone: string;
  region: string;
  note: string;
}
export const emptyContact = (): ContactRecord => ({ name: '', email: '', phone: '', region: REGIONS[0], note: '' });
export const sampleContact = (): ContactRecord => ({
  name: 'Nguyễn Minh Anh',
  email: 'minhanh@example.test',
  phone: '0900000000',
  region: REGIONS[0],
  note: 'Đầu mối phối hợp',
});
@Component({
  selector: 'app-pattern-form-editor',
  imports: [ReactiveFormsModule, SdButton, SdInput, SdSelect, SdTextarea],
  templateUrl: './form-editor.component.html',
  styleUrl: '../styles/patterns.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormEditorComponent implements OnInit {
  readonly layout = input('simple');
  readonly mode = input('create');
  readonly initial = input<ContactRecord>(emptyContact());
  readonly hideFooter = input(false);
  readonly saved = output<ContactRecord>();
  readonly cancelled = output<void>();
  readonly saving = signal(false);
  readonly message = signal('');
  readonly attempted = signal(false);
  readonly fail = signal(false);
  readonly revision = signal(0);
  private baseline = '';
  // Core fields register and validate their own controls on this group.
  readonly form = new FormGroup<Record<string, FormControl>>({});
  readonly orderName = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly lines = new FormArray<FormGroup<{ name: FormControl<string>; quantity: FormControl<number>; price: FormControl<number> }>>([]);
  readonly regions = REGIONS.map(name => ({ id: name, name }));
  readonly total = computed(() => {
    this.revision();
    return this.lines.getRawValue().reduce((sum, row) => sum + Number(row.quantity) * Number(row.price), 0);
  });
  readonly dirty = computed(() => {
    this.revision();
    return this.snapshot() !== this.baseline;
  });
  private readonly draft = inject(PatternDraft);
  private readonly destroy = inject(DestroyRef);
  ngOnInit(): void {
    if (this.layout() === 'lines') this.addLine();
    this.baseline = this.snapshot();
    this.revision.update(n => n + 1);
    const subscription = merge(this.form.valueChanges, this.lines.valueChanges, this.orderName.valueChanges).subscribe(() =>
      this.revision.update(n => n + 1)
    );
    const dirty = () => this.dirty(),
      saving = () => this.saving();
    this.draft.dirty = dirty;
    this.draft.saving = saving;
    this.destroy.onDestroy(() => {
      subscription.unsubscribe();
      if (this.draft.dirty === dirty) {
        this.draft.dirty = () => false;
        this.draft.saving = () => false;
      }
    });
  }
  private snapshot(): string {
    return JSON.stringify({ contact: this.readContact(), orderName: this.orderName.value, lines: this.lines.getRawValue() });
  }
  private readContact(): ContactRecord {
    const value = this.form.getRawValue();
    const initial = this.initial();
    const field = (key: keyof ContactRecord): string => (key in value ? (value[key] ?? '') : initial[key]);
    // Stable order/defaults also cover layouts that do not render every field.
    return {
      name: field('name'),
      email: field('email'),
      phone: field('phone'),
      region: field('region'),
      note: field('note'),
    };
  }
  addLine(): void {
    if (this.saving()) return;
    this.lines.push(
      new FormGroup({
        name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        quantity: new FormControl(1, {
          nonNullable: true,
          validators: [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
        }),
        price: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
      })
    );
    this.revision.update(n => n + 1);
  }
  removeLine(index: number): void {
    if (!this.saving()) {
      this.lines.removeAt(index);
      this.revision.update(n => n + 1);
    }
  }
  async save(): Promise<boolean> {
    if (this.saving()) return false;
    this.attempted.set(true);
    this.form.markAllAsTouched();
    this.orderName.markAsTouched();
    this.lines.markAllAsTouched();
    const invalid = this.layout() === 'lines' ? this.orderName.invalid || this.lines.invalid || !this.lines.length : this.form.invalid;
    if (invalid) {
      this.message.set('Kiểm tra các trường bắt buộc, email hợp lệ và dòng hàng.');
      return false;
    }
    this.saving.set(true);
    this.message.set('');
    const fail = this.fail();
    this.form.disable();
    this.orderName.disable();
    this.lines.disable();
    await new Promise(resolve => setTimeout(resolve, 450));
    if (this.destroy.destroyed) return false;
    this.form.enable();
    this.orderName.enable();
    this.lines.enable();
    this.saving.set(false);
    if (fail) {
      this.message.set('Không thể lưu. Nội dung đã nhập được giữ lại; hãy thử lại.');
      return false;
    }
    this.baseline = this.snapshot();
    this.revision.update(n => n + 1);
    this.message.set('Đã lưu dữ liệu mẫu trong phiên.');
    this.saved.emit(this.readContact());
    return true;
  }
  async cancel(): Promise<void> {
    if (await this.draft.canLeave()) {
      this.form.patchValue(this.initial());
      this.orderName.reset('');
      this.lines.clear();
      if (this.layout() === 'lines') this.addLine();
      this.baseline = this.snapshot();
      this.revision.update(n => n + 1);
      this.attempted.set(false);
      this.message.set('');
      this.cancelled.emit();
    }
  }
}
