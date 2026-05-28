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
import { SdSize } from '@sd-angular/core/utilities/models';

interface Country {
  id: string;
  name: string;
  code: string;
}

@Component({
  selector: 'app-select-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, SdSelect, SdCodeEditor, SdPageComponent, SdSection, SdInput, SdSwitch, SdLabel],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDemoComponent {
  // Mock Data
  countries: Country[] = [
    { id: '1', name: 'Vietnam', code: 'VN' },
    { id: '2', name: 'United States', code: 'US' },
    { id: '3', name: 'Japan', code: 'JP' },
    { id: '4', name: 'South Korea', code: 'KR' },
    { id: '5', name: 'Germany', code: 'DE' },
    { id: '6', name: 'France', code: 'FR' },
    { id: '7', name: 'United Kingdom', code: 'UK' },
    { id: '8', name: 'Australia', code: 'AU' },
  ];

  // Tokens
  label = signal<string>('Bộ phận');
  pageDescription = signal<string>('Thành phần chọn từ danh sách, hỗ trợ chọn đơn/đa, tìm kiếm và phân trang.');
  placeholder = signal<string>('Chọn một quốc gia...');
  modelValue = signal<string>('1');
  size = signal<SdSize>('md');
  multiple = signal<boolean>(false);
  disabled = signal<boolean>(false);
  required = signal<boolean>(true);
  viewed = signal<boolean>(false);

  sizes: SdSize[] = ['sm', 'md', 'lg'];
  sizeOptions = [
    { id: 'sm', name: 'Small' },
    { id: 'md', name: 'Medium' },
    { id: 'lg', name: 'Large' },
  ];

  htmlCode = computed(() => {
    const props = [];
    props.push(`[items]="countries"`);
    props.push(`[valueField]="'id'"`);
    props.push(`[displayField]="'name'"`);
    if (this.label()) props.push(`[label]="'${this.label()}'"`);
    if (this.placeholder()) props.push(`[placeholder]="'${this.placeholder()}'"`);
    if (this.size()) props.push(`[size]="'${this.size()}'"`);
    if (this.multiple()) props.push(`[multiple]="true"`);
    if (this.disabled()) props.push(`[disabled]="true"`);
    if (this.required()) props.push(`[required]="true"`);
    if (this.viewed()) props.push(`[viewed]="true"`);

    return `<sd-select\n  [(model)]="selectedId"\n  ${props.join('\n  ')}\n></sd-select>`;
  });

  tsCode = `import { Component } from '@angular/core';
import { SdSelect } from '@sd-angular/core/forms/select';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdSelect],
  templateUrl: './my-component.component.html'
})
export class MyComponent {
  selectedId = '1';
  countries = [
    { id: '1', name: 'Vietnam' },
    { id: '2', name: 'United States' },
    // ...
  ];
}`;
}
