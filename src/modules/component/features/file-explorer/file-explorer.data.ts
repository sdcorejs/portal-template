import { Injectable, signal } from '@angular/core';
import type { SdFileExplorerItem, SdFileExplorerMoveRequest } from '@sdcorejs/angular/components/file-explorer';

export interface ExplorerDemoData {
  ownerName: string;
  classification: 'team' | 'private';
  locked: boolean;
  reviewed: boolean;
}
export type ExplorerDemoItem = SdFileExplorerItem<ExplorerDemoData>;

export function explorerDemoSeed(): ExplorerDemoItem[] {
  const data = (ownerName: string, classification: ExplorerDemoData['classification'] = 'team', locked = false): ExplorerDemoData => ({
    ownerName,
    classification,
    locked,
    reviewed: false,
  });
  return [
    { id: 'incoming', parentId: null, name: 'Đang xử lý', kind: 'folder', hasChildren: false, data: data('Nhóm Sản phẩm') },
    { id: 'archive', parentId: null, name: 'Lưu trữ', kind: 'folder', hasChildren: false, data: data('Nhóm Vận hành') },
    { id: 'empty', parentId: null, name: 'Thư mục trống', kind: 'folder', hasChildren: false },
    { id: 'brief', parentId: null, name: 'Brief-Nova.txt', kind: 'file', mimeType: 'text/plain', size: 96, data: data('Linh (demo)') },
    {
      id: 'budget',
      parentId: null,
      name: 'Budget-Nova.json',
      kind: 'file',
      mimeType: 'application/json',
      size: 64,
      data: data('Minh (demo)'),
    },
    {
      id: 'locked',
      parentId: null,
      name: 'Locked-notes.txt',
      kind: 'file',
      mimeType: 'text/plain',
      size: 48,
      data: data('An (demo)', 'private', true),
    },
    {
      id: 'concept',
      parentId: 'incoming',
      name: 'Nova-concept.svg',
      kind: 'file',
      mimeType: 'image/svg+xml',
      size: 420,
      data: data('Linh (demo)'),
    },
  ];
}

export function canMoveExplorerDemoFiles(
  rows: readonly ExplorerDemoItem[],
  items: readonly ExplorerDemoItem[],
  target: ExplorerDemoItem | null
): boolean {
  if (!items.length || new Set(items.map(item => item.id)).size !== items.length) return false;
  if (target && !rows.some(row => row.id === target.id && row.kind === 'folder')) return false;
  return items.every(item =>
    rows.some(row => row.id === item.id && row.kind === 'file' && !row.data?.locked && row.parentId !== (target?.id ?? null))
  );
}

export function moveExplorerDemoFiles(
  rows: readonly ExplorerDemoItem[],
  items: readonly ExplorerDemoItem[],
  target: ExplorerDemoItem | null
): ExplorerDemoItem[] {
  if (!canMoveExplorerDemoFiles(rows, items, target)) throw new Error('Tệp hoặc thư mục đích không còn đủ điều kiện di chuyển.');
  const ids = new Set(items.map(item => item.id));
  // Đổi vị trí lưu trữ, giữ nguyên DTO để metadata không mất khi đổi thư mục.
  return rows.map(row => (ids.has(row.id) ? { ...row, parentId: target?.id ?? null } : row));
}

@Injectable()
export class FileExplorerDemoStore {
  readonly rows = signal(explorerDemoSeed());
  readonly readOnly = signal(false);
  readonly failReads = signal(false);
  readonly failNextMove = signal(false);
  readonly failRefreshAfterMove = signal(false);
  readonly refreshBlocked = signal(false);
  readonly moveAttempts = signal(0);
  readonly moveCommits = signal(0);
  private generation = 0;
  private counter = 0;
  private readonly content = new Map<string, Blob>();

  constructor() {
    this.reset();
  }

  reset(): void {
    this.generation++;
    this.rows.set(explorerDemoSeed());
    this.readOnly.set(false);
    this.failReads.set(false);
    this.failNextMove.set(false);
    this.failRefreshAfterMove.set(false);
    this.refreshBlocked.set(false);
    this.moveAttempts.set(0);
    this.moveCommits.set(0);
    this.content.clear();
    this.content.set(
      'brief',
      new Blob(['NOVA DEMO\nFictional workspace brief. All files stay in this browser session.'], { type: 'text/plain' })
    );
    this.content.set(
      'budget',
      new Blob([JSON.stringify({ project: 'Nova', budget: 120, unit: 'million VND' }, null, 2)], { type: 'application/json' })
    );
    this.content.set(
      'locked',
      new Blob(['Private fictional note. Selection/move/share are disabled in this demo.'], { type: 'text/plain' })
    );
    this.content.set(
      'concept',
      new Blob(
        [
          '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="400"><rect width="720" height="400" rx="24" fill="#eff6ff"/><text x="48" y="100" font-family="sans-serif" font-size="36" fill="#005cbb">NOVA / DEMO</text><rect x="48" y="160" width="280" height="160" rx="16" fill="#dbeafe"/><rect x="360" y="160" width="280" height="160" rx="16" fill="#dcfce7"/></svg>',
        ],
        { type: 'image/svg+xml' }
      )
    );
  }

  async wait(signal: AbortSignal, milliseconds = 180): Promise<void> {
    signal.throwIfAborted();
    await new Promise<void>((resolve, reject) => {
      const cancel = () => {
        clearTimeout(timer);
        reject(new DOMException('Đã hủy thao tác.', 'AbortError'));
      };
      const timer = setTimeout(() => {
        signal.removeEventListener('abort', cancel);
        resolve();
      }, milliseconds);
      signal.addEventListener('abort', cancel, { once: true });
    });
    signal.throwIfAborted();
  }

  async list(parentId: string | null, signal: AbortSignal, keyword = ''): Promise<ExplorerDemoItem[]> {
    await this.wait(signal);
    if (this.failReads() || this.refreshBlocked()) throw new Error('Demo chưa đọc được danh sách. Khôi phục đọc rồi thử lại.');
    return this.rows().filter(
      item => item.parentId === parentId && item.name.toLocaleLowerCase('vi').includes(keyword.toLocaleLowerCase('vi'))
    );
  }

  blob(id: string): Blob {
    return this.content.get(id) ?? new Blob(['Fictional demo file.'], { type: 'text/plain' });
  }

  canMove(request: SdFileExplorerMoveRequest<ExplorerDemoData>): boolean {
    return !this.readOnly() && canMoveExplorerDemoFiles(this.rows(), request.items, request.targetFolder);
  }

  async move(request: SdFileExplorerMoveRequest<ExplorerDemoData>): Promise<void> {
    const generation = this.generation;
    this.moveAttempts.update(count => count + 1);
    await this.wait(request.signal, 420);
    if (generation !== this.generation) throw new DOMException('Phiên demo đã khôi phục.', 'AbortError');
    if (this.failNextMove()) {
      this.failNextMove.set(false);
      throw new Error('Giả lập lỗi di chuyển; dữ liệu chưa thay đổi.');
    }
    if (!this.canMove(request)) throw new Error('Di chuyển đã bị khóa hoặc tệp đã đổi vị trí.');
    this.rows.update(rows => moveExplorerDemoFiles(rows, request.items, request.targetFolder));
    this.moveCommits.update(count => count + 1);
    if (this.failRefreshAfterMove()) {
      this.failRefreshAfterMove.set(false);
      this.refreshBlocked.set(true);
    }
  }

  markReviewed(items: readonly ExplorerDemoItem[]): void {
    if (this.readOnly()) return;
    const ids = new Set(items.filter(item => !item.data?.locked).map(item => item.id));
    this.rows.update(rows => rows.map(row => (ids.has(row.id) && row.data ? { ...row, data: { ...row.data, reviewed: true } } : row)));
  }

  async upload(
    file: File,
    parentId: string | null,
    signal: AbortSignal,
    progress: (loaded: number, total?: number) => void
  ): Promise<void> {
    if (this.readOnly()) throw new Error('Kho đang ở chế độ chỉ đọc.');
    if (file.size > 1024 * 1024) throw new Error('Demo nhận tệp tối đa 1 MB.');
    const generation = this.generation;
    for (let step = 1; step <= 3; step++) {
      await this.wait(signal, 120);
      progress(Math.round((file.size * step) / 3), file.size);
    }
    if (generation !== this.generation) throw new DOMException('Phiên demo đã khôi phục.', 'AbortError');
    if (this.readOnly()) throw new Error('Kho đang ở chế độ chỉ đọc. Tệp chưa được lưu.');
    const id = 'local-' + ++this.counter;
    this.content.set(id, file);
    this.rows.update(rows => [
      ...rows,
      {
        id,
        parentId,
        name: file.name,
        kind: 'file',
        mimeType: file.type,
        size: file.size,
        data: { ownerName: 'Bạn (demo)', classification: 'team', locked: false, reviewed: false },
      },
    ]);
  }
}
