import { Injectable } from '@angular/core';
import { ISdAuthConfiguration } from '@sd-angular/core/modules';

@Injectable()
export class AuthConfiguration implements ISdAuthConfiguration {
  // 1. Inject Service mới thay cho OidcSecurityService

  guard: ISdAuthConfiguration['guard'] = {
    /** ------------------------------------------------
     * STEP 1: AUTHENTICATION GUARD
     * ------------------------------------------------*/
    auth: () => {
      return true;
    },
    /** ------------------------------------------------
     * STEP 2: PORTAL GUARD
     * ------------------------------------------------*/
    portal: async () => {
      return true;
    },

    /** ------------------------------------------------
     * STEP 3: AUTH INFO GUARD
     * ------------------------------------------------*/
    authInfo: () => {
      return {
        username: 'username',
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
      };
    },
  };

  /** ----------------------------------------
   * ACTION: Logout / ChangePassword
   * ---------------------------------------*/
  action: ISdAuthConfiguration['action'] = {
    signout: async () => {
      // Xử lý logout
    },

    changePassword: async () => {
      // Xử lý đổi mật khẩu
    },
  };
}
