import { TestBed } from '@angular/core/testing';
import { FormArray } from '@angular/forms';
import { LineItemEditorComponent, LineItemGroup } from './line-item-editor.component';
describe('CASE-LINE-ITEMS — parent payload ownership', () => {
  it('updates line totals and removes the actual parent row', () => {
    const lines = new FormArray([new LineItemGroup({ id: 'a', name: 'Paper', quantity: 2, unitPrice: 100 })]);
    const f = TestBed.createComponent(LineItemEditorComponent);
    f.componentRef.setInput('lines', lines);
    f.componentInstance.update();
    expect(f.componentInstance.total()).toBe(200);
    f.componentInstance.add();
    expect(lines.length).toBe(2);
    f.componentInstance.remove(0);
    expect(lines.length).toBe(1);
    expect(f.componentInstance.total()).toBe(0);
    f.destroy();
  });
});
