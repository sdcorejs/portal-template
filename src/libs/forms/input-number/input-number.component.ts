import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection } from '@sd-angular/core/components/section';
import { SdSuffixDefDirective } from '@sd-angular/core/forms/directives';
import { SdInput } from '@sd-angular/core/forms/input';
import { SdInputNumber } from '@sd-angular/core/forms/input-number';
import { SdLabel } from '@sd-angular/core/forms/label';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdSwitch } from '@sd-angular/core/forms/switch';
import { SdPageComponent } from '@sd-angular/core/modules/layout';
import { SdSize } from '@sd-angular/core/utilities/models';

@Component({
  selector: 'app-input-number-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, SdInputNumber, SdCodeEditor, SdPageComponent, SdSection, SdInput, SdSelect, SdSwitch, SdLabel, SdSuffixDefDirective],
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberDemoComponent {
  // Tokens
  label = signal<string>('Số tiền');
  pageDescription = signal<string>('Thành phần nhập liệu số học, hỗ trợ làm tròn, giới hạn và định dạng số.');
  placeholder = signal<string>('Nhập số tiền...');
  modelValue = signal<number>(1500000);
  size = signal<SdSize>('md');
  precision = signal<number>(0);
  min = signal<number | undefined>(0);
  max = signal<number | undefined>(100000000);
  disabled = signal<boolean>(false);
  required = signal<boolean>(false);
  viewed = signal<boolean>(false);
  suffixMode = signal<'none' | 'icon' | 'text'>('text');
  suffixValue = signal<string>('VNĐ');

  sizes: SdSize[] = ['sm', 'md', 'lg'];
  sizeOptions = [
    { id: 'sm', name: 'Small' },
    { id: 'md', name: 'Medium' },
    { id: 'lg', name: 'Large' },
  ];
  suffixModeOptions = [
    { id: 'none', name: 'Không dùng suffix' },
    { id: 'icon', name: 'Suffix icon' },
    { id: 'text', name: 'Suffix text' },
  ];

  suffixDescription = computed(() =>
    this.suffixMode() === 'icon'
      ? 'Tên Material icon hiển thị ở cuối input-number'
      : this.suffixMode() === 'text'
        ? 'Text hiển thị như đơn vị tính hoặc tiền tệ'
        : 'Tắt suffix để hiển thị control mặc định'
  );

  suffixPlaceholder = computed(() =>
    this.suffixMode() === 'icon'
      ? 'Ví dụ: payments, calculate'
      : this.suffixMode() === 'text'
        ? 'Ví dụ: VNĐ, kg, %'
        : 'Không sử dụng'
  );

  suffixPreviewLabel = computed(() => {
    if (this.suffixMode() === 'icon') return `Icon: ${this.suffixValue() || 'payments'}`;
    if (this.suffixMode() === 'text') return `Text: ${this.suffixValue() || 'VNĐ'}`;
    return 'Không có suffix';
  });

  htmlCode = computed(() => {
    const props: string[] = [];
    if (this.label()) props.push(`[label]="'${this.label()}'"`);
    if (this.placeholder()) props.push(`[placeholder]="'${this.placeholder()}'"`);
    if (this.size()) props.push(`[size]="'${this.size()}'"`);
    if (this.precision() !== undefined) props.push(`[precision]="${this.precision()}"`);
    if (this.min() !== undefined) props.push(`[min]="${this.min()}"`);
    if (this.max() !== undefined) props.push(`[max]="${this.max()}"`);
    if (this.disabled()) props.push(`[disabled]="true"`);
    if (this.required()) props.push(`[required]="true"`);
    if (this.viewed()) props.push(`[viewed]="true"`);

    const suffix = this.getSuffixTemplateCode();

    if (suffix) {
      return `<sd-input-number\n  [(model)]="value"\n  ${props.join('\n  ')}\n>\n  ${suffix}\n</sd-input-number>`;
    }

    return `<sd-input-number\n  [(model)]="value"\n  ${props.join('\n  ')}\n></sd-input-number>`;
  });

  private getSuffixTemplateCode(): string | undefined {
    if (this.suffixMode() === 'icon') {
      return `<ng-template sdSuffixDef>\n    <mat-icon class="demo-suffix-icon">${this.suffixValue() || 'payments'}</mat-icon>\n  </ng-template>`;
    }

    if (this.suffixMode() === 'text') {
      return `<ng-template sdSuffixDef>\n    <span class="demo-suffix-text">${this.suffixValue() || 'VNĐ'}</span>\n  </ng-template>`;
    }

    return undefined;
  }

  tsCode = `import { Component } from '@angular/core';
import { SdInputNumber } from '@sd-angular/core/forms/input-number';
import { SdSuffixDefDirective } from '@sd-angular/core/forms/directives';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdInputNumber, SdSuffixDefDirective, MatIconModule],
  templateUrl: './my-component.component.html'
})
export class MyComponent {
  value = 1500000;
}`;
}
