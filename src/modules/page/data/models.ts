/** Synthetic reference contracts. Replace this boundary with your application's service DTOs. */
export type EntityKind = 'customer' | 'order' | 'product' | 'ticket' | 'contract' | 'category' | 'partner' | 'contact';
export type EntityStatus = 'active' | 'pending' | 'inactive';
export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}
export interface DemoEntity {
  id: string;
  kind: EntityKind;
  code: string;
  name: string;
  status: EntityStatus;
  group: string;
  email: string;
  description: string;
  amount: number;
  updatedAt: string;
  parentId?: string;
  lines: LineItem[];
}
export type SaveEntity = Omit<DemoEntity, 'id' | 'updatedAt'>;
export const STATUS_OPTIONS = [
  { id: 'active', name: 'Đang hoạt động' },
  { id: 'pending', name: 'Chờ xử lý' },
  { id: 'inactive', name: 'Tạm dừng' },
];
export const GROUP_OPTIONS = [
  { id: 'north', name: 'Miền Bắc' },
  { id: 'central', name: 'Miền Trung' },
  { id: 'south', name: 'Miền Nam' },
];
