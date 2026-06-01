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
  selector: 'app-side-drawer-loading',
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
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideDrawerLoadingComponent {
  drawer = viewChild.required<SdSideDrawer>('drawer');

  pageDescription = signal(
    'Overlay Loading: Cung cấp tính năng vô hiệu hóa tạm thời tương tác trên Side Drawer bằng cách kích hoạt loading spinner từ loadingService của Core UI.'
  );

  drawerTitle = signal('Đang tải dữ liệu');
  width = signal('420px');
  hideClose = signal(false);
  disableBackdropClose = signal(true);

  widthOptions = [
    { id: '420px', name: '420px - Mặc định' },
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
  
  <div class="px-24 py-40 d-flex flex-column align-items-center justify-content-center text-center gap-12">
    <span class="material-icons-outlined text-secondary" style="font-size: 40px;">hourglass_top</span>
    <div class="T14M">Overlay loading sẽ tự tắt sau khoảng 1.8 giây.</div>
    <div class="T12R text-secondary">
      Demo này phù hợp cho trường hợp mở drawer trước rồi tải dữ liệu chi tiết sau từ API.
    </div>
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

  async openWithLoading() {
    // 1. Mở drawer để người dùng thấy khung UI
    this.drawer().open();
    
    // 2. Kích hoạt overlay load trong quá trình call API
    this.drawer().startLoading();

    try {
      await this.fetchDetail();
    } finally {
      // 3. Tắt trạng thái loading sau khi có dữ liệu
      this.drawer().stopLoading();
    }
  }

  private fetchDetail() {
    return new Promise((resolve) => setTimeout(resolve, 1800));
  }
}`;

  openLoadingDrawer(): void {
    this.lastClosedMessage.set('Đang trình diễn loading... chờ 1.8s');
    
    this.drawer().open();
    this.drawer().startLoading();

    setTimeout(() => {
      this.drawer().stopLoading();
    }, 1800);
  }

  handleDrawerClosed(): void {
    this.lastClosedMessage.set('Drawer đã đóng lúc ' + new Date().toLocaleTimeString('vi-VN') + '.');
  }
}
