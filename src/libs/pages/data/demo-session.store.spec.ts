import { DemoSessionStore } from './demo-session.store';
describe('CASE-SESSION — isolated CRUD', () => {
  it('keeps sessions isolated and resets deterministically', () => {
    const a = new DemoSessionStore(),
      b = new DemoSessionStore();
    a.reset();
    b.reset();
    a.records.set([]);
    expect(b.records().length).toBe(30);
    a.reset();
    expect(a.records()).toEqual(b.records());
  });
  it('preserves immutable identifiers and records on failed save', async () => {
    const s = new DemoSessionStore();
    s.reset('customer');
    const row = s.records()[0];
    s.failNextSave.set(true);
    await expectAsync(s.save({ ...row, name: 'Updated' }, row.id)).toBeRejected();
    expect(s.records()[0].name).toBe(row.name);
    const result = await s.save({ ...row, code: 'HACK', name: 'Updated' }, row.id);
    expect(result.code).toBe(row.code);
    expect(result.name).toBe('Updated');
  });
  it('creates a distinct record and rejects stale updates', async () => {
    const s = new DemoSessionStore();
    s.reset();
    const row = s.records()[0];
    const result = await s.save({ ...row, code: 'NEW-001' });
    expect(result.id).not.toBe(row.id);
    expect(s.records().length).toBe(31);
    await expectAsync(s.save(row, 'missing')).toBeRejected();
  });
});

describe('CASE-PERSISTENCE — browser session repository', () => {
  function fastStore() {
    const store = new DemoSessionStore();
    spyOn(store, 'wait').and.resolveTo();
    return store;
  }
  afterEach(() => sessionStorage.removeItem('portal-pages:v1:category'));
  it('restores saved records across mounts and allocates another unique ID', async () => {
    const first = fastStore();
    await first.openSession('category');
    const seed = first.records()[0];
    const created = await first.save({ ...seed, code: 'SESSION-ONE', name: 'Persisted category' });
    const next = fastStore();
    await next.openSession('category');
    expect(next.records().find(row => row.id === created.id)?.name).toBe('Persisted category');
    const second = await next.save({ ...seed, code: 'SESSION-TWO' });
    expect(second.id).not.toBe(created.id);
    expect(next.records().length).toBe(32);
  });
  it('retains the original data when session storage rejects a write', async () => {
    const store = fastStore();
    await store.openSession('category');
    const original = store.records()[0];
    spyOn(sessionStorage, 'setItem').and.throwError('Storage full');
    await expectAsync(store.save({ ...original, name: 'Unsaved' }, original.id)).toBeRejected();
    expect(store.records()[0].name).toBe(original.name);
    expect(store.saving()).toBeFalse();
  });
  it('recovers a malformed session and persists a selected status update', async () => {
    sessionStorage.setItem('portal-pages:v1:category', '{bad');
    const store = fastStore();
    await store.openSession('category');
    expect(store.records().length).toBe(30);
    const target = store.records()[1];
    await store.updateStatus([target.id], 'active');
    const next = fastStore();
    await next.openSession('category');
    expect(next.records().find(row => row.id === target.id)?.status).toBe('active');
    expect(next.records()[2].status).toBe('inactive');
  });
});
