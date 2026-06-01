import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-side-drawer-basic',
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
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideDrawerBasicComponent {
  drawer = viewChild.required<SdSideDrawer>('drawer');

  pageDescription = signal(
    'Mặc định (Content thuần): Sử dụng nội dung truyền trực tiếp vào body (thẻ <ng-content> default), không sử dụng sdHeaderLeft, sdHeaderRight, hay sdFooter.'
  );

  drawerTitle = signal('Ghi chú đơn giản');
  width = signal('400px');
  hideClose = signal(false);
  disableBackdropClose = signal(false);

  widthOptions = [
    { id: '360px', name: '360px - Gọn' },
    { id: '400px', name: '400px - Mặc định' },
    { id: '640px', name: '640px - Rộng' },
  ];

  lastClosedMessage = signal('Chưa có thao tác đóng drawer.');

  htmlCode = computed(() => {
    return `<sd-side-drawer
  #drawer
  [title]="'${this.drawerTitle()}'"
  [width]="'${this.width()}'"
  [hideClose]="${this.hideClose()}"
  [disableBackdropClose]="${this.disableBackdropClose()}">
  
  <div class="p-24">
    <p>Tính năng này đã được đơn giản hóa nhờ thẻ <code>&lt;ng-content&gt;</code> mặc định mà không cần bọc qua <code>[sdBody]</code>.</p>
  </div>
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
    this.lastClosedMessage.set('Đang mở drawer cơ bản.');
    this.drawer().open();
  }

  handleDrawerClosed(): void {
    this.lastClosedMessage.set('Drawer đã đóng lúc ' + new Date().toLocaleTimeString('vi-VN') + '.');
  }
}
