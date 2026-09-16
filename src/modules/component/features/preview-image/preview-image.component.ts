import { DemoPropertyComponent } from '../../../../app/components/demo-property/demo-property.component';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdModal } from '@sdcorejs/angular/components/modal';
import { NormalizedImage, SdPreviewImage, ThumbnailPosition } from '@sdcorejs/angular/components/preview';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

type ImageSet = 'multi' | 'single' | 'empty' | 'broken' | 'mixed';

@Component({
  selector: 'app-preview-image-demo',
  standalone: true,
  imports: [
    DemoPropertyComponent,
    CommonModule,
    FormsModule,
    SdButton,
    SdCodeEditor,
    SdModal,
    SdPageComponent,
    SdPreviewImage,
    SdSection,
    SdSelect,
    SdSwitch,
    SdInput,
  ],
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewImageDemoComponent {
  // ── Modal ref (consumer-wrapping pattern) ──────────────────────────────────
  modal = viewChild.required<SdModal>('previewModal');

  // ── Data sets ──────────────────────────────────────────────────────────────
  readonly imageSets: Record<ImageSet, string[]> = {
    multi: [
      'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221600%22%20height%3D%221000%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e8f0fa%22%2F%3E%3Ccircle%20cx%3D%2250%25%22%20cy%3D%2242%25%22%20r%3D%22200%22%20fill%3D%22%238eb9dd%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2275%25%22%20text-anchor%3D%22middle%22%20font-size%3D%2270%22%20fill%3D%22%23234567%22%3ESample%20sd1%3C%2Ftext%3E%3C%2Fsvg%3E',
      'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221200%22%20height%3D%221600%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e8f0fa%22%2F%3E%3Ccircle%20cx%3D%2250%25%22%20cy%3D%2242%25%22%20r%3D%22200%22%20fill%3D%22%238eb9dd%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2275%25%22%20text-anchor%3D%22middle%22%20font-size%3D%2270%22%20fill%3D%22%23234567%22%3ESample%20sd2%3C%2Ftext%3E%3C%2Fsvg%3E',
      'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%222000%22%20height%3D%221200%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e8f0fa%22%2F%3E%3Ccircle%20cx%3D%2250%25%22%20cy%3D%2242%25%22%20r%3D%22200%22%20fill%3D%22%238eb9dd%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2275%25%22%20text-anchor%3D%22middle%22%20font-size%3D%2270%22%20fill%3D%22%23234567%22%3ESample%20sd3%3C%2Ftext%3E%3C%2Fsvg%3E',
      'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221400%22%20height%3D%221400%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e8f0fa%22%2F%3E%3Ccircle%20cx%3D%2250%25%22%20cy%3D%2242%25%22%20r%3D%22200%22%20fill%3D%22%238eb9dd%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2275%25%22%20text-anchor%3D%22middle%22%20font-size%3D%2270%22%20fill%3D%22%23234567%22%3ESample%20sd4%3C%2Ftext%3E%3C%2Fsvg%3E',
      'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221800%22%20height%3D%22900%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e8f0fa%22%2F%3E%3Ccircle%20cx%3D%2250%25%22%20cy%3D%2242%25%22%20r%3D%22200%22%20fill%3D%22%238eb9dd%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2275%25%22%20text-anchor%3D%22middle%22%20font-size%3D%2270%22%20fill%3D%22%23234567%22%3ESample%20sd5%3C%2Ftext%3E%3C%2Fsvg%3E',
      'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221000%22%20height%3D%221500%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e8f0fa%22%2F%3E%3Ccircle%20cx%3D%2250%25%22%20cy%3D%2242%25%22%20r%3D%22200%22%20fill%3D%22%238eb9dd%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2275%25%22%20text-anchor%3D%22middle%22%20font-size%3D%2270%22%20fill%3D%22%23234567%22%3ESample%20sd6%3C%2Ftext%3E%3C%2Fsvg%3E',
    ],
    single: [
      'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221920%22%20height%3D%221080%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e8f0fa%22%2F%3E%3Ccircle%20cx%3D%2250%25%22%20cy%3D%2242%25%22%20r%3D%22200%22%20fill%3D%22%238eb9dd%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2275%25%22%20text-anchor%3D%22middle%22%20font-size%3D%2270%22%20fill%3D%22%23234567%22%3ESample%20single%3C%2Ftext%3E%3C%2Fsvg%3E',
    ],
    empty: [],
    broken: ['https://example.invalid/not-a-real-image-1.jpg', 'https://example.invalid/not-a-real-image-2.jpg'],
    mixed: [
      'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221600%22%20height%3D%221000%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e8f0fa%22%2F%3E%3Ccircle%20cx%3D%2250%25%22%20cy%3D%2242%25%22%20r%3D%22200%22%20fill%3D%22%238eb9dd%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2275%25%22%20text-anchor%3D%22middle%22%20font-size%3D%2270%22%20fill%3D%22%23234567%22%3ESample%20mix1%3C%2Ftext%3E%3C%2Fsvg%3E',
      'https://example.invalid/broken.jpg',
      'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221200%22%20height%3D%22800%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e8f0fa%22%2F%3E%3Ccircle%20cx%3D%2250%25%22%20cy%3D%2242%25%22%20r%3D%22200%22%20fill%3D%22%238eb9dd%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2275%25%22%20text-anchor%3D%22middle%22%20font-size%3D%2270%22%20fill%3D%22%23234567%22%3ESample%20mix3%3C%2Ftext%3E%3C%2Fsvg%3E',
    ],
  };

  setOptions = [
    { id: 'multi', name: 'multi (6 ảnh)' },
    { id: 'single', name: 'single (1 ảnh)' },
    { id: 'empty', name: 'empty (rỗng)' },
    { id: 'broken', name: 'broken (URL hỏng)' },
    { id: 'mixed', name: 'mixed (kết hợp)' },
  ];

  thumbOptions = [
    { id: 'bottom', name: 'bottom — Mặc định' },
    { id: 'right', name: 'right' },
    { id: 'left', name: 'left' },
    { id: 'top', name: 'top' },
    { id: 'dots', name: 'dots — Chấm tròn' },
    { id: 'none', name: 'none — Ẩn thumbnail' },
  ];

  themeOptions = [
    { id: 'dark', name: 'dark — Mặc định' },
    { id: 'light', name: 'light' },
  ];

  // ── State signals ──────────────────────────────────────────────────────────
  imageSet = signal<ImageSet>('multi');
  thumbnailPosition = signal<ThumbnailPosition>('bottom');
  loop = signal(true);
  showToolbar = signal(true);
  zoomable = signal(true);
  downloadable = signal(true);
  titleOverride = signal('');
  theme = signal<'dark' | 'light'>('dark');

  // Event log
  lastClose = signal('—');
  lastActiveIndex = signal(0);
  lastDownload = signal('—');
  lastError = signal('—');

  // ── Derived ────────────────────────────────────────────────────────────────
  currentItems = computed(() => this.imageSets[this.imageSet()]);
  currentTitle = computed(() => this.titleOverride().trim() || undefined);

  pageDescription = signal(
    '<sd-preview-image> là viewer ảnh inline — input mảng URL/File, hỗ trợ zoom, xoay, fullscreen, download, thumbnail. Component không tự bọc modal — consumer chủ động đặt vào <sd-modal> nếu cần lightbox.'
  );

  // ── Generated TS code ──────────────────────────────────────────────────────
  tsCode = computed(
    () => `import { SdPreviewImage } from '@sdcorejs/angular/components/preview';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [SdPreviewImage],
  template: \`
    <sd-preview-image
      [items]="images"
      [thumbnailPosition]="'${this.thumbnailPosition()}'"
      [showToolbar]="${this.showToolbar()}"
      [zoomable]="${this.zoomable()}"
      [downloadable]="${this.downloadable()}"
      [loop]="${this.loop()}"
      [theme]="'${this.theme()}'"
      [title]="${this.currentTitle() ? `'${this.currentTitle()}'` : 'undefined'}"
      (close)="onClose()"
      (activeIndexChange)="onActiveIndex($event)"
      (download)="onDownload($event)"
      (imageError)="onError($event)">
    </sd-preview-image>
  \` })
export class ImageViewerComponent {
  // PreviewItem = string | File | { url?, file?, name?, caption?, alt?, mime? }
  images = [
    'https://cdn.example.vn/1.jpg',
    'https://cdn.example.vn/2.jpg',
    { url: 'https://cdn.example.vn/3.jpg', name: 'banner.jpg', caption: 'Khuyến mãi' },
  ];

  onClose() {}
  onActiveIndex(i: number) {}
  onDownload(e: { index: number; item: NormalizedImage }) {}
  onError(e: { index: number; reason: string }) {}
}`
  );

  // ── Event handlers ─────────────────────────────────────────────────────────
  onClose(): void {
    this.lastClose.set(new Date().toLocaleTimeString('vi-VN'));
  }

  onActiveIndex(i: number): void {
    this.lastActiveIndex.set(i);
  }

  onDownload(e: { index: number; item: NormalizedImage }): void {
    this.lastDownload.set(`#${e.index}: ${e.item.name}`);
  }

  onError(e: { index: number; reason: string }): void {
    this.lastError.set(`#${e.index}: ${e.reason}`);
  }

  openModal(): void {
    this.modal().open();
  }

  closeModal(): void {
    this.modal().close();
    this.onClose();
  }
}

SdTabComponent({ component: PreviewImageDemoComponent, name: 'sd-preview-image — Viewer ảnh', icon: 'widgets' })(PreviewImageDemoComponent);
