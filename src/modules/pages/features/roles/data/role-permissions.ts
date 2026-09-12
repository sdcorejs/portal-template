import type { RoleEntity, RoleModule, RolePermission } from './role.model';
export const CRUD = [
  { action: 'VIEW', label: 'Xem' },
  { action: 'CREATE', label: 'Tạo' },
  { action: 'UPDATE', label: 'Cập nhật' },
  { action: 'DELETE', label: 'Xóa' },
];
export function permissionsFor(module: RoleModule, entity: RoleEntity): RolePermission[] {
  return [
    ...CRUD.filter(item => entity.crud.includes(item.action)).map(item => ({ ...item, type: 'CRUD' as const })),
    ...entity.other.map(([action, label]) => ({ action, label, type: 'Other' as const })),
  ].map(item => ({ ...item, id: module.id + '_' + entity.id + '_G_' + item.action }));
}
export function selectionState(selected: readonly string[], ids: readonly string[]) {
  const set = new Set(selected),
    scope = [...new Set(ids)],
    count = scope.filter(id => set.has(id)).length;
  return { count, checked: scope.length > 0 && count === scope.length, mixed: count > 0 && count < scope.length };
}
/** Selection operations affect only their explicit scope; hidden grants survive. */
export function setPermissionScope(selected: readonly string[], ids: readonly string[], checked: boolean): string[] {
  const next = new Set(selected);
  for (const id of ids) {
    if (checked) next.add(id);
    else next.delete(id);
  }
  return [...next];
}
export function roleFingerprint(value: {
  code: string;
  name: string;
  description: string;
  status: string;
  permissions: readonly string[];
}): string {
  return JSON.stringify([value.code, value.name, value.description, value.status, [...new Set(value.permissions)].sort()]);
}
