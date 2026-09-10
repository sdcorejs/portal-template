import type { DemoEntity } from './models';
export interface DemoQuery {
  search: string;
  status: string;
  group: string;
}
/** Composes the demo's three independent filters; leaves pagination/sort to SdTable. */
export function queryEntities(items: DemoEntity[], query: DemoQuery): DemoEntity[] {
  const term = query.search.trim().toLocaleLowerCase('vi');
  return items.filter(
    row =>
      (!term || (row.code + ' ' + row.name).toLocaleLowerCase('vi').includes(term)) &&
      (!query.status || row.status === query.status) &&
      (!query.group || row.group === query.group)
  );
}
