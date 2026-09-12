import { createFixtures } from './fixture-factories';
import { queryTablePage } from './table-query';
describe('CASE-TABLE-REQUEST — session API adapter', () => {
  it('combines keyword OR fields with external AND filters', () => {
    const rows = createFixtures('order');
    const result = queryTablePage(rows, {
      pageNumber: 0,
      pageSize: 10,
      filters: [
        {
          operator: 'OR',
          data: [
            { field: 'code', operator: 'CONTAIN', data: 'ORD-0002' },
            { field: 'name', operator: 'CONTAIN', data: 'ORD-0002' },
          ],
        },
        { field: 'status', operator: 'EQUAL', data: 'pending' },
        { field: 'group', operator: 'EQUAL', data: 'central' },
      ],
    });
    expect(result.items.map(row => row.code)).toEqual(['ORD-0002']);
    expect(result.total).toBe(1);
  });
  it('sorts before paging and leaves the session source unchanged', () => {
    const rows = createFixtures('order');
    const before = rows.map(row => row.id);
    const result = queryTablePage(rows, { pageNumber: 1, pageSize: 10, orders: [{ field: 'amount', direction: 'DESC' }] });
    expect(result.total).toBe(30);
    expect(result.items.length).toBe(10);
    expect(result.items[0].amount).toBe(rows[19].amount);
    expect(rows.map(row => row.id)).toEqual(before);
  });
  it('retains ancestors of matching children and removes unrelated siblings', () => {
    const rows = createFixtures('product');
    const result = queryTablePage(
      rows,
      { pageNumber: 0, pageSize: 10, filters: [{ field: 'code', operator: 'EQUAL', data: 'PRO-0002' }] },
      true
    );
    expect(result.total).toBe(1);
    expect(result.items[0].id).toBe(rows[1].parentId!);
    expect(result.items[0].children!.map(row => row.code)).toEqual(['PRO-0002']);
  });
  it('returns empty data for incompatible filters', () => {
    const result = queryTablePage(createFixtures('order'), {
      pageNumber: 0,
      pageSize: 10,
      filters: [
        { field: 'code', operator: 'EQUAL', data: 'ORD-0002' },
        { field: 'status', operator: 'EQUAL', data: 'active' },
      ],
    });
    expect(result).toEqual({ items: [], total: 0 });
  });
});
