import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdModal } from '@sdcorejs/angular/components/modal';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

@Component({
  selector: 'app-modal-view-modes',
  standalone: true,
  imports: [CommonModule, FormsModule, SdButton, SdCodeEditor, SdModal, SdPageComponent, SdSection],
  templateUrl: './view-modes.component.html',
  styleUrls: ['./view-modes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalViewModesComponent {
  dialogModal = viewChild.required<SdModal>('dialogModal');
  bottomSheetModal = viewChild.required<SdModal>('bottomSheetModal');
  colorModal = viewChild.required<SdModal>('colorModal');
  lazyModal = viewChild.required<SdModal>('lazyModal');

  pageDescription = signal(
    'Các biến thể view của sd-modal: dialog (mặc định, center) vs bottom-sheet (slide-up mobile), color (đổi theme header), modalClass (custom class), lazyLoadContent (chỉ render content lần đầu open).'
  );

  // Lazy demo
  lazyOpenCount = signal(0);
  lazyChildRendered = signal(false);

  openDialog(): void {
    this.dialogModal().open();
  }

  openBottomSheet(): void {
    this.bottomSheetModal().open();
  }

  openColor(): void {
    this.colorModal().open();
  }

  openLazy(): void {
    this.lazyOpenCount.update(n => n + 1);
    // Lần đầu mở → content được instantiate (lazyLoadContent=true)
    if (this.lazyOpenCount() === 1) this.lazyChildRendered.set(true);
    this.lazyModal().open();
  }

  dialogCode = `<!-- Dialog (mặc định): căn giữa màn hình, có backdrop tối -->
<sd-modal #m title="Hộp thoại" view="dialog" width="560px">
  Content...
</sd-modal>`;

  bottomSheetCode = `<!-- Bottom-sheet: slide-up từ đáy, ưu tiên mobile -->
<sd-modal #m title="Bộ lọc" view="bottom-sheet" height="60vh">
  Content (filter list, share, action menu...)
</sd-modal>`;

  colorCode = `<!-- color đổi tone header: primary | success | warning | error... -->
<sd-modal #m title="Cảnh báo" color="warning" width="480px">
  Hành động này không thể hoàn tác.
</sd-modal>

<!-- modalClass: thêm class custom cho container, dùng cho theming nâng cao -->
<sd-modal #m title="Branded" [modalClass]="['my-modal', 'my-modal--xl']">
  ...
</sd-modal>`;

  lazyCode = `<!-- lazyLoadContent: chỉ instantiate content lần đầu open(). -->
<!-- Lần đóng/mở sau giữ nguyên DOM → state form không mất. -->
<sd-modal #m title="Form nặng (lazy)" [lazyLoadContent]="true" width="640px">
  <heavy-form-component (rendered)="onChildRender()" />
</sd-modal>

// onChildRender chỉ fire 1 lần — ngay lần open đầu tiên.
// Lần open thứ 2 trở đi không gọi lại — DOM giữ nguyên.`;
}
