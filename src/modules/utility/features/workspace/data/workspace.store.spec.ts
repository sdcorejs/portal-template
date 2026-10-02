import { WorkspaceStore } from './workspace.store';

describe('Workspace demo contracts', () => {
  let store: WorkspaceStore;
  beforeEach(() => {
    store = new WorkspaceStore();
    spyOn(store, 'wait').and.resolveTo();
  });
  afterEach(() => store.ngOnDestroy());

  it('resets isolated seed data without retaining edits or uploaded files', async () => {
    const other = new WorkspaceStore();
    expect(store.requests().length).toBe(24);
    await store.addFile(new File(['hello'], 'notes.txt', { type: 'text/plain' }), 'incoming');
    store.approve([store.requests()[0].id]);
    store.reset();
    expect(store.requests()).toEqual(other.requests());
    expect(store.files().some(item => item.name === 'notes.txt')).toBeFalse();
    other.ngOnDestroy();
  });

  it('publishes an independent schema snapshot and leaves existing record schemas intact', async () => {
    const original = structuredClone(store.publishedSchema());
    const edited = structuredClone(store.draftSchema());
    edited.pages[0].elements[0].label = 'Nhãn mới';
    store.draftSchema.set(edited);
    expect(store.publishedSchema()).toEqual(original);
    store.publishSchema();
    edited.pages[0].elements[0].label = 'Không được rò sang bản áp dụng';
    expect(store.publishedSchema().pages[0].elements[0].label).toBe('Nhãn mới');
    expect(store.requests()[0].schema).toEqual(original);
  });

  it('keeps failed submissions unchanged, then links the saved request to its actual attachments', async () => {
    const file = await store.addFile(new File(['demo'], 'brief.txt', { type: 'text/plain' }), 'incoming');
    store.failNextSave.set(true);
    await expectAsync(store.submit({ project: 'Dự án Demo', amount: 2000 }, [file.id])).toBeRejected();
    expect(store.requests().length).toBe(24);
    const saved = await store.submit({ project: 'Dự án Demo', amount: 2000 }, [file.id]);
    expect(saved.attachments).toEqual([file.id]);
    expect(saved.code).toBe('REQ-0025');
    expect(saved.status).toBe('pending');
    expect(store.requests()[0].id).toBe(saved.id);
    expect(store.history()[0].title).toContain(saved.code);
  });

  it('approves only pending records and records a real before/after diff', () => {
    const pending = store.requests().find(row => row.status === 'pending');
    const approved = store.requests().find(row => row.status === 'approved');
    expect(store.approve([pending.id, approved.id, 'missing'])).toBe(1);
    expect(store.requests().find(row => row.id === pending.id).status).toBe('approved');
    expect(store.lastChange().before['status']).toBe('pending');
    expect(store.lastChange().after['status']).toBe('approved');
    expect(store.approve([pending.id])).toBe(0);
  });

  it('rejects oversized files, unsupported extensions and duplicate folder names', async () => {
    await expectAsync(store.addFile(new File(['demo'], 'bad.exe'), null)).toBeRejected();
    await expectAsync(store.addFile(new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.txt'), null)).toBeRejected();
    expect(() => store.createFolder(null, 'Tài liệu tham khảo')).toThrowError();
    expect(store.createFolder(null, '  Mới  ').name).toBe('Mới');
    const before = store.fileCount();
    await expectAsync(store.uploadAttachments([new File(['valid'], 'valid.txt'), new File(['invalid'], 'invalid.exe')])).toBeRejected();
    expect(store.fileCount()).toBe(before);
  });

  it('does not commit an aborted upload or a pending submission after Reset', async () => {
    let release: () => void;
    (store.wait as jasmine.Spy).and.callFake(() => new Promise<void>(resolve => (release = resolve)));
    const controller = new AbortController();
    const upload = store.addFile(new File(['demo'], 'cancelled.txt'), null, controller.signal);
    controller.abort();
    release();
    await expectAsync(upload).toBeRejected();
    expect(store.files().some(item => item.name === 'cancelled.txt')).toBeFalse();
    const submit = store.submit({ project: 'Too late' }, []);
    store.reset();
    release();
    await expectAsync(submit).toBeRejected();
    expect(store.requests().length).toBe(24);
  });
});
