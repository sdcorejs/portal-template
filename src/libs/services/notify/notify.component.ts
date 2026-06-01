import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdInputNumber } from '@sdcorejs/angular/forms/input-number';
import { SdLabel } from '@sdcorejs/angular/forms/label';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdNotifyService, SdNotifyOption } from '@sdcorejs/angular/services/notify';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

@Component({
  selector: 'app-notify-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, SdButton, SdCodeEditor, SdPageComponent, SdSection, SdInput, SdInputNumber, SdSelect, SdSwitch, SdLabel],
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotifyDemoComponent {
  readonly #notifyService = inject(SdNotifyService);

  // States
  message = signal<string>('Bản ghi đã được lưu trữ thành công.');
  pageDescription = signal<string>('Dịch vụ hiển thị thông báo Toast, hỗ trợ hàng chờ và đa dạng loại cảnh báo.');
  title = signal<string>('Lưu thành công');
  type = signal<ToastType>('success');
  duration = signal<number>(3000);
  actionLabel = signal<string>('');

  types: ToastType[] = ['success', 'info', 'warning', 'error'];
  typeOptions = [
    { id: 'success', name: 'Success' },
    { id: 'info', name: 'Info' },
    { id: 'warning', name: 'Warning' },
    { id: 'error', name: 'Error' },
  ];

  // Code HTML sinh tự động
  htmlCode = computed(() => {
    return `<sd-button (click)="showNotify()">Hiển thị thông báo</sd-button>`;
  });

  // Code TS tĩnh
  tsCode = computed(() => {
    const opts = [];
    if (this.title()) opts.push(`title: '${this.title()}'`);
    if (this.duration() !== 3000) opts.push(`duration: ${this.duration()}`);
    if (this.actionLabel()) {
      opts.push(`actionLabel: '${this.actionLabel()}'`);
      opts.push(`onAction: () => console.log('Action clicked')`);
    }

    const optionsString = opts.length > 0 
      ? `, {\n      ${opts.join(',\n      ')}\n    }` 
      : '';

    return `import { Component, inject } from '@angular/core';
import { SdNotifyService } from '@sdcorejs/angular/services/notify';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdButton],
  templateUrl: './my-component.component.html'
})
export class MyComponent {
  readonly #notifyService = inject(SdNotifyService);

  showNotify() {
    this.#notifyService.${this.type()}('${this.message()}'${optionsString});
  }
}`;
  });

  showNotify() {
    const message = this.message();
    const options: SdNotifyOption = {
      duration: this.duration(),
      ...(this.title() && { title: this.title() }),
      ...(this.actionLabel() && {
        actionLabel: this.actionLabel(),
        onAction: () => { alert('Action clicked!'); },
      }),
    };

    if (this.type() === 'success') this.#notifyService.success(message, options);
    if (this.type() === 'info') this.#notifyService.info(message, options);
    if (this.type() === 'warning') this.#notifyService.warning(message, options);
    if (this.type() === 'error') this.#notifyService.error(message, options);
  }

  showNotifyWithAction() {
    this.#notifyService.info('Bạn đã xóa 1 bản ghi.', {
      title: 'Xác nhận xóa',
      duration: 5000,
      actionLabel: 'Hoàn tác',
      onAction: () => {
        alert('Đã hoàn tác thao tác!');
      },
    });
  }

}
