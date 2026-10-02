import { computed, Injectable, signal, type OnDestroy } from '@angular/core';
import type { SdFileExplorerItem } from '@sdcorejs/angular/components/file-explorer';
import type { SdFormGenericSchema } from '@sdcorejs/angular/components/form-generic';
import type { SdHistoryItem } from '@sdcorejs/angular/components/history';
import type { SdUploadFileDetail } from '@sdcorejs/angular/components/upload-file';
import { WORKSPACE_SCHEMA, WORKSPACE_SAMPLE_VALUE, WORKSPACE_TEAMS } from './workspace.seed';

export interface WorkspaceRequest {
  id: string;
  code: string;
  project: string;
  team: string;
  amount: number;
  status: 'pending' | 'approved' | 'returned';
  createdAt: string;
  data: Record<string, unknown>;
  schema: SdFormGenericSchema;
  attachments: string[];
}
export interface WorkspaceChange {
  title: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
}

/** Demo-only session owner; no storage endpoint or persistence outside this route. */
@Injectable()
export class WorkspaceStore implements OnDestroy {
  readonly requests = signal<WorkspaceRequest[]>([]);
  readonly files = signal<SdFileExplorerItem[]>([]);
  readonly history = signal<SdHistoryItem['items']>([]);
  readonly lastChange = signal<WorkspaceChange | null>(null);
  readonly publishedSchema = signal<SdFormGenericSchema>(structuredClone(WORKSPACE_SCHEMA));
  readonly draftSchema = signal<SdFormGenericSchema>(structuredClone(WORKSPACE_SCHEMA));
  readonly draftValue = signal<Record<string, unknown>>({});
  readonly attachmentIds = signal<(string | number)[]>([]);
  readonly schemaVersion = signal(1);
  readonly failNextSave = signal(false);
  readonly resetVersion = signal(0);
  readonly schemaChanged = computed(() => JSON.stringify(this.draftSchema()) !== JSON.stringify(this.publishedSchema()));
  readonly fieldCount = computed(() => this.countFields(this.draftSchema()));
  readonly pendingCount = computed(() => this.requests().filter(row => row.status === 'pending').length);
  readonly fileCount = computed(() => this.files().filter(item => item.kind === 'file').length);
  private readonly blobs = new Map<string, Blob>();
  private readonly urls = new Map<string, string>();
  private counter = 24;
  private fileCounter = 0;
  private generation = 0;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.generation++;
    this.releaseUrls();
    this.counter = 24;
    this.fileCounter = 0;
    this.schemaVersion.set(1);
    this.publishedSchema.set(structuredClone(WORKSPACE_SCHEMA));
    this.draftSchema.set(structuredClone(WORKSPACE_SCHEMA));
    this.draftValue.set({});
    this.attachmentIds.set([]);
    this.failNextSave.set(false);
    this.lastChange.set(null);
    this.requests.set(
      Array.from({ length: 24 }, (_, index) => {
        const project =
          ['Không gian Nova', 'Sự kiện Mây', 'Thiết bị Orion', 'Studio Lá'][index % 4] + ' · Đợt ' + (Math.floor(index / 4) + 1);
        const team = WORKSPACE_TEAMS[index % 3].id;
        const data = { ...structuredClone(WORKSPACE_SAMPLE_VALUE), project, team, amount: (index + 1) * 1500000 };
        return {
          id: 'request-' + (index + 1),
          code: 'REQ-' + String(index + 1).padStart(4, '0'),
          project,
          team,
          amount: data.amount,
          status: (['pending', 'approved', 'returned'] as const)[index % 3],
          createdAt: '2026-10-' + String((index % 2) + 1).padStart(2, '0') + 'T08:00:00Z',
          data,
          schema: structuredClone(WORKSPACE_SCHEMA),
          attachments: [],
        };
      })
    );
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540"><rect width="960" height="540" fill="#eff6ff"/><rect x="80" y="80" width="800" height="380" rx="24" fill="#ffffff" stroke="#005cbb" stroke-width="4"/><text x="120" y="170" font-family="sans-serif" font-size="36" fill="#005cbb">NOVA / WORKSPACE</text><text x="120" y="235" font-family="sans-serif" font-size="24" fill="#334155">Demo concept - fictional project</text><rect x="120" y="300" width="200" height="100" rx="12" fill="#dbeafe"/><rect x="360" y="300" width="200" height="100" rx="12" fill="#dcfce7"/><rect x="600" y="300" width="200" height="100" rx="12" fill="#fef3c7"/></svg>';
    this.blobs.clear();
    this.blobs.set(
      'readme',
      new Blob(['WORKSPACE DEMO\nAll records are fictional. Uploads stay in browser memory. Reset restores the seed.'], {
        type: 'text/plain',
      })
    );
    this.blobs.set('concept', new Blob([svg], { type: 'image/svg+xml' }));
    this.blobs.set('schema-file', new Blob([JSON.stringify(WORKSPACE_SCHEMA, null, 2)], { type: 'application/json' }));
    this.files.set([
      { id: 'incoming', parentId: null, name: 'Đính kèm đề nghị', kind: 'folder', hasChildren: false },
      { id: 'reference', parentId: null, name: 'Tài liệu tham khảo', kind: 'folder', hasChildren: true },
      { id: 'templates', parentId: null, name: 'Biểu mẫu', kind: 'folder', hasChildren: false },
      { id: 'empty-folder', parentId: 'reference', name: 'Lưu trữ trống', kind: 'folder', hasChildren: false },
      {
        id: 'readme',
        parentId: null,
        name: 'Hướng dẫn demo.txt',
        kind: 'file',
        mimeType: 'text/plain',
        size: this.blobs.get('readme').size,
      },
      {
        id: 'concept',
        parentId: 'reference',
        name: 'Nova-concept.svg',
        kind: 'file',
        mimeType: 'image/svg+xml',
        size: this.blobs.get('concept').size,
        thumbnailUrl: 'data:image/svg+xml,' + encodeURIComponent(svg),
      },
      {
        id: 'schema-file',
        parentId: 'templates',
        name: 'de-nghi.schema.json',
        kind: 'file',
        mimeType: 'application/json',
        size: this.blobs.get('schema-file').size,
      },
    ]);
    this.history.set([
      {
        title: 'Workspace demo đã khởi tạo',
        date: '2026-10-02T08:00:00Z',
        actor: 'demo',
        source: 'Dữ liệu mẫu',
        description: '24 đề nghị giả lập. Thiết kế biểu mẫu, gửi hồ sơ và theo dõi thay đổi trong cùng phiên.',
      },
    ]);
    this.resetVersion.update(value => value + 1);
  }

  publishSchema(): void {
    const before = { version: this.schemaVersion(), fields: this.countFields(this.publishedSchema()) };
    this.publishedSchema.set(structuredClone(this.draftSchema()));
    this.schemaVersion.update(version => version + 1);
    this.lastChange.set({ title: 'Áp dụng biểu mẫu', before, after: { version: this.schemaVersion(), fields: this.fieldCount() } });
    this.recordEvent('Áp dụng biểu mẫu v' + this.schemaVersion(), 'Hồ sơ cũ giữ schema tại thời điểm gửi.');
  }

  async submit(data: Record<string, unknown>, attachmentIds: string[]): Promise<WorkspaceRequest> {
    const generation = this.generation;
    const schema = structuredClone(this.publishedSchema());
    const snapshot = structuredClone(data);
    await this.wait();
    this.assertCurrent(generation);
    if (this.failNextSave()) {
      this.failNextSave.set(false);
      throw new Error('Mô phỏng gửi thất bại. Bản nháp vẫn được giữ; bạn có thể thử lại.');
    }
    const number = ++this.counter;
    const row: WorkspaceRequest = {
      id: 'request-' + number,
      code: 'REQ-' + String(number).padStart(4, '0'),
      project: String(snapshot['project'] || 'Đề nghị tùy chỉnh'),
      team: String(snapshot['team'] || 'operations'),
      amount: typeof snapshot['amount'] === 'number' ? snapshot['amount'] : 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      data: snapshot,
      schema,
      attachments: attachmentIds.filter(id => this.blobs.has(id)),
    };
    this.requests.update(rows => [row, ...rows]);
    this.recordEvent('Đã gửi ' + row.code, row.project + ' · ' + row.attachments.length + ' tài liệu đính kèm');
    return row;
  }

  approve(ids: string[]): number {
    const selected = new Set(ids);
    const changed = this.requests().filter(row => selected.has(row.id) && row.status === 'pending');
    if (!changed.length) return 0;
    this.requests.update(rows =>
      rows.map(row => (selected.has(row.id) && row.status === 'pending' ? { ...row, status: 'approved' } : row))
    );
    const first = changed[0];
    this.lastChange.set({
      title: 'Duyệt ' + first.code,
      before: { code: first.code, project: first.project, status: first.status },
      after: { code: first.code, project: first.project, status: 'approved' },
    });
    this.recordEvent('Đã duyệt ' + changed.length + ' đề nghị', changed.map(row => row.code).join(', '));
    return changed.length;
  }

  createFolder(parentId: string | null, rawName: string): SdFileExplorerItem {
    const name = rawName.trim();
    if (!name || /[\\/]/.test(name)) throw new Error('Tên thư mục không được rỗng hoặc chứa dấu phân cách.');
    if (this.files().some(item => item.parentId === parentId && item.name.toLocaleLowerCase() === name.toLocaleLowerCase()))
      throw new Error('Tên này đã tồn tại trong thư mục.');
    const folder: SdFileExplorerItem = { id: 'folder-' + ++this.fileCounter, parentId, name, kind: 'folder', hasChildren: false };
    this.files.update(items => [...items.map(item => (item.id === parentId ? { ...item, hasChildren: true } : item)), folder]);
    this.recordEvent('Tạo thư mục ' + name, 'Kho tài liệu của phiên demo.');
    return folder;
  }

  async addFile(
    file: File,
    parentId: string | null,
    signal?: AbortSignal,
    progress?: (loaded: number, total?: number) => void
  ): Promise<SdFileExplorerItem> {
    const generation = this.generation;
    this.validateFile(file);
    progress?.(0, file.size);
    await this.wait(signal);
    this.assertCurrent(generation, signal);
    const item: SdFileExplorerItem = {
      id: 'file-' + ++this.fileCounter,
      parentId,
      name: file.name,
      kind: 'file',
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      modifiedAt: new Date().toISOString(),
    };
    this.blobs.set(item.id, file);
    this.files.update(items => [...items.map(folder => (folder.id === parentId ? { ...folder, hasChildren: true } : folder)), item]);
    progress?.(file.size, file.size);
    this.recordEvent('Thêm tài liệu ' + file.name, 'File được giữ trong bộ nhớ trình duyệt.');
    return item;
  }

  content(id: string): Blob {
    const blob = this.blobs.get(id);
    if (!blob) throw new Error('File không còn trong phiên. Hãy tải lại danh sách.');
    return blob;
  }
  readonly uploadAttachments = async (files: File[]): Promise<string[]> => {
    files.forEach(file => this.validateFile(file));
    const items = await Promise.all(files.map(file => this.addFile(file, 'incoming')));
    return items.map(item => item.id);
  };
  readonly attachmentDetails = async (keys: (string | number)[]): Promise<SdUploadFileDetail[]> =>
    keys.flatMap(key => {
      const item = this.files().find(file => file.id === String(key));
      if (!item || !this.blobs.has(item.id)) return [];
      if (!this.urls.has(item.id)) this.urls.set(item.id, URL.createObjectURL(this.content(item.id)));
      return [
        {
          idOrKey: item.id,
          cdn: this.urls.get(item.id),
          name: item.name,
          extension: item.name.split('.').pop(),
          size: (item.size ?? 0) / 1024 / 1024,
        },
      ];
    });
  recordEvent(title: string, description: string): void {
    this.history.update(items =>
      [
        {
          title,
          description,
          date: new Date().toISOString(),
          actor: 'demo',
          source: 'Workspace',
          status: { title: 'Hoàn tất', color: 'success' as const },
        },
        ...items,
      ].slice(0, 50)
    );
  }
  /** Aborted simulation never writes a file or completes a stale submission. */
  wait(signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new DOMException('Đã hủy', 'AbortError'));
        return;
      }
      const abort = () => {
        clearTimeout(timer);
        reject(new DOMException('Đã hủy', 'AbortError'));
      };
      const timer = setTimeout(() => {
        signal?.removeEventListener('abort', abort);
        resolve();
      }, 650);
      signal?.addEventListener('abort', abort, { once: true });
    });
  }
  ngOnDestroy(): void {
    this.generation++;
    this.releaseUrls();
    this.blobs.clear();
  }
  private assertCurrent(generation: number, signal?: AbortSignal): void {
    if (generation !== this.generation || signal?.aborted)
      throw new DOMException('Phiên đã được đặt lại hoặc thao tác đã hủy.', 'AbortError');
  }
  private validateFile(file: File): void {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['txt', 'json', 'csv', 'pdf', 'png', 'jpg', 'jpeg', 'webp', 'svg'].includes(extension))
      throw new Error('Demo hỗ trợ TXT, JSON, CSV, PDF và ảnh.');
    if (file.size > 5 * 1024 * 1024) throw new Error('Tối đa 5 MB mỗi file.');
  }
  private countFields(schema: SdFormGenericSchema): number {
    return schema.pages[0]?.elements.reduce((sum, item) => sum + (item.type === 'group' ? item.elements.length : 1), 0) ?? 0;
  }
  private releaseUrls(): void {
    for (const url of this.urls.values()) URL.revokeObjectURL(url);
    this.urls.clear();
  }
}
