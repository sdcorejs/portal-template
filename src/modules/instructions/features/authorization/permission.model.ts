export interface PermissionGroup {
  code: string;
  label: string;
  permissions: readonly string[];
}
export const PERMISSION_GROUPS: readonly PermissionGroup[] = [
  { code: 'CRM_CUSTOMER_G_VIEW', label: 'Xem khách hàng', permissions: ['CRM_CUSTOMER_C_VIEW', 'CRM_CUSTOMER_A_VIEW'] },
  { code: 'CRM_CUSTOMER_G_CREATE', label: 'Tạo khách hàng', permissions: ['CRM_CUSTOMER_C_CREATE', 'CRM_CUSTOMER_A_CREATE'] },
  {
    code: 'CRM_ORDER_G_CREATE',
    label: 'Tạo đơn hàng kèm khách hàng',
    permissions: ['CRM_ORDER_C_CREATE', 'CRM_ORDER_A_CREATE', 'CRM_CUSTOMER_C_CREATE', 'CRM_CUSTOMER_A_CREATE'],
  },
];
/** Always derive the union from remaining groups so shared grants survive revocation. */
export function effectivePermissions(selected: readonly string[]): string[] {
  return [...new Set(PERMISSION_GROUPS.filter(group => selected.includes(group.code)).flatMap(group => group.permissions))];
}
export interface ScopedRecord {
  id: string;
  name: string;
  ownerId: string;
}
export function canViewRecord(
  hasView: boolean,
  userId: string,
  record: ScopedRecord,
  assignments: readonly { userId: string; recordId: string; active: boolean }[]
): boolean {
  return (
    hasView && (record.ownerId === userId || assignments.some(item => item.active && item.userId === userId && item.recordId === record.id))
  );
}
