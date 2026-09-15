export type OrderStatus = 'pending' | 'active' | 'done';
export interface PatternOrder {
  id: number;
  code: string;
  name: string;
  region: string;
  status: OrderStatus;
  amount: number;
  owner: string;
}
export interface PatternQuery {
  search: string;
  status: string;
  region: string;
  sort: string;
}
export const EMPTY_QUERY: PatternQuery = { search: '', status: '', region: '', sort: 'code' };
export const STATUS_LABELS: Record<OrderStatus, string> = { pending: 'Chờ xử lý', active: 'Đang xử lý', done: 'Hoàn tất' };
export const REGIONS = ['Miền Bắc', 'Miền Trung', 'Miền Nam'];
export const normalizeSearch = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim();
export function queryOrders(records: readonly PatternOrder[], query: PatternQuery): PatternOrder[] {
  return records
    .filter(
      row =>
        (!query.status || row.status === query.status) &&
        (!query.region || row.region === query.region) &&
        normalizeSearch(row.code + ' ' + row.name).includes(normalizeSearch(query.search))
    )
    .sort(
      (a, b) => (query.sort === 'amount-desc' ? b.amount - a.amount : query.sort === 'amount-asc' ? a.amount - b.amount : 0) || a.id - b.id
    );
}
export function seedOrders(): PatternOrder[] {
  const names = ['An Phát', 'Minh Long', 'Bình Minh', 'Đại Việt', 'Hải Nam', 'Phú Gia', 'Thiên An', 'Trường Sơn'];
  return Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    code: 'DH-' + (1001 + i),
    name: names[i % 8],
    region: REGIONS[Math.floor(i / 3) % 3],
    status: (['pending', 'active', 'done'] as const)[i % 3],
    amount: (i + 2) * 1750000,
    owner: ['Lan', 'Minh', 'Hà', 'Nam'][i % 4],
  }));
}
