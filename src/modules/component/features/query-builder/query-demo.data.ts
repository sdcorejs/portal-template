import { FilterUtilities } from '@sdcorejs/utils/fns';
import type { Filter } from '@sdcorejs/utils/models';

export interface QueryDemoProject {
  id: string;
  name: string;
  team: string;
  budget: number;
  spent: number;
  active: boolean;
  createdAt: string;
}

export const QUERY_DEMO_PROJECTS: readonly QueryDemoProject[] = [
  { id: 'PRJ-01', name: 'Nova workspace', team: 'product', budget: 120, spent: 95, active: true, createdAt: '2026-09-01' },
  { id: 'PRJ-02', name: 'Atlas identity', team: 'design', budget: 60, spent: 72, active: true, createdAt: '2026-09-10' },
  { id: 'PRJ-03', name: 'Orion research', team: 'product', budget: 150, spent: 140, active: false, createdAt: '2026-08-15' },
  { id: 'PRJ-04', name: 'Lumen dashboard', team: 'engineering', budget: 95, spent: 110, active: true, createdAt: '2026-09-20' },
  { id: 'PRJ-05', name: 'Moss illustration', team: 'design', budget: 45, spent: 30, active: false, createdAt: '2026-07-05' },
  { id: 'PRJ-06', name: 'Vega onboarding', team: 'engineering', budget: 80, spent: 65, active: true, createdAt: '2026-10-01' },
];

export function queryDemoPreset(name: string): Filter | null {
  switch (name) {
    case 'and':
      return {
        operator: 'AND',
        data: [
          { field: 'active', operator: 'EQUAL', data: true },
          { field: 'budget', operator: 'GREATER_THAN', data: 80 },
        ],
      };
    case 'or':
      return {
        operator: 'OR',
        data: [
          { field: 'team', operator: 'IN', data: ['design'] },
          { field: 'budget', operator: 'GREATER_THAN', data: 120 },
        ],
      };
    case 'nested':
      return {
        operator: 'AND',
        data: [
          {
            operator: 'OR',
            data: [
              { field: 'team', operator: 'IN', data: ['design'] },
              { field: 'team', operator: 'IN', data: ['engineering'] },
            ],
          },
          { field: 'active', operator: 'EQUAL', data: true },
        ],
      };
    case 'field':
      return { field: 'spent', operator: 'GREATER_THAN', dataType: 'field', data: 'budget' };
    case 'date':
      return { field: 'createdAt', operator: 'BETWEEN', data: { from: '2026-09-01', to: '2026-09-30' } };
    default:
      return null;
  }
}

export function selectQueryDemoProjects(rows: readonly QueryDemoProject[], filter: Filter | null, search = ''): QueryDemoProject[] {
  // Dùng cùng evaluator của Core để AND/OR và field comparison giữ đúng nghĩa Filter.
  if (filter !== null) FilterUtilities.validateFilter(filter);
  const term = search.trim().toLocaleLowerCase('vi');
  return rows.filter(
    row =>
      (filter === null || FilterUtilities.evaluateFilter(row, filter)) &&
      (!term || (row.id + ' ' + row.name).toLocaleLowerCase('vi').includes(term))
  );
}

export function pauseQueryDemoProjects(rows: readonly QueryDemoProject[], ids: readonly string[]): QueryDemoProject[] {
  const selected = new Set(ids);
  return rows.map(row => (selected.has(row.id) && row.active ? { ...row, active: false } : row));
}
