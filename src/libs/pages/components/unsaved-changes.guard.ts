import { CanDeactivateFn } from '@angular/router';
export const referenceUnsavedGuard: CanDeactivateFn<{ canLeave: () => Promise<boolean> }> = component => component?.canLeave() ?? false;
