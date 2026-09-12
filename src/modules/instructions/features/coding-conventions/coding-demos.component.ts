import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdInput } from '@sdcorejs/angular/forms/input';
@Component({
  selector: 'app-typescript-demo',
  template: `<div class="controls">
      <label><input type="checkbox" [checked]="fail()" [disabled]="pending()" (change)="fail.set(!fail())" />Giả lập lưu lỗi</label
      ><button type="button" [disabled]="pending()" class="primary" (click)="save()">
        {{ pending() ? 'Đang lưu…' : 'Lưu khách hàng' }}
      </button>
    </div>
    <pre>
isSaving = {{ pending() }}
error = {{ error() || 'null' }}</pre>
    <p role="status" class="status" [class.error]="!!error()">{{ message() }}</p>`,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeScriptDemoComponent {
  readonly fail = signal(false);
  readonly pending = signal(false);
  readonly error = signal('');
  readonly message = signal('Sẵn sàng lưu.');
  private timer: ReturnType<typeof setTimeout> | undefined;
  private destroyed = false;
  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      clearTimeout(this.timer);
    });
  }
  async save(): Promise<void> {
    if (this.pending()) return;
    const fail = this.fail();
    this.pending.set(true);
    this.error.set('');
    this.message.set('Đang lưu…');
    try {
      await new Promise<void>((resolve, reject) => {
        this.timer = setTimeout(
          () => (fail ? reject(new Error('Không thể lưu. Vui lòng thử lại.')) : resolve()),
          1000 + Math.floor(Math.random() * 1001)
        );
      });
      if (!this.destroyed) this.message.set('Đã lưu khách hàng.');
    } catch (error) {
      if (!this.destroyed) {
        this.error.set(error instanceof Error ? error.message : 'Lỗi không xác định');
        this.message.set(this.error());
      }
    } finally {
      if (!this.destroyed) this.pending.set(false);
    }
  }
}
@Component({
  selector: 'app-spacing-demo',
  imports: [SdSection, SdInput],
  template: `<div class="controls">
      <button type="button" [attr.aria-pressed]="!view()" (click)="view.set(false)">Nhập liệu</button
      ><button type="button" [attr.aria-pressed]="view()" (click)="view.set(true)">Xem chi tiết</button
      ><span class="badge">padding 20 · gap {{ view() ? 16 : 8 }}</span>
    </div>
    <sd-section title="Thông tin công ty" icon="business">
      <div class="spacing-body" [class.view]="view()" data-testid="spacing-body">
        @if (view()) {
          <div>
            <span>Tên công ty</span><strong>{{ name() || '—' }}</strong>
          </div>
          <div>
            <span>Email liên hệ</span><strong>{{ email() || '—' }}</strong>
          </div>
          <div><span>Trạng thái</span><strong>Đang hoạt động</strong></div>
        } @else {
          <sd-input #nameControl label="Tên công ty" [(model)]="name" required />
          <sd-input label="Email liên hệ" [(model)]="email" />
          <button type="button" (click)="validate()">Kiểm tra dữ liệu</button>
          @if (submitted() && name().trim()) {
            <p role="status">Dữ liệu hợp lệ.</p>
          }
        }
      </div>
    </sd-section>`,
  styleUrls: ['../../components/instruction-example/demo.scss'],
  styles: [
    `
      .spacing-body {
        display: flex;
        flex-direction: column;
        padding: 20px;
        gap: 8px;
      }
      .spacing-body.view {
        gap: 16px;
      }
      .view strong {
        display: block;
        margin-top: 4px;
      }
      .view span {
        color: #617186;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpacingDemoComponent {
  readonly nameControl = viewChild<SdInput>('nameControl');
  validate(): void {
    this.submitted.set(true);
    this.nameControl()?.formControl.markAsTouched();
  }
  readonly view = signal(false);
  readonly name = signal('Công ty Minh An');
  readonly email = signal('contact@minhan.example');
  readonly submitted = signal(false);
}
@Component({
  selector: 'app-quality-demo',
  template: `<div class="controls">
      <button type="button" [attr.aria-pressed]="!after()" (click)="after.set(false)">Markup trước</button
      ><button type="button" [attr.aria-pressed]="after()" (click)="after.set(true)">Markup sau</button>
    </div>
    <pre>{{ after() ? good : bad }}</pre>
    <div class="card">
      <h3>Ví dụ đã cải thiện · thử bằng bàn phím</h3>
      <table>
        <caption>
          Khách hàng được chọn
        </caption>
        <thead>
          <tr>
            <th scope="col">Mã</th>
            <th scope="col">Công ty</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CUS-001</td>
            <td>Công ty Minh An</td>
          </tr>
        </tbody>
      </table>
      <button type="button" class="primary" (click)="message.set('Đã xác nhận khách hàng CUS-001')">Xác nhận chọn</button>
      <p role="status" aria-live="polite">{{ message() }}</p>
    </div>`,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QualityDemoComponent {
  readonly after = signal(true);
  readonly message = signal('Chưa xác nhận.');
  readonly bad = '<div (click)="select()">Chọn</div>\n<table><tr><td>Mã</td></tr></table>\n<!-- Thiếu keyboard semantics và headers -->';
  readonly good =
    '<button type="button" (click)="select()">Chọn</button>\n<table><caption>Khách hàng</caption>\n  <thead><tr><th scope="col">Mã</th></tr></thead>\n</table>\n<p role="status" aria-live="polite">{{ message() }}</p>';
}
