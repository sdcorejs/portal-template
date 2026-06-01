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
  sidebar = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    version: 1 as any,
    logoUrl: 'logo.png',
    defaultTitle: 'Portal Template',
  };
}
