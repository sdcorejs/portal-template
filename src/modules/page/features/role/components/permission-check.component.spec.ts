import { TestBed } from '@angular/core/testing';
import { PermissionCheckComponent } from './permission-check.component';

describe('Role permission checkbox interaction', () => {
  it('names the native control and represents partial selection before selecting the whole scope', () => {
    const fixture = TestBed.createComponent(PermissionCheckComponent);
    fixture.componentRef.setInput('label', 'Select customer permissions');
    fixture.componentRef.setInput('ids', ['view', 'create']);
    fixture.componentRef.setInput('selected', ['view']);
    fixture.detectChanges();
    const control: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
    expect(control.getAttribute('aria-label')).toBe('Select customer permissions');
    expect(control.indeterminate).toBeTrue();
    expect(control.checked).toBeFalse();
    const changed = jasmine.createSpy('changed');
    fixture.componentInstance.changed.subscribe(changed);
    control.click();
    expect(changed).toHaveBeenCalledOnceWith({ ids: ['view', 'create'], checked: true });
    fixture.componentRef.setInput('selected', ['view', 'create']);
    fixture.detectChanges();
    expect(control.checked).toBeTrue();
    expect(control.indeterminate).toBeFalse();
    control.click();
    expect(changed).toHaveBeenCalledWith({ ids: ['view', 'create'], checked: false });
    fixture.componentRef.setInput('selected', []);
    fixture.detectChanges();
    expect(control.checked).toBeFalse();
    expect(control.indeterminate).toBeFalse();
    fixture.destroy();
  });

  it('keeps a fully selected disabled scope checked without emitting a change', () => {
    const fixture = TestBed.createComponent(PermissionCheckComponent);
    fixture.componentRef.setInput('label', 'Select customer permissions');
    fixture.componentRef.setInput('ids', ['view']);
    fixture.componentRef.setInput('selected', ['view']);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const control: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
    const changed = jasmine.createSpy('changed');
    fixture.componentInstance.changed.subscribe(changed);
    expect(control.checked).toBeTrue();
    expect(control.disabled).toBeTrue();
    control.click();
    expect(changed).not.toHaveBeenCalled();
    fixture.componentRef.setInput('disabled', false);
    fixture.componentRef.setInput('ids', []);
    fixture.detectChanges();
    expect(control.disabled).toBeTrue();
    expect(control.checked).toBeFalse();
    control.click();
    expect(changed).not.toHaveBeenCalled();
    fixture.destroy();
  });
});
