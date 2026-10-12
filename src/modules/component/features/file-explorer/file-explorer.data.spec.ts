import { canMoveExplorerDemoFiles, FileExplorerDemoStore, explorerDemoSeed, moveExplorerDemoFiles } from './file-explorer.data';

describe('File Explorer consumer storage', () => {
  it('moves selected files together and preserves DTO identity without mutating the seed', () => {
    const seed = explorerDemoSeed(),
      files = seed.filter(row => ['brief', 'budget'].includes(row.id));
    const target = seed.find(row => row.id === 'archive')!;
    const moved = moveExplorerDemoFiles(seed, files, target);
    expect(moved.filter(row => row.parentId === 'archive').map(row => row.id)).toEqual(['brief', 'budget']);
    expect(moved.find(row => row.id === 'brief')!.data).toBe(files[0].data);
    expect(files[0].parentId).toBeNull();
  });
  it('rejects locked files, missing destinations and no-op/root moves', () => {
    const seed = explorerDemoSeed(),
      archive = seed.find(row => row.id === 'archive')!,
      brief = seed.find(row => row.id === 'brief')!;
    expect(canMoveExplorerDemoFiles(seed, [seed.find(row => row.id === 'locked')!], archive)).toBeFalse();
    expect(canMoveExplorerDemoFiles(seed, [brief], { id: 'missing', parentId: null, name: 'Missing', kind: 'folder' })).toBeFalse();
    expect(canMoveExplorerDemoFiles(seed, [brief], null)).toBeFalse();
    expect(canMoveExplorerDemoFiles(seed, [brief, brief], archive)).toBeFalse();
  });
  it('can return a file to root after a committed move', () => {
    const seed = explorerDemoSeed(),
      brief = seed.find(row => row.id === 'brief')!,
      archive = seed.find(row => row.id === 'archive')!;
    const moved = moveExplorerDemoFiles(seed, [brief], archive),
      current = moved.find(row => row.id === 'brief')!;
    expect(moveExplorerDemoFiles(moved, [current], null).find(row => row.id === 'brief')!.parentId).toBeNull();
  });
  it('does not commit an upload if read-only is enabled while transferring', async () => {
    const store = new FileExplorerDemoStore();
    const pending = store.upload(new File(['fictional'], 'late-readonly.txt'), null, new AbortController().signal, () => {
      store.readOnly.set(true);
    });
    await expectAsync(pending).toBeRejectedWithError(/chỉ đọc/);
    expect(store.rows().some(row => row.name === 'late-readonly.txt')).toBeFalse();
  });
  it('does not repopulate a reset session with an upload already in progress', async () => {
    const store = new FileExplorerDemoStore();
    let reset = false;
    const pending = store.upload(new File(['fictional'], 'stale-session.txt'), null, new AbortController().signal, () => {
      if (!reset) {
        reset = true;
        store.reset();
      }
    });
    await expectAsync(pending).toBeRejectedWithError(DOMException, /khôi phục/);
    expect(store.rows().map(row => row.id)).toEqual(explorerDemoSeed().map(row => row.id));
  });
  it('aborts an in-flight upload without adding a file', async () => {
    const store = new FileExplorerDemoStore(),
      controller = new AbortController();
    const pending = store.upload(new File(['fictional'], 'cancelled.txt'), null, controller.signal, () => controller.abort());
    await expectAsync(pending).toBeRejected();
    expect(store.rows().some(row => row.name === 'cancelled.txt')).toBeFalse();
  });
});
