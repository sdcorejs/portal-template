import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton, SdButtonSize, SdButtonType } from '@sd-angular/core/components/button';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection } from '@sd-angular/core/components/section';
import { SdInput } from '@sd-angular/core/forms/input';
import { SdLabel } from '@sd-angular/core/forms/label';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdSwitch } from '@sd-angular/core/forms/switch';
import { SdColor } from '@sd-angular/core/utilities/models';
import { SdPageComponent } from '@sd-angular/core/modules/layout';

@Component({
  selector: 'app-button-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, SdButton, SdCodeEditor, SdSwitch, SdPageComponent, SdSection, SdInput, SdSelect, SdLabel],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonDemoComponent {
  // Trạng thái (Token)
  title = signal<string>('Nút bấm');
  pageDescription = signal<string>('Thành phần nút bấm cơ bản, hỗ trợ nhiều kiểu dáng, màu sắc và trạng thái loading.');
  type = signal<SdButtonType>('fill');
  color = signal<SdColor>('primary');
  size = signal<SdButtonSize>('md');
  disabled = signal<boolean>(false);
  loading = signal<boolean>(false);
  prefixIcon = signal<string>('');
  suffixIcon = signal<string>('');

  // Các danh sách tùy chọn
  types: SdButtonType[] = ['fill', 'light', 'outline', 'link'];
  typeOptions = [
    { id: 'fill', name: 'Fill' },
    { id: 'light', name: 'Light' },
    { id: 'outline', name: 'Outline' },
    { id: 'link', name: 'Link' },
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
  sizes: SdButtonSize[] = ['sm', 'md', 'lg'];
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
    if (this.disabled()) props.push(`[disabled]="true"`);
    if (this.loading()) props.push(`[loading]="true"`);
    if (this.prefixIcon()) props.push(`[prefixIcon]="'${this.prefixIcon()}'"`);
    if (this.suffixIcon()) props.push(`[suffixIcon]="'${this.suffixIcon()}'"`);
    if (this.title()) props.push(`[title]="'${this.title()}'"`);
    
    props.push(`(click)="onClick($event)"`);

    // Format đẹp
    if (props.length > 3) {
      return `<sd-button\n  ${props.join('\n  ')}\n></sd-button>`;
    }
    return `<sd-button ${props.join(' ')}></sd-button>`;
  });

  // Code TS tĩnh
  tsCode = `import { Component } from '@angular/core';
import { SdButton } from '@sd-angular/core/components/button';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdButton],
  templateUrl: './my-component.component.html'
})
export class MyComponent {
  onClick(event: Event) {
    console.log('Button clicked!', event);
  }
}
`;

  onButtonClick(event: Event) {
    console.log('Demo Button Clicked', event);
    alert('Thao tác click thành công!');
  }
}
