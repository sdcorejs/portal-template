import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdBadge, SdBadgeType } from '@sdcorejs/angular/components/badge';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdLabel } from '@sdcorejs/angular/forms/label';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdColor, SdSize } from '@sdcorejs/angular/utilities/models';

@Component({
  selector: 'app-badge-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, SdBadge, SdCodeEditor, SdPageComponent, SdSection, SdInput, SdSelect, SdSwitch, SdLabel],
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeDemoComponent {
  // Trạng thái (Token)
  title = signal<string>('99+');
  pageDescription = signal<string>('Thành phần hiển thị nhãn trạng thái, thông báo hoặc chỉ số đếm nhanh.');
  description = signal<string>('Tin nhắn mới');
  type = signal<SdBadgeType>('tag');
  color = signal<SdColor>('error');
  size = signal<SdSize>('md');
  icon = signal<string>('notifications');

  // Các danh sách tùy chọn
  types: SdBadgeType[] = ['tag', 'round', 'icon'];
  typeOptions = [
    { id: 'tag', name: 'Tag' },
    { id: 'round', name: 'Round' },
    { id: 'icon', name: 'Icon' },
  ];
  colors: SdColor[] = ['primary', 'secondary', 'success', 'warning', 'error', 'info'];
  colorOptions = [
    { id: 'primary', name: 'Primary' },
    { id: 'secondary', name: 'Secondary' },
    { id: 'success', name: 'Success' },
    { id: 'warning', name: 'Warning' },
    { id: 'error', name: 'Error' },
    { id: 'info', name: 'Info' },
  ];
  sizes: SdSize[] = ['sm', 'md', 'lg'];
  sizeOptions = [
    { id: 'sm', name: 'Small' },
    { id: 'md', name: 'Medium' },
    { id: 'lg', name: 'Large' },
  ];

  // Code HTML sinh tự động dựa trên trạng thái
  htmlCode = computed(() => {
    const props = [];
    
    if (this.type()) props.push(`[type]="'${this.type()}'"`);
    if (this.color()) props.push(`[color]="'${this.color()}'"`);
    if (this.size()) props.push(`[size]="'${this.size()}'"`);
    if (this.title()) props.push(`[title]="'${this.title()}'"`);
    if (this.description()) props.push(`[description]="'${this.description()}'"`);
    if (this.icon()) props.push(`[icon]="'${this.icon()}'"`);

    // Format đẹp
    if (props.length > 3) {
      return `<sd-badge\n  ${props.join('\n  ')}\n></sd-badge>`;
    }
    return `<sd-badge ${props.join(' ')}></sd-badge>`;
  });

  // Code TS tĩnh
  tsCode = `import { Component } from '@angular/core';
import { SdBadge } from '@sdcorejs/angular/components/badge';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdBadge],
  templateUrl: './my-component.component.html'
})
export class MyComponent {
}`;
}
