import { loadPortalConfig } from './portal-config';
import { inject, Injectable } from '@angular/core';
import { ISdLayoutConfiguration, SdAuthService } from '@sdcorejs/angular/modules';

@Injectable()
export class LayoutConfiguration implements ISdLayoutConfiguration {
  #authService = inject(SdAuthService);
  userInfo: ISdLayoutConfiguration['userInfo'] = () => {
    return {
      username: 'username',
      email: 'email',
      fullName: 'fullName',
    };
  };
  signout = () => {
    this.#authService.signout();
  };
  changePassword = () => {
    this.#authService.changePassword();
  };
  sidebar: ISdLayoutConfiguration['sidebar'] = (() => {
    const version = loadPortalConfig().sidebarVersion;
    if (version === 2) return { version: 2, interaction: 'click' };
    if (version === 3) return { version: 3, defaultCollapsed: false, recent: { enabled: true, maxItems: 5 } };
    return { version: 1, logoUrl: 'logo.png', defaultTitle: 'Portal Template' };
  })();
}
