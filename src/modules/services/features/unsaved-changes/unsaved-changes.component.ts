import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdUnsavedChangesService } from '@sdcorejs/angular/services/unsaved-changes';
@Component({
  selector: 'app-unsaved-changes',
  providers: [SdUnsavedChangesService],
  imports: [SdPageComponent, SdInput, SdButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<sd-page title="Unsaved changes" description="Thử lưu, bỏ thay đổi hoặc tiếp tục chỉnh sửa."
    ><div class="p-24 d-flex flex-column gap-16">
      <sd-input label="Nội dung nháp" [model]="value()" (modelChange)="change($event)" />
      <p role="status">{{ dirty() ? 'Có thay đổi chưa lưu' : 'Đã lưu hoặc chưa chỉnh sửa' }}</p>
      <sd-button title="Rời nội dung demo" (click)="leave()" />
      <p role="status">{{ result() }}</p>
    </div></sd-page
  >`,
})
export class UnsavedChangesComponent {
  readonly service = inject(SdUnsavedChangesService);
  readonly value = signal('');
  readonly dirty = signal(false);
  readonly result = signal('');
  constructor() {
    const reg = this.service.register({
      id: 'service-demo',
      isDirty: this.dirty,
      save: () => {
        this.dirty.set(false);
        return true;
      },
      discard: () => {
        this.value.set('');
        this.dirty.set(false);
        return true;
      },
    });
    inject(DestroyRef).onDestroy(() => reg.destroy());
  }
  change(value: string) {
    this.value.set(value);
    this.dirty.set(true);
  }
  async leave() {
    this.result.set((await this.service.confirmLeave()) ? 'Đã rời nội dung an toàn.' : 'Tiếp tục chỉnh sửa.');
  }
}

SdTabComponent({ component: UnsavedChangesComponent, name: 'Unsaved Changes', icon: 'settings_suggest' })(UnsavedChangesComponent);
