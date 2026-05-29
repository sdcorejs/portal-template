import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdCheckbox } from '@sd-angular/core/forms/checkbox';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection } from '@sd-angular/core/components/section';
import { SdInput } from '@sd-angular/core/forms/input';
import { SdLabel } from '@sd-angular/core/forms/label';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdSwitch } from '@sd-angular/core/forms/switch';
import { SdPageComponent } from '@sd-angular/core/modules/layout';

type CheckboxColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-checkbox-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, SdCodeEditor, SdPageComponent, SdSection, SdCheckbox, SdInput, SdLabel, SdSelect, SdSwitch],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxDemoComponent {
  // Tokens
  pageDescription = signal<string>('Ô tích nhị phân qua sd-checkbox: nhận giá trị boolean, hỗ trợ màu primary/warn và disabled.');
  label = signal<string>('Đồng ý điều khoản sử dụng');
  modelValue = signal<boolean>(true);
  color = signal<CheckboxColor>('primary');
  disabled = signal<boolean>(false);
  viewed = signal<boolean>(false);
  inlineError = signal<string>('');

  colorOptions = [
    { id: 'primary', name: 'Primary' },
    { id: 'secondary', name: 'Secondary' },
    { id: 'info', name: 'Info' },
    { id: 'success', name: 'Success' },
    { id: 'warning', name: 'Warning' },
    { id: 'error', name: 'Error' },
  ];

  htmlCode = computed(() => {
    const props: string[] = [];
    if (this.label()) props.push(`[label]="'${this.label()}'"`);
    if (this.color() !== 'primary') props.push(`[color]="'${this.color()}'"`);
    if (this.disabled()) props.push(`[disabled]="true"`);
    if (this.viewed()) props.push(`[viewed]="true"`);
    if (this.inlineError()) props.push(`[inlineError]="'${this.inlineError()}'"`);

    return `<sd-checkbox\n  [(model)]="value"\n  ${props.join('\n  ')}\n></sd-checkbox>`;
  });

  tsCode = `import { Component, signal } from '@angular/core';
import { SdCheckbox } from '@sd-angular/core/forms/checkbox';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdCheckbox],
  templateUrl: './my-component.component.html'
})
export class MyComponent {
  value = signal<boolean>(true);
}`;
}
