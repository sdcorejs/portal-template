import { Injectable } from '@angular/core';
import { ROLE_MODULES, ROLE_SEEDS } from './role.fixtures';
import { permissionsFor } from './role-permissions';
import type { RoleLayout, RoleRecord } from './role.model';
const knownPermissions = new Set(ROLE_MODULES.flatMap(m => m.entities.flatMap(e => permissionsFor(m, e).map(p => p.id))));
export function validateRole(value: RoleRecord, rows: readonly RoleRecord[]): string {
  if (!value.code.trim() || !value.name.trim()) return 'Vui lòng nhập mã và tên vai trò.';
  if (!/^[A-Z0-9_-]{1,40}$/.test(value.code)) return 'Mã vai trò dùng chữ in hoa, số, dấu - hoặc _, tối đa 40 ký tự.';
  if (value.name.length > 120 || value.description.length > 400) return 'Tên tối đa 120 ký tự, mô tả tối đa 400 ký tự.';
  if (rows.some(row => row.code === value.code && row.id !== value.id)) return 'Mã vai trò đã tồn tại.';
  if (!['active', 'inactive'].includes(value.status)) return 'Trạng thái không hợp lệ.';
  if (value.permissions.some(id => !knownPermissions.has(id))) return 'Có quyền không còn trong danh mục. Vui lòng tải lại.';
  return '';
}
export function isRoleRecord(value: unknown): value is RoleRecord {
  if (!value || typeof value !== 'object') return false;
  const row = value as RoleRecord;
  return (
    typeof row.id === 'string' &&
    !!row.id &&
    typeof row.code === 'string' &&
    typeof row.name === 'string' &&
    typeof row.description === 'string' &&
    ['active', 'inactive'].includes(row.status) &&
    typeof row.users === 'number' &&
    Number.isFinite(row.users) &&
    row.users >= 0 &&
    typeof row.updatedAt === 'string' &&
    Number.isFinite(Date.parse(row.updatedAt)) &&
    Array.isArray(row.permissions) &&
    row.permissions.every(id => knownPermissions.has(id))
  );
}
/** Provided by each Role route; two examples have independent session keys. */
@Injectable()
export class RoleSessionStore {
  key(layout: RoleLayout): string {
    return 'portal-pages:roles:v1:' + layout;
  }
  async delay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.floor(Math.random() * 1001)));
  }
  read(layout: RoleLayout): RoleRecord[] {
    const raw = sessionStorage.getItem(this.key(layout));
    if (raw === null) return structuredClone(ROLE_SEEDS);
    const rows: unknown = JSON.parse(raw);
    if (!Array.isArray(rows) || !rows.every(isRoleRecord) || new Set(rows.map(row => row.id)).size !== rows.length)
      throw new Error('Dữ liệu vai trò trong phiên không hợp lệ. Không ghi đè dữ liệu hiện có.');
    return rows;
  }
  async list(layout: RoleLayout): Promise<RoleRecord[]> {
    await this.delay();
    return this.read(layout);
  }
  async save(layout: RoleLayout, value: RoleRecord): Promise<RoleRecord> {
    await this.delay();
    const rows = this.read(layout);
    if (value.id && !rows.some(row => row.id === value.id)) throw new Error('Vai trò không còn tồn tại. Không thể cập nhật.');
    const normalized = {
      ...value,
      code: value.code.trim(),
      name: value.name.trim(),
      description: value.description.trim(),
      permissions: [...new Set(value.permissions)],
    };
    const error = validateRole(normalized, rows);
    if (error) throw new Error(error);
    const current = rows.find(row => row.id === value.id);
    const record = {
      ...normalized,
      id: value.id || 'role-' + crypto.randomUUID(),
      users: current?.users ?? 0,
      updatedAt: new Date().toISOString(),
    };
    const next = current ? rows.map(row => (row.id === record.id ? record : row)) : [record, ...rows];
    // Commit only after persistence succeeds; callers keep their draft on error.
    sessionStorage.setItem(this.key(layout), JSON.stringify(next));
    return structuredClone(record);
  }
}
