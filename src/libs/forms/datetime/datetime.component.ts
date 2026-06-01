import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdDate } from '@sdcorejs/angular/forms/date';
import { SdDatetime } from '@sdcorejs/angular/forms/datetime';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdLabel } from '@sdcorejs/angular/forms/label';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdSize } from '@sdcorejs/angular/utilities/models';

@Component({
  selector: 'app-datetime-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, SdDatetime, SdCodeEditor, SdPageComponent, SdSection, SdInput, SdSelect, SdSwitch, SdLabel, SdDate],
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatetimeDemoComponent {
  // Tokens
  label = signal<string>('Thời gian hẹn');
  pageDescription = signal<string>('Thành phần chọn cả ngày và giờ trên cùng một giao diện thân thiện.');
  placeholder = signal<string>('Chọn ngày và giờ...');
  modelValue = signal<string>('2024/04/02 14:30');
  size = signal<SdSize>('md');
  disabled = signal<boolean>(false);
  required = signal<boolean>(false);
  viewed = signal<boolean>(false);
  min = signal<string>('');
  max = signal<string>('');
  
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
    if (this.disabled()) props.push(`[disabled]="true"`);
    if (this.required()) props.push(`[required]="true"`);
    if (this.viewed()) props.push(`[viewed]="true"`);
    if (this.min()) props.push(`[min]="'${this.min()}'"`);
    if (this.max()) props.push(`[max]="'${this.max()}'"`);

    return `<sd-datetime\n  [(model)]="value"\n  ${props.join('\n  ')}\n></sd-datetime>`;
  });

  tsCode = `import { Component } from '@angular/core';
import { SdDatetime } from '@sdcorejs/angular/forms/datetime';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdDatetime],
  templateUrl: './my-component.component.html'
})
export class MyComponent {
  value = '2024/04/02 14:30';
}`;
}
