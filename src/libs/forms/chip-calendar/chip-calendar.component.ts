import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdChipCalendar } from '@sdcorejs/angular/forms/chip-calendar';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdSize } from '@sdcorejs/angular/utilities/models';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdLabel } from '@sdcorejs/angular/forms/label';

@Component({
  selector: 'app-chip-calendar-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SdChipCalendar,
    SdInput,
    SdCodeEditor,
    SdPageComponent,
    SdSection,
    SdSelect,
    SdSwitch,
    SdLabel,
  ],
  templateUrl: './chip-calendar.component.html',
  styleUrls: ['./chip-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipCalendarDemoComponent {
  pageDescription = signal<string>('Thành phần chọn danh sách ngày tháng từ calendar popup, hỗ trợ thêm/xóa ngày và quản lý danh sách ngày (Định dạng: yyyy/MM/dd).');

  // Configuration signals
  label = signal<string>('Chọn các ngày');
  modelValue = signal<(string | number)[]>(['2026/04/17', '2026/04/18', '2026/04/20']);
  size = signal<SdSize>('md');
  required = signal<boolean>(false);
  minValue = signal<number>(0);
  maxValue = signal<number>(10);
  disabled = signal<boolean>(false);

  sizeOptions = [
    { id: 'sm', name: 'Small' },
    { id: 'md', name: 'Medium' },
    { id: 'lg', name: 'Large' },
  ];

  htmlCode = computed(() => {
    const props: string[] = [];
    if (this.label()) props.push(`[label]="'${this.label()}'"`);
    if (this.size()) props.push(`[size]="'${this.size()}'"`);
    if (this.disabled()) props.push(`[disabled]="true"`);
    if (this.required()) props.push(`[required]="true"`);
    if (this.minValue() > 0) props.push(`[min]="${this.minValue()}"`);
    if (this.maxValue() < 10) props.push(`[max]="${this.maxValue()}"`);

    return `<sd-chip-calendar\n  [(model)]="selectedDates"\n  ${props.join('\n  ')}\n></sd-chip-calendar>`;
  });

  tsCode = `import { Component, signal } from '@angular/core';
import { SdChipCalendar } from '@sdcorejs/angular/forms/chip-calendar';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdChipCalendar],
  templateUrl: './my-component.component.html'
})
export class MyComponent {
  // Định dạng: yyyy/MM/dd
  selectedDates = signal<string[]>(['2026/04/17', '2026/04/18', '2026/04/20']);
}`;
}
