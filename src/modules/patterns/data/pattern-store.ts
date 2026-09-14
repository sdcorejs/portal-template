import { Injectable, signal } from '@angular/core';
import { OrderStatus, seedOrders } from './pattern-query';
@Injectable()
export class PatternStore {
  readonly records = signal(seedOrders());
  readonly pending = signal<number[]>([]);
  readonly message = signal('');
  readonly simulateError = signal(false);
  async transition(ids: number[], status: OrderStatus): Promise<boolean> {
    if (!ids.length || this.pending().length) return false;
    this.pending.set(ids);
    this.message.set('');
    const fail = this.simulateError();
    try {
      await new Promise(resolve => setTimeout(resolve, 350));
      if (fail) throw new Error('Không thể cập nhật. Dữ liệu được giữ nguyên; hãy thử lại.');
      this.records.update(rows => rows.map(row => (ids.includes(row.id) ? { ...row, status } : row)));
      this.message.set('Đã cập nhật ' + ids.length + ' đơn hàng.');
      return true;
    } catch (error) {
      this.message.set((error as Error).message);
      return false;
    } finally {
      this.pending.set([]);
    }
  }
  reset(): void {
    if (!this.pending().length) {
      this.records.set(seedOrders());
      this.message.set('Đã khôi phục dữ liệu mẫu.');
    }
  }
}
