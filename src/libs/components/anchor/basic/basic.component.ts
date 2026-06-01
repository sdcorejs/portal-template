import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdAnchorItem, SdAnchor } from '@sdcorejs/angular/components/anchor';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdLabel } from '@sdcorejs/angular/forms/label';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

@Component({
  selector: 'app-anchor-basic',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdAnchor,
    SdAnchorItem,
    SdCodeEditor,
    SdPageComponent,
    SdSection,
    SdInput,
    SdSelect,
    SdSwitch,
    SdLabel,
  ],
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnchorBasicComponent {
  pageDescription = signal(
    '⚠️ Lưu ý: sd-anchor phải được bọc trong thẻ parent có chiều cao cụ thể (height: 100%, 500px, ...) để hoạt động đúng.'
  );

  // ── Config signals ────────────────────────────────────────────────────────
  sidebarWidth = signal('200px');
  ellipsis = signal(false);
  overScroll = signal(false);
  hideNav = signal(false);
  containerHeight = signal('600px');

  sidebarWidthOptions = [
    { id: '150px', name: '150px' },
    { id: '200px', name: '200px (mặc định)' },
    { id: '250px', name: '250px' },
    { id: '300px', name: '300px' },
  ];

  containerHeightOptions = [
    { id: '400px', name: '400px' },
    { id: '500px', name: '500px' },
    { id: '600px', name: '600px (mặc định)' },
    { id: '800px', name: '800px' },
    { id: '100%', name: '100%' },
  ];

  htmlCode = `<div style="height: 600px">
  <sd-anchor 
    [sidebarWidth]="'200px'"
    [ellipsis]="false"
    [overScroll]="false"
    [hideNav]="false">
    
    <sd-anchor-item [title]="'Giới thiệu'">
      <div style="height: 600px; padding: 20px; background: #f5f5f5">
        <h3>Giới thiệu</h3>
        <p>Nội dung phần giới thiệu...</p>
      </div>
    </sd-anchor-item>

    <sd-anchor-item [title]="'Tính năng'" [icon]="'star'">
      <div style="height: 600px; padding: 20px; background: #f5f5f5">
        <h3>Tính năng</h3>
        <p>Nội dung phần tính năng...</p>
      </div>
    </sd-anchor-item>

    <sd-anchor-item [title]="'Hướng dẫn sử dụng'" [icon]="'info'">
      <div style="height: 600px; padding: 20px; background: #f5f5f5">
        <h3>Hướng dẫn sử dụng</h3>
        <p>Nội dung phần hướng dẫn...</p>
      </div>
    </sd-anchor-item>

    <sd-anchor-item [title]="'FAQ'" [icon]="'help'">
      <div style="height: 600px; padding: 20px; background: #f5f5f5">
        <h3>FAQ</h3>
        <p>Nội dung phần câu hỏi thường gặp...</p>
      </div>
    </sd-anchor-item>
  </sd-anchor>
</div>`;

  tsCode = `import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { SdAnchor, SdAnchorItem } from '@sdcorejs/angular/components/anchor';

@Component({
  selector: 'app-anchor-demo',
  standalone: true,
  imports: [SdAnchor, SdAnchorItem],
  template: \`
    <div style="height: 600px">
      <sd-anchor 
        [sidebarWidth]="'200px'"
        [ellipsis]="false"
        [overScroll]="false">
        
        <sd-anchor-item [title]="'Giới thiệu'">
          <div style="height: 600px; padding: 20px">
            Nội dung...
          </div>
        </sd-anchor-item>

        <sd-anchor-item [title]="'Tính năng'" [icon]="'star'">
          <div style="height: 600px; padding: 20px">
            Nội dung...
          </div>
        </sd-anchor-item>
      </sd-anchor>
    </div>
  \`
})
export class AnchorDemoComponent {}`;
}
