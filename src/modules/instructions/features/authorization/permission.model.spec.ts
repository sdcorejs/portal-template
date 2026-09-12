import { canViewRecord, effectivePermissions, PERMISSION_GROUPS } from './permission.model';
describe('Instructions permission examples', () => {
  it('keeps customer grants when another assigned group still supplies them', () => {
    const remaining = effectivePermissions(['CRM_ORDER_G_CREATE']);
    expect(remaining).toContain('CRM_CUSTOMER_C_CREATE');
    expect(remaining).toContain('CRM_CUSTOMER_A_CREATE');
    expect(effectivePermissions([])).not.toContain('CRM_CUSTOMER_A_CREATE');
  });
  it('ignores unknown groups and direct technical permissions in role assignment', () => {
    expect(effectivePermissions(['CRM_CUSTOMER_A_CREATE', 'UNKNOWN'])).toEqual([]);
  });
  it('exposes only business groups and follows the agreed code order', () => {
    for (const group of PERMISSION_GROUPS) {
      expect(group.code).toMatch(/^[A-Z]+_[A-Z]+_G_[A-Z]+$/);
      for (const permission of group.permissions) expect(permission).toMatch(/^[A-Z]+_[A-Z]+_[CA]_[A-Z]+$/);
    }
    const grants = effectivePermissions(['CRM_CUSTOMER_G_CREATE', 'CRM_ORDER_G_CREATE']);
    expect(grants.filter(item => item === 'CRM_CUSTOMER_A_CREATE').length).toBe(1);
  });
  it('requires action permission even for the owner and an assigned user', () => {
    const record = { id: 'CUS-1', name: 'Example', ownerId: 'lan' };
    expect(canViewRecord(false, 'lan', record, [])).toBeFalse();
    expect(canViewRecord(false, 'minh', record, [{ userId: 'minh', recordId: 'CUS-1', active: true }])).toBeFalse();
  });
  it('limits assignment to the same user, record and active lifetime', () => {
    const record = { id: 'CUS-1', name: 'Example', ownerId: 'lan' };
    expect(canViewRecord(true, 'lan', record, [])).toBeTrue();
    expect(canViewRecord(true, 'minh', record, [{ userId: 'minh', recordId: 'CUS-1', active: true }])).toBeTrue();
    expect(canViewRecord(true, 'minh', record, [{ userId: 'minh', recordId: 'CUS-1', active: false }])).toBeFalse();
    expect(canViewRecord(true, 'minh', record, [{ userId: 'other', recordId: 'CUS-1', active: true }])).toBeFalse();
    expect(canViewRecord(true, 'minh', record, [{ userId: 'minh', recordId: 'CUS-2', active: true }])).toBeFalse();
  });
});
