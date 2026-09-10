import type { DemoEntity, EntityKind } from './models';
/** Stable seed, fresh instances: no real customer data and no clock/random dependency. */
export function createFixtures(kind: EntityKind): DemoEntity[] {
  const names: Record<EntityKind, string[]> = {
    customer: ['Công ty Minh An', 'An Phú Logistics', 'Thương mại Việt Hưng', 'Green Works', 'Thiết bị Tân Bình', 'Hạ tầng Đại Việt'],
    order: [
      'Thiết bị văn phòng',
      'Bổ sung vật tư quý III',
      'Đơn hàng dự án miền Nam',
      'Giao hàng theo hợp đồng',
      'Vật tư cho chi nhánh mới',
      'Bổ sung thiết bị mạng',
    ],
    product: ['Thiết bị văn phòng', 'Máy in đa năng', 'Giấy A4 tái chế', 'Bàn làm việc', 'Ghế công thái học', 'Mực in màu'],
    ticket: [
      'Không nhận được thông báo',
      'Cập nhật thông tin thanh toán',
      'Cần hướng dẫn xuất báo cáo',
      'Yêu cầu kiểm tra trạng thái đơn hàng',
      'Điều chỉnh địa chỉ nhận hàng',
      'Hỗ trợ thiết lập người dùng',
    ],
    contract: [
      'Hợp đồng cung ứng thường niên',
      'Bảo trì thiết bị văn phòng',
      'Dịch vụ vận chuyển nội địa',
      'Cung ứng vật tư dự án',
      'Dịch vụ triển khai hệ thống',
      'Hợp đồng tư vấn',
    ],
    category: ['Văn phòng phẩm', 'Thiết bị công nghệ', 'Nội thất', 'Dịch vụ', 'Vật tư tiêu hao', 'Phụ kiện'],
    partner: ['Đối tác Bắc Hà', 'Dịch vụ Hoàng Minh', 'Thương mại An Khang', 'Giải pháp Nam Việt', 'Sản xuất Hòa Bình', 'Phân phối Đông Á'],
    contact: ['Liên hệ mua hàng', 'Điều phối giao nhận', 'Hỗ trợ kỹ thuật', 'Kế toán thanh toán', 'Quản lý hợp đồng', 'Đầu mối dự án'],
  };
  return Array.from({ length: 30 }, (_, i) => ({
    id: kind + '-' + (i + 1),
    kind,
    code: kind.toUpperCase().slice(0, 3) + '-' + String(i + 1).padStart(4, '0'),
    name: names[kind][i % 6] + (i >= 6 ? ' · Chi nhánh ' + (Math.floor(i / 6) + 1) : ''),
    status: (['active', 'pending', 'inactive'] as const)[i % 3],
    group: ['north', 'central', 'south'][i % 3],
    email: 'demo' + (i + 1) + '@example.test',
    description:
      i % 4 === 0
        ? 'Ưu tiên phối hợp với bộ phận vận hành. Lịch giao nhận được thống nhất theo từng đợt; kiểm tra thông tin liên hệ trước khi hoàn tất hồ sơ.'
        : 'Đầu mối phụ trách đã xác nhận thông tin. Đối soát và cập nhật tiến độ vào ngày làm việc cuối tuần.',
    amount: 1250000 + i * 375000,
    updatedAt: '2026-09-' + String(1 + (i % 9)).padStart(2, '0') + 'T09:00:00Z',
    ...(kind === 'product' && i % 6 !== 0 ? { parentId: 'product-' + (Math.floor(i / 6) * 6 + 1) } : {}),
    lines: Array.from({ length: 3 }, (_, j) => ({
      id: 'line-' + (j + 1),
      name: ['Giấy A4', 'Mực in', 'Bìa hồ sơ'][j],
      quantity: ((i + j) % 5) + 1,
      unitPrice: [85000, 420000, 25000][j],
    })),
  }));
}
