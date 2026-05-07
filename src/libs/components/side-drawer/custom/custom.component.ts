import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sd-angular/core/components/button';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection } from '@sd-angular/core/components/section';
import { SdSideDrawer } from '@sd-angular/core/components/side-drawer';
import { SdInput } from '@sd-angular/core/forms/input';
import { SdLabel } from '@sd-angular/core/forms/label';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdSwitch } from '@sd-angular/core/forms/switch';
import { SdPageComponent } from '@sd-angular/core/modules/layout';

@Component({
  selector: 'app-side-drawer-custom',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdButton,
    SdCodeEditor,
    SdPageComponent,
    SdSection,
    SdSideDrawer,
    SdInput,
    SdSelect,
    SdSwitch,
    SdLabel,
  ],
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideDrawerCustomComponent {
  drawer = viewChild.required<SdSideDrawer>('drawer');

  pageDescription = signal(
    'Tùy biến Custom Style: Ghi đè class css toàn cục cho tính linh hoạt cao nhất thông qua drawerClass property.'
  );

  drawerTitle = signal('Cài đặt hệ thống');
  width = signal('460px');
  hideClose = signal(false);
  disableBackdropClose = signal(false);

  widthOptions = [
    { id: '360px', name: '360px - Gọn' },
    { id: '460px', name: '460px - Mặc định' },
    { id: '640px', name: '640px - Rộng' },
  ];

  lastClosedMessage = signal('Chưa có thao tác đóng drawer.');

  htmlCode = computed(() => {
    return `<sd-side-drawer
  #drawer
  [title]="'${this.drawerTitle()}'"
  [width]="'${this.width()}'"
  [hideClose]="${this.hideClose()}"
  [disableBackdropClose]="${this.disableBackdropClose()}"
  [drawerClass]="'my-custom-drawer-style'">
  
  <div class="p-24">
    <p>Thuộc tính custom.</p>
  </div>

  <div sdFooter>
    <div class="d-flex justify-content-end gap-8 px-16">
      <sd-button title="Hủy bỏ" type="outline" color="secondary" (click)="drawer.close()"></sd-button>
      <sd-button title="Tiếp tục" color="primary"></sd-button>
    </div>
  </div>
</sd-side-drawer>`;
  });

  scssCode = `/* 
 * Truy cập các class gốc của drawer bằng ::ng-deep 
 * kết hợp giới hạn chỉ số override bên dưới my-custom-drawer-style
 */
::ng-deep .my-custom-drawer-style {
  .sd-side-drawer-header {
    background-color: #e0f2fe; /* Xanh nhat */
    border-bottom: 1px solid #bae6fd;
  }
  
  .sd-side-drawer-title {
    color: #0369a1 !important; /* Xanh dam */
    font-weight: 700;
  }
  
  .sd-side-drawer-body {
    background-color: #f0f9ff;
  }

  .sd-side-drawer-footer {
    background-color: #e0f2fe;
    border-top: 1px solid #bae6fd;
  }
}`;

  tsCode = `import { Component, viewChild } from '@angular/core';
import { SdButton } from '@sd-angular/core/components/button';
import { SdSideDrawer } from '@sd-angular/core/components/side-drawer';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdButton, SdSideDrawer],
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss'],
})
export class MyComponent {
  drawer = viewChild.required<SdSideDrawer>('drawer');

  openDetail() {
    this.drawer().open();
  }
}`;

  openDrawer(): void {
    this.lastClosedMessage.set('Đang xem giao diện custom.');
    this.drawer().open();
  }

  handleDrawerClosed(): void {
    this.lastClosedMessage.set('Drawer custom đã đóng lúc ' + new Date().toLocaleTimeString('vi-VN') + '.');
  }
}
