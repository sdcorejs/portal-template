import type { SdBadgeType } from '@sdcorejs/angular/components/badge';
import type { Color } from '@sdcorejs/utils/models';
import { EntityStatus, STATUS_OPTIONS } from '../data/models';
/** Keep status meaning consistent while each listing chooses its badge presentation. */
export function statusBadge(status: EntityStatus, type: SdBadgeType): { type: SdBadgeType; title: string; color: Color; icon: string } {
  return {
    type,
    title: STATUS_OPTIONS.find(option => option.id === status)?.name ?? status,
    color: status === 'active' ? 'success' : status === 'pending' ? 'warning' : 'secondary',
    icon: status === 'active' ? 'check_circle' : status === 'pending' ? 'schedule' : 'pause_circle',
  };
}
