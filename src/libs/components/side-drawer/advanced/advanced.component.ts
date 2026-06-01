import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdBadge } from '@sdcorejs/angular/components/badge';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdSideDrawer } from '@sdcorejs/angular/components/side-drawer';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdLabel } from '@sdcorejs/angular/forms/label';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

@Component({
  selector: 'app-side-drawer-advanced',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdBadge,
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
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideDrawerAdvancedComponent {
  drawer = viewChild.required<SdSideDrawer>('drawer');

  pageDescription = signal(
    'Mở rộng (Full Layout): Sử dụng các ng-content: [sdHeaderLeft], [sdHeaderRight], [sdFooter] để xây dựng giao diện chi tiết.'
  );

  drawerTitle = signal('Chi tiết hóa đơn');
  width = signal('560px');
  hideClose = signal(false);
  disableBackdropClose = signal(false);
  showFooterActions = signal(true);

  widthOptions = [
    { id: '400px', name: '400px - Gọn' },
    { id: '560px', name: '560px - Mặc định' },
    { id: '800px', name: '800px - Rộng' },
  ];

  lastClosedMessage = signal('Chưa có thao tác đóng drawer.');

  htmlCode = computed(() => {
    const footerBlock = this.showFooterActions()
      ? `

  <div sdFooter>
    <div class="d-flex justify-content-end gap-8 px-16">
      <sd-button title="Hủy bỏ" type="outline" color="secondary" (click)="drawer.close()"></sd-button>
      <sd-button title="Lưu thông tin" color="primary"></sd-button>
    </div>
  </div>`
      : '';

    return `<sd-side-drawer
  #drawer
  [title]="'${this.drawerTitle()}'"
  [width]="'${this.width()}'"
  [hideClose]="${this.hideClose()}"
  [disableBackdropClose]="${this.disableBackdropClose()}">
  
  <div sdHeaderLeft>
    <div style="margin-left: 8px;">
      <sd-badge type="tag" color="success" [title]="'Đã thanh toán'"></sd-badge>
    </div>
  </div>
  
  <div sdHeaderRight>
    <sd-button title="Tải xuống" size="sm" type="outline" color="secondary"></sd-button>
  </div>

  <div class="p-24">
    <h4 class="mb-8">Nội dung mặc định</h4>
    <p>Phần này tự động được lọt vào <code>.sd-side-drawer-content</code> do là content không định danh.</p>
  </div>${footerBlock}
</sd-side-drawer>`;
  });

  tsCode = `import { Component, viewChild } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdSideDrawer } from '@sdcorejs/angular/components/side-drawer';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdButton, SdSideDrawer],
  templateUrl: './my-component.component.html',
})
export class MyComponent {
  drawer = viewChild.required<SdSideDrawer>('drawer');

  openDetail() {
    this.drawer().open();
  }
}`;

  openDrawer(): void {
    this.lastClosedMessage.set('Đang mở màn hình hóa đơn.');
    this.drawer().open();
  }

  handleDrawerClosed(): void {
    this.lastClosedMessage.set('Drawer đã đóng lúc ' + new Date().toLocaleTimeString('vi-VN') + '.');
  }
}
