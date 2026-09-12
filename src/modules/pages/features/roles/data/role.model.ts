export type RoleLayout = 'matrix' | 'tree';
export type RoleMode = 'create' | 'detail' | 'update';
export interface RoleEntity {
  id: string;
  name: string;
  hint: string;
  crud: string[];
  other: string[][];
}
export interface RoleModule {
  id: string;
  name: string;
  label: string;
  entities: RoleEntity[];
}
export interface RolePermission {
  id: string;
  action: string;
  label: string;
  type: 'CRUD' | 'Other';
}
export interface RoleRecord {
  id: string;
  code: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  users: number;
  updatedAt: string;
  permissions: string[];
}
export const ROLE_STATUSES = [
  { id: 'active', name: 'Đang hoạt động' },
  { id: 'inactive', name: 'Ngừng hoạt động' },
];
export const ROLE_EXAMPLES = [
  { id: 'roles-matrix', group: 'list', title: 'Role · Ma trận quyền', icon: 'grid_view', layout: 'matrix' },
  { id: 'roles-tree', group: 'list', title: 'Role · Quyền phân cấp', icon: 'account_tree', layout: 'tree' },
] as const;
export function emptyRole(): RoleRecord {
  return { id: '', code: '', name: '', description: '', status: 'active', users: 0, updatedAt: '', permissions: [] };
}
export function roleBaseUrl(layout: RoleLayout): string {
  return '/pages/list/roles-' + (layout === 'tree' ? 'tree' : 'matrix');
}
