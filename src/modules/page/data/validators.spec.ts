import { createFixtures } from './fixture-factories';
import { validateEntity } from './validators';
describe('CASE-VALIDATION — safe create/update', () => {
  it('rejects duplicate codes, blank names and invalid line quantities', () => {
    const rows = createFixtures('order');
    const row = rows[0];
    expect(
      validateEntity({ ...row, name: ' ', lines: [{ id: 'a', name: 'Paper', quantity: 0, unitPrice: 10 }] }, rows).length
    ).toBeGreaterThan(1);
    expect(validateEntity(row, rows, row.id)).toEqual([]);
  });
});
