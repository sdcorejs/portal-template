import { TestBed } from '@angular/core/testing';
import { SdLoadingService } from '@sdcorejs/angular/services/loading';
import { LoadingDemoComponent } from '../modules/service/features/loading/loading.component';
import { DemoHarness } from './demo-harness';
describe('CASE-HARNESS — service resource isolation', () => {
  it('reset cancels pending work and releases the owned overlay once', async () => {
    const h = new DemoHarness();
    const late = jasmine.createSpy('late');
    const releaseOverlay = jasmine.createSpy('overlay');
    const timer = setTimeout(late, 5);
    const release = h.own(() => {
      clearTimeout(timer);
      releaseOverlay();
    });
    h.reset();
    release();
    h.destroy();
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(late).not.toHaveBeenCalled();
    expect(releaseOverlay).toHaveBeenCalledTimes(1);
  });
  it('destroying one story leaves a sibling resource intact', () => {
    const first = new DemoHarness(),
      second = new DemoHarness();
    const close = jasmine.createSpy('sibling');
    second.own(close);
    first.destroy();
    expect(close).not.toHaveBeenCalled();
    second.destroy();
    expect(close).toHaveBeenCalledTimes(1);
  });
  it('releases late resources after destruction', () => {
    const h = new DemoHarness();
    h.destroy();
    const release = jasmine.createSpy('late');
    h.own(release);
    expect(release).toHaveBeenCalledTimes(1);
  });
});

describe('CASE-HARNESS-LOADING — component teardown', () => {
  it('stops the same target when the story unmounts during pending work', () => {
    const service = { isLoading: () => false, start: jasmine.createSpy('start'), stop: jasmine.createSpy('stop') };
    TestBed.configureTestingModule({ providers: [{ provide: SdLoadingService, useValue: service }] });
    const fixture = TestBed.createComponent(LoadingDemoComponent);
    fixture.componentInstance.targetSelector.set('#preview-box');
    fixture.componentInstance.startLoading();
    fixture.componentInstance.targetSelector.set('body');
    fixture.destroy();
    expect(service.start).toHaveBeenCalledWith('#preview-box');
    expect(service.stop).toHaveBeenCalledOnceWith('#preview-box');
  });
});
