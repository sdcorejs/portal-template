import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdAnchorItem, SdAnchor } from '@sd-angular/core/components/anchor';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection, SdSectionItem } from '@sd-angular/core/components/section';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdSwitch } from '@sd-angular/core/forms/switch';
import { SdPageComponent } from '@sd-angular/core/modules/layout';

@Component({
  selector: 'app-anchor-with-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdAnchor,
    SdAnchorItem,
    SdCodeEditor,
    SdPageComponent,
    SdSection,
    SdSectionItem,
    SdSelect,
    SdSwitch,
  ],
  templateUrl: './with-section.component.html',
  styleUrls: ['./with-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnchorWithSectionComponent {
  pageDescription = signal(
    'Kết hợp sd-anchor với sd-section để tạo giao diện chuyên nghiệp cho các trang tài liệu, hướng dẫn, hoặc FAQ.'
  );

  // ── Config signals ────────────────────────────────────────────────────────
  sidebarWidth = signal('220px');
  ellipsis = signal(false);
  showIcons = signal(true);
  noPaddingBody = signal(true);
  containerHeight = signal('700px');

  sidebarWidthOptions = [
    { id: '180px', name: '180px' },
    { id: '220px', name: '220px (mặc định)' },
    { id: '260px', name: '260px' },
    { id: '300px', name: '300px' },
  ];

  containerHeightOptions = [
    { id: '500px', name: '500px' },
    { id: '600px', name: '600px' },
    { id: '700px', name: '700px (mặc định)' },
    { id: '800px', name: '800px' },
    { id: '100%', name: '100%' },
  ];

  htmlCode = `<div style="height: 700px">
  <sd-anchor 
    [sidebarWidth]="'220px'"
    [ellipsis]="false">
    
    <sd-anchor-item [title]="'Giới thiệu sản phẩm'" [icon]="'info'">
      <sd-section title="Giới thiệu sản phẩm" icon="info" subTitle="Tìm hiểu thêm về sản phẩm của chúng tôi" [noPaddingBody]="true">
        <sd-section-item label="Mô tả" labelWidth="180px">Nội dung giới thiệu sản phẩm...</sd-section-item>
        <sd-section-item label="Giá trị" labelWidth="180px">Dễ điều hướng, rõ ràng và dễ mở rộng.</sd-section-item>
      </sd-section>
    </sd-anchor-item>

    <sd-anchor-item [title]="'Hướng dẫn cài đặt'" [icon]="'download'">
      <sd-section title="Hướng dẫn cài đặt" icon="download" subTitle="Các bước cài đặt từng bước" [noPaddingBody]="true">
        <sd-section-item label="Bước 1: Tải về" labelWidth="180px">Tải các tệp cần thiết...</sd-section-item>
        <sd-section-item label="Bước 2: Cài đặt" labelWidth="180px">Chạy trình cài đặt...</sd-section-item>
        <sd-section-item label="Bước 3: Cấu hình" labelWidth="180px">Cấu hình các tùy chọn...</sd-section-item>
      </sd-section>
    </sd-anchor-item>

    <sd-anchor-item [title]="'Tính năng nâng cao'" [icon]="'star'">
      <sd-section title="Tính năng nâng cao" icon="star" [noPaddingBody]="true">
        <sd-section-item label="Tính năng 1" labelWidth="180px">Mô tả tính năng 1...</sd-section-item>
        <sd-section-item label="Tính năng 2" labelWidth="180px">Mô tả tính năng 2...</sd-section-item>
      </sd-section>
    </sd-anchor-item>

    <sd-anchor-item [title]="'FAQ & Hỗ trợ'" [icon]="'help'">
      <sd-section title="FAQ & Hỗ trợ" icon="help" [noPaddingBody]="true">
        <sd-section-item label="Câu hỏi 1" labelWidth="180px">Trả lời cho câu hỏi 1...</sd-section-item>
        <sd-section-item label="Câu hỏi 2" labelWidth="180px">Trả lời cho câu hỏi 2...</sd-section-item>
      </sd-section>
    </sd-anchor-item>
  </sd-anchor>
</div>`;

  tsCode = `import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SdAnchor, SdAnchorItem } from '@sd-angular/core/components/anchor';
import { SdSection, SdSectionItem } from '@sd-angular/core/components/section';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [SdAnchor, SdAnchorItem, SdSection, SdSectionItem],
  template: \`
    <div style="height: 700px">
      <sd-anchor [sidebarWidth]="'220px'">
        
        <sd-anchor-item [title]="'Giới thiệu'" [icon]="'info'">
          <sd-section title="Giới thiệu" icon="info" [noPaddingBody]="true">
            <sd-section-item label="Mô tả" labelWidth="160px">Nội dung giới thiệu...</sd-section-item>
          </sd-section>
        </sd-anchor-item>

        <sd-anchor-item [title]="'Hướng dẫn'" [icon]="'book'">
          <sd-section title="Hướng dẫn" [noPaddingBody]="true">
            <sd-section-item label="Bước 1" labelWidth="160px">Nội dung bước 1...</sd-section-item>
            <sd-section-item label="Bước 2" labelWidth="160px">Nội dung bước 2...</sd-section-item>
          </sd-section>
        </sd-anchor-item>
      </sd-anchor>
    </div>
  \`
})
export class DocumentationComponent {}`;
}
