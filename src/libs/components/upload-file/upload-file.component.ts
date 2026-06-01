import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdUploadFile } from '@sdcorejs/angular/components/upload-file';
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
  // Mảng chứa ID/Key/URL trả về từ server
  files: string[] = [];
  
  save() {
    console.log(this.files);
  }
}`;

  simulateFetchOldData() {
    if (this.type() === 'image') {
      this.uploadedFiles.set([
        'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=300',
        'https://images.unsplash.com/photo-1506744626753-143683923be2?q=80&w=300'
      ]);
    } else {
      this.uploadedFiles.set([
        'https://s3.amazonaws.com/example/sample-contract.pdf',
        'https://s3.amazonaws.com/example/user-manual.docx'
      ]);
    }
  }
}
