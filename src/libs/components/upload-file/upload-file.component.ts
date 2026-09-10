import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal, viewChild, inject, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdUploadFile, SdUploadFileDetail } from '@sdcorejs/angular/components/upload-file';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdInputNumber } from '@sdcorejs/angular/forms/input-number';
import { SdLabel } from '@sdcorejs/angular/forms/label';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

@Component({
  selector: 'app-upload-file-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdButton,
    SdCodeEditor,
    SdPageComponent,
    SdSection,
    SdUploadFile,
    SdInput,
    SdInputNumber,
    SdSelect,
    SdSwitch,
    SdLabel,
  ],
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileDemoComponent {
  upload = viewChild(SdUploadFile);
  private readonly files = new Map<string, SdUploadFileDetail>();
  private counter = 0;
  constructor() {
    inject(DestroyRef).onDestroy(() => {
      for (const file of this.files.values()) if (file.cdn.startsWith('blob:')) URL.revokeObjectURL(file.cdn);
    });
  }
  /** Local session adapter: files stay in this browser, with no upload endpoint. */
  readonly uploadLocal = async (files: File[]) =>
    files.map(file => {
      const key = 'local-' + ++this.counter;
      this.files.set(key, {
        idOrKey: key,
        cdn: URL.createObjectURL(file),
        name: file.name,
        extension: file.name.split('.').pop(),
        size: file.size / 1024 / 1024,
      });
      return key;
    });
  readonly fileDetails = async (keys: (string | number)[]) =>
    keys.map(key => this.files.get(String(key))).filter((file): file is SdUploadFileDetail => !!file);

  pageDescription = signal(
    'Component Upload File thực hiện duyệt duyệt file trong máy tính cục bộ, hỗ trợ Drag & Drop file. Có thể filter các loại extension, loại trừ file, resize tự động, check size tự động và review ảnh trực quan ngay lập tức.'
  );

  label = signal('Đính kèm tài liệu');
  description = signal('');
  typeOptions = [
    { id: 'image', name: 'image - Chuyên tải Ảnh' },
    { id: 'document', name: 'document - Chuyên tải Tài liệu' },
    { id: 'file', name: 'file - Tất cả loại File' },
  ];
  type = signal<'image' | 'document' | 'file'>('file');
  maxSize = signal<number>(5);
  maxFiles = signal<number>(3);
  required = signal(false);
  disabled = signal(false);

  uploadedFiles = signal<(string | number)[]>([]);

  currentExtensions = computed(() => {
    switch (this.type()) {
      case 'image':
        return ['jpg', 'jpeg', 'png', 'webp'];
      case 'document':
        return ['pdf', 'doc', 'docx', 'xlsx'];
      default:
        return [];
    }
  });

  getModelJson = computed(() => {
    return JSON.stringify(this.uploadedFiles(), null, 2);
  });

  htmlCode = computed(() => {
    const typeStr = this.type() === 'file' ? `` : `\n  [type]="'${this.type()}'"`;
    const extStr = this.currentExtensions().length > 0 ? `\n  [extensions]="['${this.currentExtensions().join("', '")}']"` : '';
    const reqStr = this.required() ? `\n  [required]="true"` : '';
    const disStr = this.disabled() ? `\n  [disabled]="true"` : '';
    const maxSizeStr = this.maxSize() ? `\n  [maxSize]="${this.maxSize()}"` : '';
    const maxStr = this.maxFiles() ? `\n  [max]="${this.maxFiles()}"` : '';

    return `<sd-upload-file
  [label]="'${this.label()}'"${typeStr}${extStr}${maxSizeStr}${maxStr}${reqStr}${disStr}
  [upload]="uploadLocal"
  [details]="fileDetails"
  [(model)]="files">
</sd-upload-file>`;
  });

  tsCode = `import { Component } from '@angular/core';
import { SdUploadFile } from '@sdcorejs/angular/components/upload-file';

@Component({
  standalone: true,
  imports: [SdUploadFile],
  templateUrl: './my-component.component.html',
})
export class MyComponent {
  // Xem uploadLocal/fileDetails trong source demo: lưu File bằng object URL của phiên.
  // Ứng dụng thực tế thay adapter bằng API upload và metadata của module.
  files: string[] = [];
  
  save() {
    console.log(this.files);
  }
}`;

  simulateFetchOldData() {
    const image = this.type() === 'image';
    const key = image ? 'sample-image' : 'sample-pdf';
    this.files.set(key, {
      idOrKey: key,
      cdn: image
        ? 'logo.png'
        : 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9Db3VudCAxIC9LaWRzIFs0IDAgUl0gPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iago0IDAgb2JqCjw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL01lZGlhQm94IFswIDAgNTk1IDg0Ml0gL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgMyAwIFIgPj4gPj4gL0NvbnRlbnRzIDUgMCBSID4+CmVuZG9iago1IDAgb2JqCjw8IC9MZW5ndGggNTMgPj4Kc3RyZWFtCkJUIC9GMSAyNCBUZiA2MCA3NTAgVGQgKFBvcnRhbCBzYW1wbGUgLSBwYWdlIDEpIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMTg1IDAwMDAwIG4gCjAwMDAwMDAzMTEgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA2IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgo0MTQKJSVFT0Y=',
      name: image ? 'sample.png' : 'sample.pdf',
      extension: image ? 'png' : 'pdf',
    });
    this.uploadedFiles.set([key]);
  }
}

SdTabComponent({ component: UploadFileDemoComponent, name: 'SdUploadFile Component', icon: 'widgets' })(UploadFileDemoComponent);
