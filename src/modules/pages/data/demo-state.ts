export type DemoState = 'data' | 'loading' | 'empty' | 'no-results' | 'error';
export const DEMO_STATES = [
  { id: 'data', name: 'Có dữ liệu' },
  { id: 'loading', name: 'Đang tải' },
  { id: 'empty', name: 'Chưa có dữ liệu' },
  { id: 'no-results', name: 'Không có kết quả' },
  { id: 'error', name: 'Lỗi tải dữ liệu' },
];
