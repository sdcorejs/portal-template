import type { SdBadgeType } from '@sdcorejs/angular/components/badge';
import type { Color } from '@sdcorejs/utils/models';
import { EntityStatus, STATUS_OPTIONS } from '../data/models';
/** Các trang mẫu dùng badge round để trình bày trạng thái nhất quán. */
export function statusBadge(
  status: EntityStatus,
  type: SdBadgeType = 'round'
): { type: SdBadgeType; title: string; color: Color; icon: string } {
  return {
    type,
    title: STATUS_OPTIONS.find(option => option.id === status)?.name ?? status,
    color: status === 'active' ? 'success' : status === 'pending' ? 'warning' : 'secondary',
    icon: status === 'active' ? 'check_circle' : status === 'pending' ? 'schedule' : 'pause_circle',
  };
}
