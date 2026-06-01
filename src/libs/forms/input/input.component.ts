import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSuffixDefDirective } from '@sdcorejs/angular/forms/directives';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdLabel } from '@sdcorejs/angular/forms/label';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdSize } from '@sdcorejs/angular/utilities/models';

@Component({
  selector: 'app-input-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, SdInput, SdCodeEditor, SdPageComponent, SdSection, SdSelect, SdSwitch, SdLabel, SdSuffixDefDirective],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDemoComponent {
  // Tokens
  label = signal<string>('Họ và tên');
  pageDescription = signal<string>('Thành phần nhập liệu văn bản cơ bản, hỗ trợ nhiều trạng thái và kích thước.');
  placeholder = signal<string>('Nhập họ tên đầy đủ...');
  helperText = signal<string>('Vui lòng nhập tên có dấu');
  modelValue = signal<string>('Nguyễn Văn A');
  size = signal<SdSize>('md');
  disabled = signal<boolean>(false);
  required = signal<boolean>(true);
  readonly = signal<boolean>(false);
  viewed = signal<boolean>(false);
  suffixMode = signal<'none' | 'icon' | 'text'>('icon');
  suffixValue = signal<string>('search');

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
      ? 'Tên Material icon hiển thị ở cuối ô nhập'
      : this.suffixMode() === 'text'
        ? 'Chuỗi text hiển thị ở cuối ô nhập'
        : 'Tắt suffix để hiển thị ô nhập mặc định'
  );

  suffixPlaceholder = computed(() =>
    this.suffixMode() === 'icon'
      ? 'Ví dụ: search, person'
      : this.suffixMode() === 'text'
        ? 'Ví dụ: .vn, kg'
        : 'Không sử dụng'
  );

  suffixPreviewLabel = computed(() => {
    if (this.suffixMode() === 'icon') return `Icon: ${this.suffixValue() || 'search'}`;
    if (this.suffixMode() === 'text') return `Text: ${this.suffixValue() || '.vn'}`;
    return 'Không có suffix';
  });

  htmlCode = computed(() => {
    const props: string[] = [];
    if (this.label()) props.push(`[label]="'${this.label()}'"`);
    if (this.placeholder()) props.push(`[placeholder]="'${this.placeholder()}'"`);
    if (this.helperText()) props.push(`[helperText]="'${this.helperText()}'"`);
    if (this.size()) props.push(`[size]="'${this.size()}'"`);
    if (this.disabled()) props.push(`[disabled]="true"`);
    if (this.required()) props.push(`[required]="true"`);
    if (this.readonly()) props.push(`[readonly]="true"`);
    if (this.viewed()) props.push(`[viewed]="true"`);

    const suffix = this.getSuffixTemplateCode();

    if (suffix) {
      return `<sd-input\n  [(model)]="value"\n  ${props.join('\n  ')}\n>\n  ${suffix}\n</sd-input>`;
    }

    return `<sd-input\n  [(model)]="value"\n  ${props.join('\n  ')}\n></sd-input>`;
  });

  private getSuffixTemplateCode(): string | undefined {
    if (this.suffixMode() === 'icon') {
      return `<ng-template sdSuffixDef>\n    <mat-icon class="demo-suffix-icon">${this.suffixValue() || 'search'}</mat-icon>\n  </ng-template>`;
    }

    if (this.suffixMode() === 'text') {
      return `<ng-template sdSuffixDef>\n    <span class="demo-suffix-text">${this.suffixValue() || '.vn'}</span>\n  </ng-template>`;
    }

    return undefined;
  }

  tsCode = `import { Component } from '@angular/core';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdSuffixDefDirective } from '@sdcorejs/angular/forms/directives';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdInput, SdSuffixDefDirective, MatIconModule],
  templateUrl: './my-component.component.html'
})
export class MyComponent {
  value = 'Nguyễn Văn A';
}`;
}
