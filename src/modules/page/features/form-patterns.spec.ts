import { PageNavigation } from '../reference/page-navigation';
import { TestBed } from '@angular/core/testing';
import { FormSimpleComponent } from './form-simple/form-simple.component';
import { DemoSessionStore } from '../data/demo-session.store';
import { SdUnsavedChangesService, SD_UNSAVED_CHANGES_CONFIRMATION_ADAPTER } from '@sdcorejs/angular/services/unsaved-changes';
describe('CASE-FORM — draft recovery and dirty decisions', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        DemoSessionStore,
        PageNavigation,
        SdUnsavedChangesService,
        { provide: SD_UNSAVED_CHANGES_CONFIRMATION_ADAPTER, useValue: { confirm: () => 'cancel' } },
      ],
    })
  );
  it('keeps dirty changes when closing is cancelled', async () => {
    const store = TestBed.inject(DemoSessionStore);
    store.reset('category');
    store.mode.set('update');
    const fixture = TestBed.createComponent(FormSimpleComponent);
    store.dirty.set(true);
    await fixture.componentInstance.cancel();
    expect(store.mode()).toBe('update');
    expect(store.dirty()).toBeTrue();
    fixture.destroy();
  });
  it('keeps the original entity unchanged when the save fails', async () => {
    const store = TestBed.inject(DemoSessionStore);
    store.reset('category');
    store.failNextSave.set(true);
    const fixture = TestBed.createComponent(FormSimpleComponent);
    const initial = store.records()[0];
    expect(await fixture.componentInstance.save()).toBeFalse();
    expect(fixture.componentInstance.error()).toContain('Không thể lưu');
    expect(store.records()[0]).toEqual(initial);
    fixture.destroy();
  });
});
