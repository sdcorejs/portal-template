import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  SdApiContractBuilder,
  SD_API_CONTRACT_CONFIGURATION,
  SD_API_CONTRACT_SAMPLE_ENVIRONMENT,
  sdApiContractSearchSample,
  sdApiContractCreateSample,
  sdApiContractInvalidSample,
  serializeSdApiContract,
  validateSdApiContract,
  type SdApiContract,
} from '@sdcorejs/angular/components/api-contract-builder';
import { SdBreadcrumb, type SdBreadcrumbItem } from '@sdcorejs/angular/components/breadcrumb';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdConfirmService } from '@sdcorejs/angular/services/confirm';

@Component({
  selector: 'app-api-contract-builder-demo',
  standalone: true,
  imports: [SdApiContractBuilder, SdBreadcrumb, SdButton, SdCodeEditor, SdSection, SdSelect, SdSwitch, SdPageComponent],
  providers: [{ provide: SD_API_CONTRACT_CONFIGURATION, useValue: SD_API_CONTRACT_SAMPLE_ENVIRONMENT }],
  templateUrl: './api-contract-builder.component.html',
  styleUrl: './api-contract-builder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiContractBuilderDemoComponent {
  private readonly confirm = inject(SdConfirmService);
  readonly trail: SdBreadcrumbItem[] = [{ label: 'Component', url: '/component/button' }, { label: 'API Contract Builder' }];
  readonly model = signal<SdApiContract | null>(sdApiContractSearchSample());
  readonly sample = signal('search');
  readonly mode = signal<'edit' | 'view'>('edit');
  readonly disabled = signal(false);
  readonly saved = signal<string | null>(null);
  readonly status = signal('Chỉnh sửa hợp đồng mẫu, sau đó lưu bản chụp hoặc xuất JSON.');
  readonly sampleOptions = [
    { id: 'search', name: 'Tìm kiếm sản phẩm' },
    { id: 'create', name: 'Tạo sản phẩm' },
    { id: 'invalid', name: 'Hợp đồng có lỗi' },
    { id: 'empty', name: 'Bắt đầu trống' },
  ];
  readonly modeOptions = [
    { id: 'edit', name: 'Chỉnh sửa' },
    { id: 'view', name: 'Chỉ xem' },
  ];
  readonly diagnostics = computed(() => validateSdApiContract(this.model(), SD_API_CONTRACT_SAMPLE_ENVIRONMENT));
  readonly errors = computed(() => this.diagnostics().filter(item => item.severity === 'error').length);
  readonly valid = computed(() => this.model() !== null && this.errors() === 0);
  readonly json = computed(() => serializeSdApiContract(this.model()));
  readonly changed = computed(() => this.saved() !== null && this.saved() !== this.json());
  readonly htmlCode = computed(
    () =>
      `<sd-api-contract-builder\n  [(model)]="contract"${this.mode() === 'view' ? '\n  mode="view"' : ''}${this.disabled() ? '\n  [disabled]="true"' : ''}\n  autoId="contract-demo"\n></sd-api-contract-builder>`
  );
  readonly tsCode = `import { Component, signal } from '@angular/core';
import { SdApiContractBuilder, SD_API_CONTRACT_CONFIGURATION,
  SD_API_CONTRACT_SAMPLE_ENVIRONMENT, sdApiContractSearchSample,
  serializeSdApiContract } from '@sdcorejs/angular/components/api-contract-builder';

@Component({
  imports: [SdApiContractBuilder],
  providers: [{ provide: SD_API_CONTRACT_CONFIGURATION,
    useValue: SD_API_CONTRACT_SAMPLE_ENVIRONMENT }],
  template: '<sd-api-contract-builder [(model)]="contract" />',
})
export class ContractExample {
  contract = signal(sdApiContractSearchSample());
  snapshot() { return serializeSdApiContract(this.contract()); }
}`;

  loadSample(): void {
    const factories = { search: sdApiContractSearchSample, create: sdApiContractCreateSample, invalid: sdApiContractInvalidSample };
    this.model.set(this.sample() === 'empty' ? null : factories[this.sample() as keyof typeof factories]());
    this.saved.set(null);
    this.status.set('Đã nạp mẫu. Các bước Input → Request → Response → Output dùng chung một hợp đồng.');
  }

  selectSample(value: unknown): void {
    this.sample.set(typeof value === 'string' && this.sampleOptions.some(item => item.id === value) ? value : 'search');
  }

  save(): void {
    if (!this.valid() || this.disabled()) return;
    this.saved.set(this.json());
    this.status.set('Đã lưu bản chụp trong phiên demo. Có thể tiếp tục sửa để so sánh.');
  }

  export(): void {
    if (!this.valid()) return;
    const url = URL.createObjectURL(new Blob([this.json()], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'api-contract-demo.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.status.set('Đã xuất hợp đồng JSON. Hợp đồng chỉ chứa khai báo và tham chiếu biến môi trường.');
  }

  async reset(): Promise<void> {
    try {
      await this.confirm.confirm('Khôi phục hợp đồng tìm kiếm mẫu và bỏ bản chụp trong phiên này?', {
        title: 'Khôi phục hợp đồng',
        yesTitle: 'Khôi phục',
        noTitle: 'Hủy',
      });
    } catch {
      this.status.set('Đã hủy khôi phục. Nội dung hợp đồng được giữ nguyên.');
      return;
    }
    this.sample.set('search');
    this.mode.set('edit');
    this.disabled.set(false);
    this.loadSample();
  }
}

SdTabComponent({ component: ApiContractBuilderDemoComponent, name: 'API Contract Builder', icon: 'api' })(ApiContractBuilderDemoComponent);
