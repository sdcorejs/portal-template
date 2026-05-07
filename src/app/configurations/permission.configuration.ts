import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ISdPermissionConfiguration } from '@sd-angular/core/modules';

// Nhớ import SdKeycloakService từ đúng đường dẫn Core UI của bạn

@Injectable({
  providedIn: 'root',
})
export class PermissionConfiguration implements ISdPermissionConfiguration {
  #router = inject(Router);
  disabled = true; // Mặc định là disabled, sẽ được cập nhật sau khi load permissions
  loadPermissions = (): string[] => {
    return [];
  };
  onForbiden = () => this.#router.navigate(['layout', 'forbidden']);
}
