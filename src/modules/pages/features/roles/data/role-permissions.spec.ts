import { ROLE_MODULES, ROLE_SEEDS } from './role.fixtures';
import { permissionsFor, selectionState, setPermissionScope, roleFingerprint } from './role-permissions';
import { emptyRole } from './role.model';
import { RoleSessionStore } from './role-session.store';

describe('Role permission selection', () => {
  it('uses only unique module/entity/group/action permission IDs', () => {
    const ids = ROLE_MODULES.flatMap(m => m.entities.flatMap(e => permissionsFor(m, e).map(p => p.id)));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every(id => /^[A-Z]+_[A-Z_]+_G_[A-Z_]+$/.test(id))).toBeTrue();
    expect(ROLE_SEEDS.every(row => row.permissions.every(id => ids.includes(id)))).toBeTrue();
  });
  it('selects only the filtered scope, preserves hidden grants, and supports mixed/empty scope', () => {
    const selected = ['CRM_CUSTOMER_G_VIEW', 'SALES_ORDER_G_VIEW'];
    const scope = ['CRM_CUSTOMER_G_VIEW', 'CRM_CUSTOMER_G_CREATE'];
    expect(selectionState(selected, scope)).toEqual({ count: 1, checked: false, mixed: true });
    const all = setPermissionScope(selected, scope, true);
    expect(selectionState(all, scope)).toEqual({ count: 2, checked: true, mixed: false });
    expect(setPermissionScope(all, scope, false)).toEqual(['SALES_ORDER_G_VIEW']);
    expect(selectionState(selected, [])).toEqual({ count: 0, checked: false, mixed: false });
    expect(setPermissionScope([], ['CRM_CUSTOMER_G_CREATE'], true)).toEqual(['CRM_CUSTOMER_G_CREATE']);
  });
  it('ignores permission ordering for unsaved changes', () => {
    const row = ROLE_SEEDS[0];
    expect(roleFingerprint(row)).toBe(roleFingerprint({ ...row, permissions: [...row.permissions].reverse() }));
    expect(roleFingerprint(row)).not.toBe(roleFingerprint({ ...row, name: 'Changed' }));
  });
});
describe('Role session persistence', () => {
  let store: RoleSessionStore;
  beforeEach(() => {
    store = new RoleSessionStore();
    sessionStorage.removeItem(store.key('matrix'));
    sessionStorage.removeItem(store.key('tree'));
    spyOn(store, 'delay').and.resolveTo();
  });
  afterEach(() => {
    sessionStorage.removeItem(store.key('matrix'));
    sessionStorage.removeItem(store.key('tree'));
  });
  it('creates a zero-permission role, reloads, updates it, and isolates examples', async () => {
    const created = await store.save('matrix', { ...emptyRole(), code: 'ROLE-NEW', name: 'New role' });
    expect(created.id).toMatch(/^role-/);
    expect((await new RoleSessionStore().read('matrix')).find(r => r.id === created.id)?.permissions).toEqual([]);
    await store.save('matrix', { ...created, name: 'Edited role', permissions: ['CRM_CUSTOMER_G_CREATE'] });
    expect(store.read('matrix').find(r => r.id === created.id)?.name).toBe('Edited role');
    expect(store.read('tree').some(r => r.id === created.id)).toBeFalse();
  });
  it('rejects duplicates, invalid permission IDs and missing update IDs without writing', async () => {
    await expectAsync(store.save('matrix', { ...emptyRole(), code: ROLE_SEEDS[0].code, name: 'Duplicate' })).toBeRejectedWithError(
      /đã tồn tại/
    );
    await expectAsync(
      store.save('matrix', { ...emptyRole(), code: 'NEW', name: 'New', permissions: ['CRM_CUSTOMER_C_CREATE'] })
    ).toBeRejectedWithError(/danh mục/);
    await expectAsync(store.save('matrix', { ...ROLE_SEEDS[0], id: 'missing' })).toBeRejectedWithError(/không còn/);
    expect(sessionStorage.getItem(store.key('matrix'))).toBeNull();
  });
  it('preserves corrupt data and propagates storage failures without mutating the draft', async () => {
    sessionStorage.setItem(store.key('matrix'), '{broken');
    await expectAsync(store.list('matrix')).toBeRejected();
    expect(sessionStorage.getItem(store.key('matrix'))).toBe('{broken');
    sessionStorage.removeItem(store.key('matrix'));
    const draft = { ...emptyRole(), code: 'NEW', name: ' Draft ' };
    spyOn(Storage.prototype, 'setItem').and.throwError('Storage unavailable');
    await expectAsync(store.save('matrix', draft)).toBeRejectedWithError('Storage unavailable');
    expect(draft.name).toBe(' Draft ');
    expect(draft.id).toBe('');
  });
});
