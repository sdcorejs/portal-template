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
      'https://picsum.photos/seed/sd1/1600/1000',
      'https://picsum.photos/seed/sd2/1200/1600',
      'https://picsum.photos/seed/sd3/2000/1200',
      'https://picsum.photos/seed/sd4/1400/1400',
      'https://picsum.photos/seed/sd5/1800/900',
      'https://picsum.photos/seed/sd6/1000/1500',
    ],
    single: ['https://picsum.photos/seed/single/1920/1080'],
    empty: [],
    broken: [
      'https://example.invalid/not-a-real-image-1.jpg',
      'https://example.invalid/not-a-real-image-2.jpg',
    ],
    mixed: [
      'https://picsum.photos/seed/mix1/1600/1000',
      'https://example.invalid/broken.jpg',
      'https://picsum.photos/seed/mix3/1200/800',
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
  tsCode = computed(() => `import { SdPreviewImage } from '@sdcorejs/angular/components/preview';

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
  \`,
})
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
}`);

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
