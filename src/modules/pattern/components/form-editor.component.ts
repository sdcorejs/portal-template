import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdInform } from '@sdcorejs/angular/components/inform';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdTextarea } from '@sdcorejs/angular/forms/textarea';
import { PatternDraft } from '../data/pattern-draft';
import { SdNotifyService } from '@sdcorejs/angular/services/notify';
import { REGIONS } from '../data/pattern-query';

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
  imports: [ReactiveFormsModule, SdButton, SdSection, SdInform, SdInput, SdSelect, SdTextarea],
  templateUrl: './form-editor.component.html',
  styleUrl: '../styles/pattern.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormEditorComponent implements OnInit {
  readonly layout = input('simple');
  readonly mode = input('create');
  readonly initial = input<ContactRecord>(emptyContact());
  readonly hideFooter = input(false);
  readonly errorPresentation = input<'notify' | 'inform'>('notify');
  readonly saved = output<ContactRecord>();
  readonly cancelled = output<void>();
  readonly saving = signal(false);
  readonly message = signal('');
  readonly attempted = signal(false);
  readonly errorMessage = signal('');
  readonly errorColor = signal<'warning' | 'error'>('warning');
  readonly sectionWarnings = computed(() => {
    this.revision();
    return {
      identity: this.attempted() && !!this.form.get('name')?.invalid,
      communication: this.attempted() && !!this.form.get('email')?.invalid,
    };
  });
  readonly revision = signal(0);
  private baseline = '';
  // Core fields register and validate their own controls on this group.
  readonly form = new FormGroup<Record<string, FormControl>>({});
  readonly regions = REGIONS.map(name => ({ id: name, name }));
  readonly dirty = computed(() => {
    this.revision();
    return this.snapshot() !== this.baseline;
  });
  private readonly draft = inject(PatternDraft);
  private readonly notify = inject(SdNotifyService);
  private readonly destroy = inject(DestroyRef);
  ngOnInit(): void {
    this.baseline = this.snapshot();
    this.revision.update(n => n + 1);
    const subscription = this.form.valueChanges.subscribe(() => this.revision.update(n => n + 1));
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
    return JSON.stringify(this.readContact());
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
  async save(): Promise<boolean> {
    if (this.saving()) return false;
    this.message.set('');
    this.errorMessage.set('');
    this.attempted.set(true);
    this.form.markAllAsTouched();
    const invalid = this.form.invalid;
    if (invalid) {
      const message = 'Kiểm tra họ và tên, email hợp lệ trước khi lưu.';
      this.errorColor.set('warning');
      if (this.errorPresentation() === 'inform') {
        if (this.layout() !== 'section-errors') this.errorMessage.set(message);
      } else this.notify.warning(message);
      return false;
    }
    this.saving.set(true);
    this.message.set('');
    this.form.disable();
    await new Promise(resolve => setTimeout(resolve, 450));
    if (this.destroy.destroyed) return false;
    this.form.enable();
    this.saving.set(false);
    // Phản hồi BE mẫu: email của liên hệ có sẵn bị trùng khi tạo mới.
    if (this.mode() === 'create' && this.readContact().email.trim().toLowerCase() === sampleContact().email) {
      const message = 'Email đã được sử dụng bởi một liên hệ khác. Vui lòng nhập email khác.';
      this.errorColor.set('error');
      if (this.errorPresentation() === 'inform') this.errorMessage.set(message);
      else this.notify.error(message);
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
      this.baseline = this.snapshot();
      this.revision.update(n => n + 1);
      this.attempted.set(false);
      this.errorMessage.set('');
      this.message.set('');
      this.cancelled.emit();
    }
  }
}
