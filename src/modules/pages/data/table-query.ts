import { FilterUtilities, Utilities } from '@sdcorejs/utils/fns';
import type { PagingReq } from '@sdcorejs/utils/models';
import type { DemoEntity } from './models';
export type EntityTree = DemoEntity & { children?: EntityTree[] };
/** Session-backed stand-in for an API: consume the paging request normalized by SdTable. */
export function queryTablePage(source: DemoEntity[], request: PagingReq<DemoEntity>, tree = false): { items: EntityTree[]; total: number } {
  const matched = source.filter(row => FilterUtilities.match(request.filters || [], row));
  const included = new Set(matched.map(row => row.id));
  if (tree) {
    const byId = new Map(source.map(row => [row.id, row]));
    for (const row of matched) {
      let parent = row.parentId && byId.get(row.parentId);
      const visited = new Set<string>();
      while (parent && !visited.has(parent.id)) {
        visited.add(parent.id);
        included.add(parent.id);
        parent = parent.parentId && byId.get(parent.parentId);
      }
    }
  }
  const rows = source.filter(row => included.has(row.id));
  for (const order of [...(request.orders || [])].reverse()) {
    rows.sort((a, b) => {
      const left = Utilities.getNestedValue(a, order.field);
      const right = Utilities.getNestedValue(b, order.field);
      const comparison =
        typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left ?? '').localeCompare(String(right ?? ''), 'vi', { numeric: true });
      return order.direction === 'DESC' ? -comparison : comparison;
    });
  }
  const toNode = (row: DemoEntity): EntityTree => ({ ...row, children: rows.filter(child => child.parentId === row.id).map(toNode) });
  const roots: EntityTree[] = tree ? rows.filter(row => !row.parentId || !included.has(row.parentId)).map(toNode) : rows;
  const size = request.pageSize || roots.length;
  const start = (request.pageNumber || 0) * size;
  return { items: roots.slice(start, start + size), total: roots.length };
}
