import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SdFormRender } from '@sdcorejs/angular/components/form-generic';
import { SdUploadFile } from '@sdcorejs/angular/components/upload-file';
import { SdStepper, SdStep } from '@sdcorejs/angular/components/stepper';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdViewportService } from '@sdcorejs/angular/services/viewport';
import { WorkspaceStore, type WorkspaceRequest } from '../data/workspace.store';
import { WORKSPACE_SAMPLE_VALUE } from '../data/workspace.seed';

@Component({
  selector: 'app-workspace-request',
  standalone: true,
  imports: [SdFormRender, SdUploadFile, SdStepper, SdStep, SdSection, SdButton, SdSwitch],
  templateUrl: './request.component.html',
  styleUrl: './request.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceRequestComponent {
  readonly store = inject(WorkspaceStore);
  readonly #router = inject(Router);
  readonly viewport = inject(SdViewportService);
  readonly render = viewChild(SdFormRender);
  readonly upload = viewChild(SdUploadFile);
  readonly stepper = viewChild(SdStepper);
  readonly form = new FormGroup({});
  readonly step = signal(0);
  readonly busy = signal(false);
  readonly errors = signal<string[]>([]);
  readonly warnings = signal<string[]>([]);
  readonly submitted = signal<WorkspaceRequest | null>(null);
  readonly attachmentNames = computed(() =>
    this.store
      .files()
      .filter(file => this.store.attachmentIds().includes(file.id))
      .map(file => file.name)
  );
  readonly schemaJson = computed(() => JSON.stringify(this.store.draftValue(), null, 2));
  constructor() {
    effect(() => {
      this.store.resetVersion();
      this.step.set(0);
      this.errors.set([]);
      this.warnings.set([]);
      this.submitted.set(null);
    });
  }
  fillSample(): void {
    this.store.draftValue.set(structuredClone(WORKSPACE_SAMPLE_VALUE));
    this.errors.set([]);
  }
  async next(): Promise<void> {
    const result = await this.render()?.validate();
    this.warnings.set(result?.messages.warning ?? []);
    if (!result?.valid) {
      this.errors.set(result?.messages.error.length ? result.messages.error : ['Hãy kiểm tra các trường bắt buộc và lỗi được đánh dấu.']);
      return;
    }
    this.errors.set([]);
    this.stepper()?.next();
  }
  async prepareReview(): Promise<void> {
    this.busy.set(true);
    this.errors.set([]);
    try {
      await this.upload()?.upload();
      this.stepper()?.next();
    } catch (error) {
      this.errors.set([error instanceof Error ? error.message : 'Không thể chuẩn bị tài liệu. Hãy thử lại.']);
    } finally {
      this.busy.set(false);
    }
  }
  async submit(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.errors.set([]);
    try {
      const result = await this.render()?.validate();
      if (!result?.valid) {
        this.step.set(0);
        this.errors.set(['Dữ liệu chưa hợp lệ. Kiểm tra các trường được đánh dấu.']);
        return;
      }
      await this.render()?.upload();
      await this.upload()?.upload();
      const row = await this.store.submit(this.store.draftValue(), this.store.attachmentIds().map(String));
      this.submitted.set(row);
      this.store.draftValue.set({});
      this.store.attachmentIds.set([]);
    } catch (error) {
      this.errors.set([error instanceof Error ? error.message : 'Không thể gửi đề nghị.']);
    } finally {
      this.busy.set(false);
    }
  }
  newRequest(): void {
    this.submitted.set(null);
    this.step.set(0);
    this.errors.set([]);
    this.warnings.set([]);
    this.form.reset();
  }
  openQueue(): void {
    void this.#router.navigate(['/utility/workspace/queue']);
  }
}
