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
              const choice = await confirm.withRadio('Bạn muốn xử lý các thay đổi chưa lưu như thế nào?', {
                title: 'Thay đổi chưa lưu',
                yesTitle: 'Tiếp tục',
                noTitle: 'Tiếp tục chỉnh sửa',
                items: [
                  { id: 'save', name: 'Lưu thay đổi' },
                  { id: 'discard', name: 'Bỏ thay đổi' },
                ],
                valueField: 'id',
                displayField: 'name',
                display: 'column',
                required: true,
                defaultValue: 'save',
              });
              return choice === 'save' ? 'save' : 'discard';
            } catch {
              return 'cancel';
            }
          },
        };
      },
    },
  ];
}
