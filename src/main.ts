import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { SD_CORE_CONFIGURATION } from '@sd-angular/core/configurations';
import {
  SD_AUTH_CONFIGURATION,
  SD_LAYOUT_CONFIGURATION,
  SD_PERMISSION_CONFIGURATION,
  SdKeycloakInterceptor,
} from '@sd-angular/core/modules';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthConfiguration, LayoutConfiguration, PermissionConfiguration } from './app/configurations';
import { importProvidersFrom } from '@angular/core';
import { SdApiModule } from '@sd-angular/core/services';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(withInterceptors([SdKeycloakInterceptor])),
    importProvidersFrom(SdApiModule),
    {
      provide: SD_CORE_CONFIGURATION,
      useValue: {
        licenseKey: 'OTYyMDUwNzg2c2lnbmVk',
      },
    },
    { provide: SD_AUTH_CONFIGURATION, useClass: AuthConfiguration },
    { provide: SD_LAYOUT_CONFIGURATION, useClass: LayoutConfiguration },
    { provide: SD_PERMISSION_CONFIGURATION, useClass: PermissionConfiguration },
  ],
}).catch(err => {
  console.error(err);
  //window.location.href = '/auth-service-error.html';
});
