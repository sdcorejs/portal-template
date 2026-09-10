import { createFixtures } from './fixture-factories';
describe('CASE-FIXTURE — deterministic synthetic datasets', () => {
  it('provides at least 24 distinct records per list and fresh copies', () => {
    for (const kind of ['customer', 'order', 'product', 'ticket'] as const) {
      const a = createFixtures(kind);
      expect(a.length).toBeGreaterThanOrEqual(24);
      expect(new Set(a.map(x => x.id)).size).toBe(a.length);
      a[0].name = 'changed';
      expect(createFixtures(kind)[0].name).not.toBe('changed');
    }
  });
  it('provides a parent-child hierarchy', () => expect(createFixtures('product').some(x => x.parentId)).toBeTrue());
});
