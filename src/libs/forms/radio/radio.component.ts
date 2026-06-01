import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdLabel } from '@sdcorejs/angular/forms/label';
import { SdRadio } from '@sdcorejs/angular/forms/radio';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

interface GenderOption {
  id: string;
  name: string;
}

type RadioColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-radio-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, SdCodeEditor, SdPageComponent, SdSection, SdInput, SdLabel, SdRadio, SdSelect, SdSwitch],
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioDemoComponent {
  // Mock Data
  genderItems: GenderOption[] = [
    { id: 'male', name: 'Nam' },
    { id: 'female', name: 'Nữ' },
    { id: 'other', name: 'Khác' },
  ];

  // Tokens
  pageDescription = signal<string>('Lựa chọn đơn từ danh sách option qua sd-radio. Có 2 layout row/column, hỗ trợ disabled, required và view-only.');
  label = signal<string>('Giới tính');
  modelValue = signal<string | number | boolean | null | undefined>('male');
  display = signal<'row' | 'column'>('row');
  color = signal<RadioColor>('primary');
  disabled = signal<boolean>(false);
  required = signal<boolean>(true);
  viewed = signal<boolean>(false);

  displayOptions = [
    { id: 'row', name: 'Row (ngang)' },
    { id: 'column', name: 'Column (dọc)' },
  ];

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
    if (this.display() !== 'row') props.push(`[display]="'${this.display()}'"`);
    if (this.color() !== 'primary') props.push(`[color]="'${this.color()}'"`);
    if (this.disabled()) props.push(`[disabled]="true"`);
    if (this.required()) props.push(`[required]="true"`);
    if (this.viewed()) props.push(`[viewed]="true"`);

    return `<sd-radio\n  [(model)]="value"\n  [items]="genderItems"\n  valueField="id"\n  displayField="name"\n  ${props.join('\n  ')}\n></sd-radio>`;
  });

  tsCode = `import { Component, signal } from '@angular/core';
import { SdRadio } from '@sdcorejs/angular/forms/radio';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdRadio],
  templateUrl: './my-component.component.html'
})
export class MyComponent {
  value = signal<string>('male');
  genderItems = [
    { id: 'male', name: 'Nam' },
    { id: 'female', name: 'Nữ' },
    { id: 'other', name: 'Khác' },
  ];
}`;
}
