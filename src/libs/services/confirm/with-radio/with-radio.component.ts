import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdLabel } from '@sdcorejs/angular/forms/label';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdConfirmService } from '@sdcorejs/angular/services/confirm';
import { SdNotifyService } from '@sdcorejs/angular/services/notify';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

type ButtonColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-confirm-with-radio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdButton,
    SdCodeEditor,
    SdPageComponent,
    SdSection,
    SdInput,
    SdLabel,
    SdSelect,
    SdSwitch,
  ],
  templateUrl: './with-radio.component.html',
  styleUrls: ['./with-radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmWithRadioComponent {
  readonly #confirmService = inject(SdConfirmService);
  readonly #notifyService = inject(SdNotifyService);

  pageDescription = signal(
    'Phương thức .withRadio() mở hộp thoại kèm danh sách lựa chọn Radio. Hỗ trợ layout column / row, giá trị được chọn mặc định và bắt buộc chọn. Trả về Promise<string> với value của mục được chọn.'
  );

  message = signal('Vui lòng chọn quyền truy cập phù hợp:');
  title = signal('Chọn quyền');
  yesTitle = signal('Áp dụng');
  noTitle = signal('Hủy');
  yesButtonColor = signal<ButtonColor | null>(null);
  noButtonColor = signal<ButtonColor | null>(null);
  required = signal(false);
  display = signal<'row' | 'column'>('column');
  defaultValue = signal<string | null>(null);

  colorOptions: { id: ButtonColor | null; name: string }[] = [
    { id: null, name: '-- Mặc định --' },
    { id: 'primary', name: 'Primary' },
    { id: 'secondary', name: 'Secondary' },
    { id: 'success', name: 'Success' },
    { id: 'error', name: 'Error' },
    { id: 'warning', name: 'Warning' },
    { id: 'info', name: 'Info' },
  ];

  displayOptions = [
    { id: 'column' as const, name: 'Column (dọc)' },
    { id: 'row' as const, name: 'Row (ngang)' },
  ];

  readonly items = [
    { id: '1', name: 'Hiển thị dữ liệu Vùng Cơ bản' },
    { id: '2', name: 'Giới hạn danh sách nhân viên' },
    { id: '3', name: 'Quản trị viên Cao Cấp' },
  ];

  defaultValueOptions: { id: string | null; name: string }[] = [
    { id: null, name: '-- Không có --' },
    ...this.items.map(item => ({ id: item.id, name: item.name })),
  ];

  lastResult = signal('Chưa có tương tác nào được ghi nhận');

  tsCode = computed(() => {
    const yesColor = this.yesButtonColor();
    const noColor = this.noButtonColor();
    const defVal = this.defaultValue();
    return `import { Component, inject } from '@angular/core';
import { SdConfirmService } from '@sdcorejs/angular/services/confirm';

@Component({ ... })
export class MyComponent {
  readonly #confirmService = inject(SdConfirmService);

  async onSelectOption() {
    try {
      const value = await this.#confirmService.withRadio('${this.message()}', {
        title: '${this.title()}',
        yesTitle: '${this.yesTitle()}',
        noTitle: '${this.noTitle()}',${yesColor ? `\n        yesButtonColor: '${yesColor}',` : ''}${noColor ? `\n        noButtonColor: '${noColor}',` : ''}
        items: [
          { id: '1', name: 'Hiển thị dữ liệu Vùng Cơ bản' },
          { id: '2', name: 'Giới hạn danh sách nhân viên' },
          { id: '3', name: 'Quản trị viên Cao Cấp' },
        ],
        valueField: 'id',
        displayField: 'name',
        display: '${this.display()}',
        required: ${this.required()},${defVal !== null ? `\n        defaultValue: '${defVal}',` : ''}
      });
      console.log(value); // ID của lựa chọn
    } catch {
      // Người dùng hủy
    }
  }
}`;
  });

  test(): void {
    this.#confirmService
      .withRadio(this.message(), {
        title: this.title(),
        yesTitle: this.yesTitle(),
        noTitle: this.noTitle(),
        yesButtonColor: this.yesButtonColor() ?? undefined,
        noButtonColor: this.noButtonColor() ?? undefined,
        items: this.items,
        valueField: 'id',
        displayField: 'name',
        display: this.display(),
        required: this.required(),
        defaultValue: this.defaultValue() ?? undefined,
      })
      .then(value => {
        const item = this.items.find(i => i.id === value);
        this.lastResult.set(`Lựa chọn: "${item?.name ?? value}"`);
        this.#notifyService.success('Đã chọn: ' + (item?.name ?? value));
      })
      .catch(() => {
        this.lastResult.set('Thao tác bị HUỶ');
      });
  }
}
