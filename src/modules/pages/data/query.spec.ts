import { createFixtures } from './fixture-factories';
import { queryEntities } from './query';
describe('CASE-QUERY — compound filters', () => {
  it('combines search, status and region without changing seed order', () => {
    const items = createFixtures('customer');
    const q = { search: items[0].code, status: items[0].status, group: items[0].group };
    expect(queryEntities(items, q).map(x => x.id)).toEqual([items[0].id]);
    expect(queryEntities(items, { ...q, status: 'missing' })).toEqual([]);
  });
});
