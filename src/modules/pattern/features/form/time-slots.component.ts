import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SdTime } from '@sdcorejs/angular/forms/time';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdInform } from '@sdcorejs/angular/components/inform';
import { PatternDraft } from '../../data/pattern-draft';

@Component({
  selector: 'app-pattern-time-slots',
  imports: [SdTime, SdSection, SdButton, SdInform],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sd-section title="Khung giờ tiếp nhận">
      <div class="slots-content">
        <p class="text-secondary m-0">Chọn giờ bắt đầu và kết thúc cho từng khung trong ngày.</p>
        @if (message()) {
          <sd-inform [color]="saved() ? 'success' : 'warning'" [description]="message()" />
        }
        <div class="slots-grid">
          <strong>Giờ bắt đầu</strong><strong>Giờ kết thúc</strong><span></span>
          @for (row of rows(); track row.id) {
            <sd-time
              name="start"
              [form]="row.form"
              [model]="row.start"
              [ariaLabel]="'Giờ bắt đầu dòng ' + row.id"
              size="sm"
              hideInlineError
              required />
            <sd-time
              name="end"
              [form]="row.form"
              [model]="row.end"
              [ariaLabel]="'Giờ kết thúc dòng ' + row.id"
              size="sm"
              hideInlineError
              required />
            <sd-button
              prefixIcon="delete"
              type="text"
              color="error"
              size="sm"
              [tooltip]="'Xoá khung giờ ' + row.id"
              (click)="remove(row.id)" />
          }
        </div>
        <div><sd-button title="Thêm khung giờ" prefixIcon="add" type="light" color="primary" size="sm" (click)="add()" /></div>
        <div class="d-flex justify-content-end">
          <sd-button title="Lưu khung giờ" prefixIcon="save" type="fill" color="primary" (click)="save()" />
        </div>
      </div>
    </sd-section>
  `,
  styles: `
    :host {
      display: block;
      max-width: 760px;
      margin-inline: auto;
    }
    .slots-content {
      padding: 16px;
      display: grid;
      gap: 16px;
    }
    .slots-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 32px;
      align-items: center;
      gap: 12px;
    }
    .slots-grid strong {
      font-size: 13px;
    }
    sd-time {
      min-width: 0;
    }
    @media (max-width: 480px) {
      .slots-grid {
        gap: 8px;
      }
      .slots-content {
        padding: 12px;
      }
    }
  `,
})
export class TimeSlotsComponent {
  private nextId = 1;
  readonly rows = signal([this.row('08:00', '12:00'), this.row('13:00', '17:00')]);
  readonly message = signal('');
  readonly saved = signal(false);
  private baseline = this.snapshot();
  constructor() {
    const draft = inject(PatternDraft);
    const dirty = () => this.snapshot() !== this.baseline;
    draft.dirty = dirty;
    inject(DestroyRef).onDestroy(() => {
      if (draft.dirty === dirty) draft.dirty = () => false;
    });
  }
  private row(start = '', end = '') {
    return { id: this.nextId++, start, end, form: new FormGroup<Record<string, FormControl>>({}) };
  }
  private snapshot() {
    return JSON.stringify(
      this.rows().map(row => ({
        id: row.id,
        start: row.form.get('start') ? (row.form.get('start')!.value ?? '') : row.start,
        end: row.form.get('end') ? (row.form.get('end')!.value ?? '') : row.end,
      }))
    );
  }
  add() {
    this.rows.update(rows => [...rows, this.row()]);
    this.message.set('');
  }
  remove(id: number) {
    this.rows.update(rows => rows.filter(row => row.id !== id));
    this.message.set('');
  }
  save() {
    this.saved.set(false);
    const intervals: { start: string; end: string }[] = [];
    for (const row of this.rows()) {
      row.form.markAllAsTouched();
      const { start, end } = row.form.getRawValue();
      if (row.form.invalid || !start || !end || start >= end) {
        this.message.set('Điền đủ giờ hợp lệ; giờ kết thúc phải sau giờ bắt đầu trong cùng ngày.');
        return;
      }
      intervals.push({ start, end });
    }
    intervals.sort((a, b) => a.start.localeCompare(b.start));
    if (!intervals.length) {
      this.message.set('Thêm ít nhất một khung giờ.');
      return;
    }
    if (intervals.some((row, i) => i > 0 && row.start < intervals[i - 1].end)) {
      this.message.set('Các khung giờ không được chồng nhau.');
      return;
    }
    this.baseline = this.snapshot();
    this.saved.set(true);
    this.message.set('Đã lưu khung giờ trong phiên mẫu.');
  }
}
