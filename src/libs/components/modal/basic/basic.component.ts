import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdModal } from '@sdcorejs/angular/components/modal';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

@Component({
  selector: 'app-modal-basic',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdButton,
    SdCodeEditor,
    SdInput,
    SdModal,
    SdPageComponent,
    SdSection,
    SdSelect,
    SdSwitch,
  ],
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalBasicComponent {
  basicModal = viewChild.required<SdModal>('basicModal');

  pageDescription = signal(
    '<sd-modal> cơ bản — dùng `#ref` để gọi `.open()` / `.close()` imperative. Mặc định cho phép đóng qua nút X và click backdrop. Toggle các thuộc tính để xem ảnh hưởng.'
  );

  modalTitle = signal('Modal cơ bản');
  width = signal('560px');
  height = signal('auto');
  hideClose = signal(false);
  disableBackdropClose = signal(false);

  widthOptions = [
    { id: '420px', name: '420px — Nhỏ' },
    { id: '560px', name: '560px — Vừa (mặc định)' },
    { id: '720px', name: '720px — Lớn' },
    { id: '90vw', name: '90vw — Toàn màn hình' },
  ];

  heightOptions = [
    { id: 'auto', name: 'auto — Tự fit content' },
    { id: '320px', name: '320px — Cố định nhỏ' },
    { id: '70vh', name: '70vh — Theo viewport' },
  ];

  lastClosedAt = signal('—');

  htmlCode = computed(() => `<sd-button title="Mở modal" (click)="modal.open()"></sd-button>

<sd-modal
  #modal
  title="${this.modalTitle()}"
  width="${this.width()}"
  height="${this.height()}"
  [hideClose]="${this.hideClose()}"
  [disableBackdropClose]="${this.disableBackdropClose()}"
  (sdClosed)="onClosed()">

  <p>Nội dung modal đặt vào default slot &lt;ng-content&gt;.</p>

  <div sdFooter>
    <sd-button title="Đóng" type="outline" (click)="modal.close()"></sd-button>
  </div>
</sd-modal>`);

  tsCode = `import { viewChild } from '@angular/core';
import { SdModal } from '@sdcorejs/angular/components/modal';

@Component({
  imports: [SdButton, SdModal],
  // ...
})
export class MyComponent {
  modal = viewChild.required<SdModal>('modal');

  openModal() {
    this.modal().open();
  }

  // Đóng từ ngoài bằng API:
  closeModal() {
    this.modal().close();
  }

  onClosed() {
    // Trigger khi modal đóng (X / backdrop / .close())
  }
}`;

  openBasic(): void {
    this.basicModal().open();
  }

  onBasicClosed(): void {
    this.lastClosedAt.set(new Date().toLocaleTimeString('vi-VN'));
  }
}
