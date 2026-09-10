import type { DemoEntity, SaveEntity } from './models';
/** Service boundary rules run even if a consumer bypasses the form. */
export function validateEntity(value: SaveEntity, items: DemoEntity[], id?: string): string[] {
  const errors: string[] = [];
  if (!value.code.trim()) errors.push('Mã là bắt buộc.');
  if (items.some(x => x.id !== id && x.kind === value.kind && x.code.toLowerCase() === value.code.trim().toLowerCase()))
    errors.push('Mã đã tồn tại.');
  if (!value.name.trim()) errors.push('Tên là bắt buộc.');
  if (value.name.length > 160) errors.push('Tên tối đa 160 ký tự.');
  if (!Number.isFinite(value.amount) || value.amount < 0) errors.push('Giá trị phải lớn hơn hoặc bằng 0.');
  if (value.kind === 'order' && !value.lines.length) errors.push('Đơn hàng cần ít nhất một dòng.');
  if (
    value.lines.some(
      x => !x.name.trim() || !Number.isFinite(x.quantity) || x.quantity <= 0 || !Number.isFinite(x.unitPrice) || x.unitPrice < 0
    )
  )
    errors.push('Dòng hàng cần tên, số lượng lớn hơn 0 và đơn giá hợp lệ.');
  return errors;
}
