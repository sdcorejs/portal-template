import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal, viewChild } from '@angular/core';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdImageEditor, type SdImageEditorOption, type SdImageEditorResult } from '@sdcorejs/angular/components/image-editor';
import { I18nService } from '@sdcorejs/angular/i18n';
import { BrowserUtilities } from '@sdcorejs/utils/fns';
import { DemoLabFrameComponent } from '../../../../shared/demo-lab/demo-lab-frame.component';

@Component({
  selector: 'app-image-editor-demo',
  standalone: true,
  imports: [DemoLabFrameComponent, SdButton, SdImageEditor],
  templateUrl: './image-editor.component.html',
  styleUrls: ['../../../../shared/demo-lab/demo-lab.scss', './image-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageEditorDemoComponent {
  readonly i18n = inject(I18nService);
  readonly editor = viewChild(SdImageEditor);
  readonly source = signal<Blob | null>(null);
  readonly result = signal<SdImageEditorResult | null>(null);
  readonly resultUrl = signal<string | null>(null);
  readonly seeding = signal(false);
  readonly seedError = signal(false);
  readonly exportError = signal(false);
  readonly exportLocked = signal(false);
  private generation = 0;
  private destroyed = false;
  readonly option: SdImageEditorOption = {
    autoId: 'successor-image',
    historyLimit: 20,
    output: { format: 'image/png', formats: ['image/png'], resultType: 'blob', fileName: 'harbor-asset' },
    limits: { maxSourceSize: 4 * 1024 * 1024, maxSourcePixels: 2_000_000, maxOutputPixels: 2_000_000 },
  };
  readonly status = computed(() => (this.seeding() ? 'loading' : (this.editor()?.status() ?? 'empty')));
  readonly editsJson = computed(() => JSON.stringify(this.editor()?.edits() ?? null, null, 2));
  readonly canExport = computed(() => this.status() === 'ready' && !this.exportLocked());

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.generation++;
      this.clearResult();
    });
  }

  t(vi: string, en: string): string {
    return this.i18n.language() === 'en' ? en : vi;
  }

  statusLabel(): string {
    switch (this.status()) {
      case 'loading':
        return this.t('Đang tạo hoặc giải mã ảnh…', 'Creating or decoding the image…');
      case 'ready':
        return this.t('Sẵn sàng chỉnh sửa', 'Ready to edit');
      case 'exporting':
        return this.t('Đang mã hóa kết quả…', 'Encoding the result…');
      case 'error':
        return this.t('Ảnh không hợp lệ. Nạp ảnh mẫu để thử lại.', 'The image is invalid. Load the sample to retry.');
      default:
        return this.t('Chưa có ảnh. Nạp ảnh tài sản mẫu để bắt đầu.', 'No image yet. Load the sample asset image to begin.');
    }
  }

  private clearResult(): void {
    const url = this.resultUrl();
    if (url) URL.revokeObjectURL(url);
    this.resultUrl.set(null);
    this.result.set(null);
  }

  reset(): void {
    this.generation++;
    this.source.set(null);
    this.clearResult();
    this.seeding.set(false);
    this.seedError.set(false);
    this.exportError.set(false);
    this.exportLocked.set(false);
  }

  invalidSource(): void {
    this.reset();
    this.source.set(new Blob(['This fictional asset file has no image bytes.'], { type: 'image/png' }));
  }

  async loadSample(): Promise<void> {
    this.reset();
    const generation = this.generation;
    this.seeding.set(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 400;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas unavailable');
      context.fillStyle = '#e4eef5';
      context.fillRect(0, 0, 640, 400);
      context.fillStyle = '#1a4d66';
      context.fillRect(64, 60, 512, 260);
      context.fillStyle = '#87bccc';
      context.fillRect(96, 94, 150, 180);
      context.fillStyle = '#ffffff';
      context.fillRect(278, 108, 258, 18);
      context.fillRect(278, 150, 214, 18);
      context.fillRect(278, 192, 174, 18);
      context.fillStyle = '#223d4b';
      context.font = 'bold 24px sans-serif';
      context.fillText('HARBOR · AST-201', 64, 364);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(value => (value ? resolve(value) : reject(new Error('PNG encoding failed'))), 'image/png');
      });
      if (!this.destroyed && generation === this.generation) this.source.set(blob);
    } catch {
      if (!this.destroyed && generation === this.generation) this.seedError.set(true);
    } finally {
      if (!this.destroyed && generation === this.generation) this.seeding.set(false);
    }
  }

  async exportResult(): Promise<void> {
    const editor = this.editor();
    if (!editor || !this.canExport()) return;
    const generation = this.generation;
    this.exportError.set(false);
    try {
      const result = await editor.getResult();
      if (this.destroyed || generation !== this.generation || this.exportLocked()) return;
      this.clearResult();
      this.result.set(result);
      this.resultUrl.set(URL.createObjectURL(result.blob));
    } catch {
      if (!this.destroyed && generation === this.generation) this.exportError.set(true);
    }
  }

  download(): void {
    const result = this.result();
    if (!result || this.exportLocked()) return;
    try {
      BrowserUtilities.downloadBlob(result.blob, result.fileName);
    } catch {
      this.exportError.set(true);
    }
  }

  readonly code = `import { SdImageEditor } from '@sdcorejs/angular/components/image-editor';
import { BrowserUtilities } from '@sdcorejs/utils/fns';

// <sd-image-editor #editor [source]="sourceBlob" [option]="option" />
option = { output: { format: 'image/png', fileName: 'harbor-asset' } };
async apply(editor: SdImageEditor) {
  const result = await editor.getResult();
  // Consumer owns preview URLs, downloads and persistence.
  BrowserUtilities.downloadBlob(result.blob, result.fileName);
}`;
}

SdTabComponent({ component: ImageEditorDemoComponent, name: 'Image Editor', icon: 'crop' })(ImageEditorDemoComponent);
