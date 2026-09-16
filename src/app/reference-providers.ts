import { inject, Provider } from '@angular/core';
import { SD_CORE_CONFIGURATION } from '@sdcorejs/angular/configurations';
import { SD_UNSAVED_CHANGES_CONFIRMATION_ADAPTER, SdUnsavedChangesConfirmationAdapter } from '@sdcorejs/angular/services/unsaved-changes';
import { SdConfirmService } from '@sdcorejs/angular/services/confirm';
import { loadPortalConfig } from './configurations/portal-config';
/** Shared presentation settings for portal and Storybook. Does not bootstrap authentication. */
export function provideReferenceUi(): Provider[] {
  const portalConfig = loadPortalConfig();
  return [
    {
      provide: SD_CORE_CONFIGURATION,
      useValue: {
        format: { number: portalConfig.numberFormat },
        language: portalConfig.language,
      },
    },
    {
      provide: SD_UNSAVED_CHANGES_CONFIRMATION_ADAPTER,
      useFactory: (): SdUnsavedChangesConfirmationAdapter => {
        const confirm = inject(SdConfirmService);
        return {
          async confirm() {
            try {
              await confirm.confirm('Các thay đổi chưa được lưu. Bạn muốn tiếp tục chỉnh sửa hay bỏ qua?', {
                title: 'Thay đổi chưa lưu',
                icon: 'edit_note',
                yesTitle: 'Tiếp tục chỉnh sửa',
                yesButtonColor: 'primary',
                noTitle: 'Bỏ qua',
                noButtonColor: 'secondary',
                disableBackdropClose: true,
              });
              return 'cancel';
            } catch (reason) {
              return reason === 'CANCEL' ? 'discard' : 'cancel';
            }
          },
        };
      },
    },
  ];
}
