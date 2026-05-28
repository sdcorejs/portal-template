import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection } from '@sd-angular/core/components/section';
import { SdInput } from '@sd-angular/core/forms/input';
import { SdInputNumber } from '@sd-angular/core/forms/input-number';
import { SdLabel } from '@sd-angular/core/forms/label';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdSwitch } from '@sd-angular/core/forms/switch';
import { SdTextarea } from '@sd-angular/core/forms/textarea';
import { SdPageComponent } from '@sd-angular/core/modules/layout';
import { SdSize } from '@sd-angular/core/utilities/models';

@Component({
  selector: 'app-textarea-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, SdTextarea, SdCodeEditor, SdPageComponent, SdSection, SdInput, SdSelect, SdSwitch, SdLabel, SdInputNumber],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaDemoComponent {
  // Tokens
  label = signal<string>('Ghi chú');
  pageDescription = signal<string>('Thành phần nhập liệu văn bản nhiều dòng, hỗ trợ tự động thay đổi chiều cao.');
  placeholder = signal<string>('Nhập nội dung chi tiết...');
  modelValue = signal<string>('Đây là nội dung mẫu...');
  size = signal<SdSize>('md');
  rows = signal<number>(5);
  autoHeight = signal<boolean>(false);
  disabled = signal<boolean>(false);
  required = signal<boolean>(false);
  viewed = signal<boolean>(false);

  sizes: SdSize[] = ['sm', 'md', 'lg'];
  sizeOptions = [
    { id: 'sm', name: 'Small' },
    { id: 'md', name: 'Medium' },
    { id: 'lg', name: 'Large' },
  ];

  htmlCode = computed(() => {
    const props = [];
    if (this.label()) props.push(`[label]="'${this.label()}'"`);
    if (this.placeholder()) props.push(`[placeholder]="'${this.placeholder()}'"`);
    if (this.size()) props.push(`[size]="'${this.size()}'"`);
    if (this.rows()) props.push(`[rows]="${this.rows()}"`);
    if (this.autoHeight()) props.push(`[autoHeight]="true"`);
    if (this.disabled()) props.push(`[disabled]="true"`);
    if (this.required()) props.push(`[required]="true"`);
    if (this.viewed()) props.push(`[viewed]="true"`);

    return `<sd-textarea\n  [(model)]="value"\n  ${props.join('\n  ')}\n></sd-textarea>`;
  });

  tsCode = `import { Component } from '@angular/core';
import { SdTextarea } from '@sd-angular/core/forms/textarea';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdTextarea],
  templateUrl: './my-component.component.html'
})
export class MyComponent {
  value = 'Nội dung ghi chú...';
}`;
}
