import { Injectable, inject } from '@angular/core';
import { SdConfirmService } from '@sdcorejs/angular/services/confirm';
@Injectable()
export class PatternDraft {
  private readonly confirm = inject(SdConfirmService);
  dirty: () => boolean = () => false;
  saving: () => boolean = () => false;
  async canLeave(): Promise<boolean> {
    if (this.saving()) return false;
    if (!this.dirty()) return true;
    try {
      await this.confirm.confirm('Bỏ thay đổi sẽ mất nội dung vừa nhập.', {
        title: 'Thông tin chưa được lưu',
        yesTitle: 'Bỏ thay đổi',
        noTitle: 'Tiếp tục chỉnh sửa',
      });
      return true;
    } catch {
      return false;
    }
  }
}
