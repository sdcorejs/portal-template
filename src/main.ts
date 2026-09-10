import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { provideReferenceUi } from './app/reference-providers';
import {
  SD_AUTH_CONFIGURATION,
  SD_LAYOUT_CONFIGURATION,
  SD_PERMISSION_CONFIGURATION,
  SdKeycloakInterceptor,
} from '@sdcorejs/angular/modules';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthConfiguration, LayoutConfiguration, PermissionConfiguration } from './app/configurations';
import { importProvidersFrom } from '@angular/core';
import { SdApiModule } from '@sdcorejs/angular/services';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(withInterceptors([SdKeycloakInterceptor])),
    importProvidersFrom(SdApiModule),
    ...provideReferenceUi(),
    { provide: SD_AUTH_CONFIGURATION, useClass: AuthConfiguration },
    { provide: SD_LAYOUT_CONFIGURATION, useClass: LayoutConfiguration },
    { provide: SD_PERMISSION_CONFIGURATION, useClass: PermissionConfiguration },
  ],
}).catch(err => {
  console.error(err);
  //window.location.href = '/auth-service-error.html';
});
