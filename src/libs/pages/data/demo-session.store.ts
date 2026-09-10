import { Injectable, signal } from '@angular/core';
import { createFixtures } from './fixture-factories';
import { validateEntity } from './validators';
import type { DemoEntity, EntityKind, SaveEntity } from './models';
import type { DemoState } from './demo-state';
/** Provide at PageReference/demo host: each mounted reference owns one isolated session. */
@Injectable()
export class DemoSessionStore {
  readonly records = signal<DemoEntity[]>([]);
  readonly state = signal<DemoState>('data');
  readonly saving = signal(false);
  readonly operation = signal('');
  readonly formLayout = signal<'simple' | 'sections' | 'lines'>('sections');
  private persistent = false;
  private storageKey() {
    return 'portal-pages:v1:' + this.kind;
  }
  async wait(title = 'Đang xử lý…') {
    this.operation.set(title);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.floor(Math.random() * 1001)));
    } finally {
      this.operation.set('');
    }
  }
  async openSession(kind: EntityKind) {
    this.reset(kind);
    this.persistent = true;
    await this.wait('Đang tải dữ liệu…');
    try {
      const raw = sessionStorage.getItem(this.storageKey());
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      if (
        Array.isArray(parsed) &&
        parsed.every(
          row =>
            row &&
            row.kind === kind &&
            typeof row.id === 'string' &&
            typeof row.code === 'string' &&
            typeof row.name === 'string' &&
            Array.isArray(row.lines)
        )
      ) {
        this.records.set(parsed);
        this.#counter = Math.max(30, ...parsed.map(row => Number(row.id.split('-').at(-1)) || 0)) + 1;
      }
    } catch {
      /* Invalid or unavailable session storage falls back to a fresh dataset. */
    }
    this.selectedId.set(this.records()[0]?.id ?? null);
  }
  private persist(rows: DemoEntity[]) {
    if (this.persistent) sessionStorage.setItem(this.storageKey(), JSON.stringify(rows));
  }
  async updateStatus(ids: string[], status: DemoEntity['status']) {
    if (this.operation() || this.saving()) return;
    await this.wait('Đang cập nhật trạng thái…');
    const selected = new Set(ids);
    const rows = this.records().map(row => (selected.has(row.id) ? { ...row, status, updatedAt: new Date().toISOString() } : row));
    this.persist(rows);
    this.records.set(rows);
  }
  readonly failNextSave = signal(false);
  readonly dirty = signal(false);
  readonly selectedId = signal<string | null>(null);
  readonly mode = signal<'detail' | 'create' | 'update'>('detail');
  readonly query = signal({ search: '', status: '', group: '' });
  kind: EntityKind = 'customer';
  #counter = 31;
  reset(kind: EntityKind = this.kind) {
    this.persistent = false;
    this.kind = kind;
    this.#counter = 31;
    this.records.set(createFixtures(kind));
    this.state.set('data');
    this.dirty.set(false);
    this.selectedId.set(this.records()[0]?.id ?? null);
    this.query.set({ search: '', status: '', group: '' });
    this.failNextSave.set(false);
    this.mode.set('detail');
  }
  async save(value: SaveEntity, id?: string): Promise<DemoEntity> {
    if (this.saving()) throw new Error('Đang lưu, vui lòng chờ.');
    const current = id ? this.records().find(x => x.id === id) : undefined;
    if (id && !current) throw new Error('Bản ghi không còn tồn tại.');
    const safe = { ...structuredClone(value), code: current?.code ?? value.code.trim(), name: value.name.trim() };
    const errors = validateEntity(safe, this.records(), id);
    if (errors.length) throw new Error(errors.join(' '));
    this.saving.set(true);
    try {
      await this.wait('Đang lưu hồ sơ…');
      if (this.failNextSave()) {
        this.failNextSave.set(false);
        throw new Error('Không thể lưu dữ liệu. Nội dung của bạn đã được giữ lại; hãy thử lại.');
      }
      const result: DemoEntity = { ...safe, id: id ?? this.kind + '-' + this.#counter++, updatedAt: new Date().toISOString() };
      const rows = id ? this.records().map(x => (x.id === id ? result : x)) : [result, ...this.records()];
      this.persist(rows);
      this.records.set(rows);
      this.selectedId.set(result.id);
      this.dirty.set(false);
      return structuredClone(result);
    } finally {
      this.saving.set(false);
    }
  }
}
