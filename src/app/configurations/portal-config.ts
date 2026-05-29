import type { Language } from '@sd-angular/core/models';

export type PortalNumberFormat = '1,234,567.89' | '1.234.567,89';

export interface PortalConfig {
  numberFormat: PortalNumberFormat;
  language: Language;
  useTabRouter: boolean;
}

export const PORTAL_CONFIG_KEY = 'portal-config';

export const DEFAULT_PORTAL_CONFIG: PortalConfig = {
  numberFormat: '1.234.567,89',
  language: 'vi',
  useTabRouter: true,
};

// why: localStorage có thể bị deny / JSON parse fail → luôn fallback default thay vì throw.
export function loadPortalConfig(): PortalConfig {
  try {
    const raw = localStorage.getItem(PORTAL_CONFIG_KEY);
    if (!raw) return { ...DEFAULT_PORTAL_CONFIG };
    const parsed = JSON.parse(raw) as Partial<PortalConfig>;
    return { ...DEFAULT_PORTAL_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_PORTAL_CONFIG };
  }
}

export function savePortalConfig(config: PortalConfig): void {
  localStorage.setItem(PORTAL_CONFIG_KEY, JSON.stringify(config));
}

export function resetPortalConfig(): void {
  localStorage.removeItem(PORTAL_CONFIG_KEY);
}
