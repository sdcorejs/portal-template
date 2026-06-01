import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection, SdSectionItem } from '@sdcorejs/angular/components/section';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdLabel } from '@sdcorejs/angular/forms/label';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

@Component({
  selector: 'app-section-item-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdSection,
    SdSectionItem,
    SdCodeEditor,
    SdPageComponent,
    SdInput,
    SdSwitch,
    SdLabel,
  ],
  templateUrl: './section-item.component.html',
  styleUrls: ['./section-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionItemDemoComponent {
  pageDescription = signal(
    'SdSectionItem dùng bên trong sd-section để trình bày dữ liệu theo dạng nhãn–giá trị. ' +
      'Luôn bật noPaddingBody trên sd-section để border giữa các item hiển thị liền mạch hết chiều rộng. ' +
      'Tùy chỉnh độ rộng cột nhãn qua labelWidth (mặc định 150px).'
  );

  // ── Interactive config ────────────────────────────────────────────────────
  noPaddingBody = signal(true);
  labelWidth = signal('150px');

  // ── Static code examples ──────────────────────────────────────────────────
  htmlGoodCode = `<!-- ✅ Đúng: noPaddingBody + sd-section-item -->
<sd-section title="Thông tin khách hàng" icon="person" noPaddingBody>
  <sd-section-item label="Họ và tên">Nguyễn Văn A</sd-section-item>
  <sd-section-item label="Email">nguyen.van.a@email.com</sd-section-item>
  <sd-section-item label="Số điện thoại">0901 234 567</sd-section-item>
  <sd-section-item label="Địa chỉ">123 Đường ABC, Quận 1, TP.HCM</sd-section-item>
</sd-section>`;

  htmlLabelWidthCode = `<!-- Tuỳ chỉnh labelWidth cho từng item hoặc đồng bộ toàn bộ -->
<sd-section title="Thông tin hợp đồng" icon="description" noPaddingBody>
  <!-- labelWidth mặc định: 150px -->
  <sd-section-item label="Số hợp đồng">HD-2025-001</sd-section-item>

  <!-- Tăng labelWidth khi nhãn dài hơn -->
  <sd-section-item label="Ngày ký hợp đồng" labelWidth="180px">
    01/01/2025
  </sd-section-item>

  <!-- Giá trị có thể là bất kỳ template nào -->
  <sd-section-item label="Trạng thái" labelWidth="180px">
    <span style="color: #16a34a; font-weight: 500;">Đang hiệu lực</span>
  </sd-section-item>
</sd-section>`;

  tsCode = `import { Component } from '@angular/core';
import { SdSection, SdSectionItem } from '@sdcorejs/angular/components/section';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdSection, SdSectionItem],
  templateUrl: './my-component.component.html',
})
export class MyComponent {}`;
}
