import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal, Type } from '@angular/core';

@Component({
  selector: 'app-instruction-example',
  imports: [NgComponentOutlet],
  template: `
    <div class="toolbar">
      <div role="group" aria-label="Nội dung ví dụ">
        <button type="button" [attr.aria-pressed]="tab() === 'preview'" (click)="tab.set('preview')">Ví dụ tương tác</button>
        <button type="button" [attr.aria-pressed]="tab() === 'code'" (click)="tab.set('code')">Code minh họa</button>
      </div>
      <button type="button" (click)="reset()">Reset ví dụ</button>
    </div>
    <p>{{ exercise() }}</p>
    <div [hidden]="tab() !== 'preview'" class="preview" data-testid="instruction-demo">
      @for (key of generation(); track key) {
        <ng-container *ngComponentOutlet="demo()" />
      }
    </div>
    @if (tab() === 'code') {
      <button type="button" (click)="copy()">Sao chép code</button>
      <pre tabindex="0" aria-label="Code minh họa"><code>{{ code() }}</code></pre>
      <span role="status">{{ copyStatus() }}</span>
    }
    <p class="expected"><strong>Kết quả mong đợi:</strong> {{ expected() }}</p>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }
      .toolbar {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
      }
      button {
        border: 1px solid #d9e2ee;
        border-radius: 6px;
        background: white;
        padding: 8px 12px;
        color: #174d89;
        cursor: pointer;
      }
      button[aria-pressed='true'] {
        background: #eaf2ff;
        border-color: #005cca;
      }
      button:focus-visible {
        outline: 3px solid #005cca;
        outline-offset: 2px;
      }
      p {
        line-height: 1.6;
        margin: 14px 0;
      }
      .preview {
        border: 1px solid #dfe7f0;
        border-radius: 8px;
        padding: 20px;
        background: #f8fafc;
      }
      pre {
        max-width: 100%;
        overflow: auto;
        padding: 16px;
        background: #f1f5fa;
        line-height: 1.7;
        border-radius: 6px;
      }
      .expected {
        border-left: 3px solid #168264;
        padding-left: 12px;
      }
      @media (max-width: 600px) {
        .preview {
          padding: 12px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructionExampleComponent {
  readonly demo = input.required<Type<unknown>>();
  readonly code = input.required<string>();
  readonly exercise = input.required<string>();
  readonly expected = input.required<string>();
  readonly tab = signal<'preview' | 'code'>('preview');
  readonly generation = signal([0]);
  readonly copyStatus = signal('');
  reset(): void {
    this.generation.update(([key]) => [key + 1]);
    this.tab.set('preview');
    this.copyStatus.set('');
  }
  async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copyStatus.set('Đã sao chép');
    } catch {
      this.copyStatus.set('Không thể truy cập clipboard. Bạn có thể chọn code và sao chép thủ công.');
    }
  }
}
