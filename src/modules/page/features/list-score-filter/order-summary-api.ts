import { Injectable, inject } from '@angular/core';
import { PagingReq } from '@sdcorejs/utils/models';
import { DemoSessionStore } from '../../data/demo-session.store';
import { DemoEntity } from '../../data/models';
import { queryTablePage } from '../../data/table-query';
export interface OrderSummaryFilter {
  name?: string;
  group?: string;
  status?: string;
}
export interface OrderSummary {
  all: number;
  pending: number;
  active: number;
  inactive: number;
}
/** Two independent mock endpoints; replace each method with its own HttpClient request. */
@Injectable()
export class OrderSummaryApi {
  private readonly store = inject(DemoSessionStore);
  private delay() {
    return new Promise(resolve => setTimeout(resolve, 1000 + Math.floor(Math.random() * 1001)));
  }
  async list(request: PagingReq<DemoEntity>) {
    await this.delay();
    return queryTablePage(this.store.records(), request);
  }
  async summary(filter: OrderSummaryFilter): Promise<OrderSummary> {
    await this.delay();
    // Faceted counts intentionally retain all statuses, while respecting other filters.
    const query = (filter.name ?? '').trim().toLocaleLowerCase('vi');
    const rows = this.store
      .records()
      .filter(row => (!filter.group || row.group === filter.group) && (!query || row.name.toLocaleLowerCase('vi').includes(query)));
    return {
      all: rows.length,
      pending: rows.filter(row => row.status === 'pending').length,
      active: rows.filter(row => row.status === 'active').length,
      inactive: rows.filter(row => row.status === 'inactive').length,
    };
  }
}
