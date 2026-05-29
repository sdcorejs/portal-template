import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection } from '@sd-angular/core/components/section';
import { SdInput } from '@sd-angular/core/forms/input';
import { SdLabel } from '@sd-angular/core/forms/label';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdSwitch } from '@sd-angular/core/forms/switch';
import { SdPageComponent } from '@sd-angular/core/modules/layout';

type SwitchColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-switch-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, SdCodeEditor, SdPageComponent, SdSection, SdInput, SdLabel, SdSelect, SdSwitch],
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchDemoComponent {
  // Tokens
  pageDescription = signal<string>('Công tắc nhị phân qua sd-switch: nhận giá trị boolean, hỗ trợ nhiều bộ màu Color, disabled, required, ẩn inline-error.');
  label = signal<string>('Nhận thông báo qua email');
  modelValue = signal<boolean>(true);
  color = signal<SwitchColor>('primary');
  disabled = signal<boolean>(false);
  viewed = signal<boolean>(false);
  required = signal<boolean>(false);
  hideInlineError = signal<boolean>(false);

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
    if (this.required()) props.push(`[required]="true"`);
    if (this.hideInlineError()) props.push(`[hideInlineError]="true"`);

    return `<sd-switch\n  [(model)]="value"\n  ${props.join('\n  ')}\n></sd-switch>`;
  });

  tsCode = `import { Component, signal } from '@angular/core';
import { SdSwitch } from '@sd-angular/core/forms/switch';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdSwitch],
  templateUrl: './my-component.component.html'
})
export class MyComponent {
  value = signal<boolean>(true);
}`;
}
