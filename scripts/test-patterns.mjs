import test from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_QUERY, normalizeSearch, queryOrders, seedOrders } from '../src/modules/patterns/data/pattern-query.ts';
test('status + accent-insensitive search + region compose before paging', () => {
  const rows = seedOrders();
  const result = queryOrders(rows, { ...EMPTY_QUERY, status: 'pending', search: '  AN PHAT ', region: 'Miền Bắc' });
  assert.deepEqual(
    result.map(row => row.code),
    ['DH-1001']
  );
  assert.equal(rows.length, 24);
  assert.equal(rows.filter(row => row.status === 'pending').length, 8);
  assert.equal(normalizeSearch('Đại Việt'), 'dai viet');
});
test('sort is deterministic without mutating fixtures; no-results and empty are safe', () => {
  const rows = seedOrders();
  const initial = structuredClone(rows);
  const result = queryOrders(rows, { ...EMPTY_QUERY, sort: 'amount-desc' });
  assert.equal(result[0].code, 'DH-1024');
  assert.equal(result.slice(6, 12).length, 6);
  assert.deepEqual(rows, initial);
  assert.deepEqual(queryOrders(rows, { ...EMPTY_QUERY, search: 'no-such-record' }), []);
  assert.deepEqual(queryOrders([], { ...EMPTY_QUERY, sort: 'amount-asc' }), []);
});
