import { PageNavigation } from '../reference/page-navigation';
import { TestBed } from '@angular/core/testing';
import { DrawerCompactComponent } from './drawer-compact/drawer-compact.component';
import { DemoSessionStore } from '../data/demo-session.store';
import { SdUnsavedChangesService, SD_UNSAVED_CHANGES_CONFIRMATION_ADAPTER } from '@sdcorejs/angular/services/unsaved-changes';
describe('CASE-DRAWER — scoped close guard', () => {
  it('rejects closing a dirty registered draft when user keeps editing', async () => {
    TestBed.configureTestingModule({
      providers: [
        DemoSessionStore,
        PageNavigation,
        SdUnsavedChangesService,
        { provide: SD_UNSAVED_CHANGES_CONFIRMATION_ADAPTER, useValue: { confirm: () => 'cancel' } },
      ],
    });
    const store = TestBed.inject(DemoSessionStore);
    store.reset('category');
    const service = TestBed.inject(SdUnsavedChangesService);
    const registration = service.register({ id: 'test', scope: store, isDirty: true });
    const f = TestBed.createComponent(DrawerCompactComponent);
    expect(await f.componentInstance.beforeClose()).toBeFalse();
    registration.destroy();
    expect(await f.componentInstance.beforeClose()).toBeTrue();
    f.destroy();
  });
});
