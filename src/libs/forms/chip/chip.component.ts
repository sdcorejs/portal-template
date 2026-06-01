import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdChip } from '@sdcorejs/angular/forms/chip';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdSize } from '@sdcorejs/angular/utilities/models';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdLabel } from '@sdcorejs/angular/forms/label';

@Component({
  selector: 'app-chip-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SdChip,
    SdInput,
    SdCodeEditor,
    SdPageComponent,
    SdSection,
    SdSelect,
    SdSwitch,
    SdLabel,
  ],
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipDemoComponent {
  pageDescription = signal<string>('Thành phần nhập liệu cho danh sách chip, hỗ trợ thêm/xóa item và quản lý danh sách.');

  // Configuration signals
  label = signal<string>('Ngôn ngữ lập trình');
  placeholder = signal<string>('Nhập giá trị và nhấn Enter hoặc Comma');
  modelValue = signal<(string | number)[]>(['JavaScript', 'TypeScript', 'Angular']);
  size = signal<SdSize>('md');
  required = signal<boolean>(false);
  minValue = signal<number>(0);
  maxValue = signal<number>(10);
  disabled = signal<boolean>(false);
  removable = signal<boolean>(true);

  sizeOptions = [
    { id: 'sm', name: 'Small' },
    { id: 'md', name: 'Medium' },
    { id: 'lg', name: 'Large' },
  ];

  htmlCode = computed(() => {
    const props: string[] = [];
    if (this.label()) props.push(`[label]="'${this.label()}'"`);
    if (this.placeholder()) props.push(`[placeholder]="'${this.placeholder()}'"`);
    if (this.size()) props.push(`[size]="'${this.size()}'"`);
    if (this.disabled()) props.push(`[disabled]="true"`);
    if (this.required()) props.push(`[required]="true"`);
    if (!this.removable()) props.push(`[removable]="false"`);
    if (this.minValue() > 0) props.push(`[min]="${this.minValue()}"`);
    if (this.maxValue() < 10) props.push(`[max]="${this.maxValue()}"`);

    return `<sd-chip\n  [(model)]="chipValue"\n  ${props.join('\n  ')}\n></sd-chip>`;
  });

  tsCode = `import { Component } from '@angular/core';
import { SdChip } from '@sdcorejs/angular/forms/chip';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdChip],
  templateUrl: './my-component.component.html'
})
export class MyComponent {
  chipValue: (string | number)[] = ['JavaScript', 'TypeScript', 'Angular'];
}`;
}
