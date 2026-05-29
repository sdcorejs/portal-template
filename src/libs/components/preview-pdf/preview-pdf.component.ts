import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sd-angular/core/components/button';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdModal } from '@sd-angular/core/components/modal';
import {
  PdfErrorEvent,
  PdfLoadEvent,
  PdfSidebarMode,
  PdfSource,
  PdfZoomMode,
  SdPreviewPdf,
} from '@sd-angular/core/components/preview';
import { SdSection } from '@sd-angular/core/components/section';
import { SdInput } from '@sd-angular/core/forms/input';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdSwitch } from '@sd-angular/core/forms/switch';
import { SdPageComponent } from '@sd-angular/core/modules/layout';

type PdfSet = 'sample' | 'small' | 'empty' | 'broken';

@Component({
  selector: 'app-preview-pdf-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdButton,
    SdCodeEditor,
    SdModal,
    SdPageComponent,
    SdPreviewPdf,
    SdSection,
    SdSelect,
    SdSwitch,
    SdInput,
  ],
  templateUrl: './preview-pdf.component.html',
  styleUrls: ['./preview-pdf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewPdfDemoComponent {
  modal = viewChild.required<SdModal>('previewModal');

  // ── Data sets ──────────────────────────────────────────────────────────────
  readonly pdfSets: Record<PdfSet, PdfSource | null> = {
    sample: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    small: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/test/pdfs/basicapi.pdf',
    empty: null,
    broken: 'https://example.invalid/not-a-real.pdf',
  };

  setOptions = [
    { id: 'sample', name: 'sample — Mozilla TraceMonkey (~14 trang)' },
    { id: 'small', name: 'small — basicapi.pdf' },
    { id: 'empty', name: 'empty — Source null (placeholder)' },
    { id: 'broken', name: 'broken — URL hỏng (error state)' },
  ];

  sidebarOptions = [
    { id: 'thumbnails', name: 'thumbnails — Mặc định' },
    { id: 'outline', name: 'outline (placeholder)' },
    { id: 'search', name: 'search (placeholder)' },
    { id: 'none', name: 'none — Ẩn sidebar' },
  ];

  zoomOptions = [
    { id: 'page-fit', name: 'page-fit — Vừa khung' },
    { id: 'page-width', name: 'page-width — Khớp chiều ngang' },
    { id: 'page-actual', name: 'page-actual — 100%' },
    { id: '1', name: '1.0x' },
    { id: '1.5', name: '1.5x' },
    { id: '2', name: '2.0x' },
  ];

  themeOptions = [
    { id: 'dark', name: 'dark — Mặc định' },
    { id: 'light', name: 'light' },
  ];

  // ── State signals ──────────────────────────────────────────────────────────
  pdfSet = signal<PdfSet>('sample');
  sidebar = signal<PdfSidebarMode>('thumbnails');
  sidebarOpen = signal(true);
  initialZoomId = signal('page-fit');
  showToolbar = signal(true);
  downloadable = signal(true);
  titleOverride = signal('');
  theme = signal<'dark' | 'light'>('dark');

  uploadedFile = signal<File | null>(null);

  // Event log
  lastClose = signal('—');
  lastLoaded = signal('—');
  lastPage = signal(1);
  lastZoom = signal(1);
  lastDownload = signal('—');
  lastError = signal('—');

  pageDescription = signal(
    '<sd-preview-pdf> viewer PDF chạy bằng pdf.js — input là URL / File / Blob / ArrayBuffer / Uint8Array. Hỗ trợ thumbnail sidebar, search, zoom (page-fit / width / actual / số cụ thể), download, fullscreen. Như preview-image, không tự bọc modal.'
  );

  // ── Derived ────────────────────────────────────────────────────────────────
  currentSource = computed<PdfSource | null>(() => {
    const f = this.uploadedFile();
    if (f) return f;
    return this.pdfSets[this.pdfSet()];
  });

  currentTitle = computed(() => this.titleOverride().trim() || undefined);

  initialZoom = computed<PdfZoomMode>(() => {
    const id = this.initialZoomId();
    if (id === 'page-fit' || id === 'page-width' || id === 'page-actual') return id;
    return Number(id);
  });

  // ── Generated TS code ──────────────────────────────────────────────────────
  tsCode = computed(() => `import { SdPreviewPdf, PdfLoadEvent, PdfErrorEvent } from '@sd-angular/core/components/preview';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [SdPreviewPdf],
  template: \`
    <sd-preview-pdf
      [source]="pdfSource"
      [sidebar]="'${this.sidebar()}'"
      [sidebarOpen]="${this.sidebarOpen()}"
      [initialZoom]="${typeof this.initialZoom() === 'string' ? `'${this.initialZoom()}'` : this.initialZoom()}"
      [showToolbar]="${this.showToolbar()}"
      [downloadable]="${this.downloadable()}"
      [theme]="'${this.theme()}'"
      [title]="${this.currentTitle() ? `'${this.currentTitle()}'` : 'undefined'}"
      (loaded)="onLoaded($event)"
      (pageChange)="onPage($event)"
      (zoomChange)="onZoom($event)"
      (download)="onDownload($event)"
      (loadError)="onError($event)"
      (close)="onClose()">
    </sd-preview-pdf>
  \`,
})
export class PdfViewerComponent {
  // PdfSource = string | File | Blob | ArrayBuffer | Uint8Array |
  //             { url, httpHeaders?, withCredentials? } |
  //             { data: ArrayBuffer | Uint8Array }
  pdfSource: PdfSource = 'https://cdn.example.vn/docs/report.pdf';

  onLoaded(e: PdfLoadEvent)   { /* e.totalPages, e.meta */ }
  onPage(p: number)            { /* current page */ }
  onZoom(z: number)            { /* scale 0.25 → 4 */ }
  onDownload(e: { filename }) {}
  onError(e: PdfErrorEvent)    { /* reason: invalid|password|network|unknown */ }
  onClose()                    {}
}`);

  // ── Event handlers ─────────────────────────────────────────────────────────
  onFilePick(event: Event): void {
    const input = event.target as HTMLInputElement;
    const f = input.files?.[0] ?? null;
    this.uploadedFile.set(f);
  }

  clearFile(): void {
    this.uploadedFile.set(null);
  }

  onClose(): void {
    this.lastClose.set(new Date().toLocaleTimeString('vi-VN'));
  }

  onLoaded(e: PdfLoadEvent): void {
    this.lastLoaded.set(`${e.totalPages} trang — title="${e.meta.title ?? ''}"`);
  }

  onPage(p: number): void {
    this.lastPage.set(p);
  }

  onZoom(z: number): void {
    this.lastZoom.set(Math.round(z * 100) / 100);
  }

  onDownload(e: { filename: string }): void {
    this.lastDownload.set(e.filename);
  }

  onError(e: PdfErrorEvent): void {
    this.lastError.set(`${e.reason}: ${e.message ?? ''}`);
  }

  openModal(): void {
    this.modal().open();
  }

  closeModal(): void {
    this.modal().close();
    this.onClose();
  }
}
