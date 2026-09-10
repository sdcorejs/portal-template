import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DemoHostComponent } from './demo-host.component';
@Component({ template: '<span>mounted</span>' })
class ProbeComponent {}
describe('CASE-HOST — mounted preview', () => {
  it('does not rebuild the same component on change detection', () => {
    const f = TestBed.createComponent(DemoHostComponent);
    f.componentRef.setInput('component', ProbeComponent);
    f.detectChanges();
    const node = f.nativeElement.querySelector('span');
    f.detectChanges();
    expect(f.nativeElement.querySelector('span')).toBe(node);
    f.destroy();
  });
});
