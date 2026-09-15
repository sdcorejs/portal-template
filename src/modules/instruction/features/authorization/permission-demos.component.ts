import { ChangeDetectionStrategy, Component, computed, model, signal } from '@angular/core';
import { PERMISSION_GROUPS, effectivePermissions, canViewRecord } from './permission.model';
@Component({
  selector: 'app-role-groups',
  template: `<div class="card">
    <h3>Role · Nhân viên kinh doanh</h3>
    <p>Chọn nhóm quyền nghiệp vụ</p>
    @for (group of groups; track group.code) {
      <label><input type="checkbox" [checked]="selected().includes(group.code)" (change)="toggle(group.code)" />{{ group.label }}</label>
    }
  </div>`,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleGroupsComponent {
  readonly groups = PERMISSION_GROUPS;
  readonly selected = model<string[]>(['CRM_CUSTOMER_G_VIEW']);
  toggle(code: string): void {
    this.selected.update(items => (items.includes(code) ? items.filter(item => item !== code) : [...items, code]));
  }
}
@Component({
  selector: 'app-permission-model-demo',
  imports: [RoleGroupsComponent],
  template: `<app-role-groups [(selected)]="groups" />
    <p role="status">{{ permissions().length }} quyền kỹ thuật được suy ra từ {{ groups().length }} nhóm.</p>
    <details>
      <summary>Mapping kỹ thuật · dành cho developer</summary>
      <h3>Nhóm được gán</h3>
      <pre>{{
        groups().join(
          '
'
        ) || 'Chưa có nhóm'
      }}</pre>
      <h3>Effective permissions</h3>
      <pre data-testid="effective-permissions">{{
        permissions().join(
          '
'
        ) || 'Không có quyền'
      }}</pre>
    </details>`,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionModelDemoComponent {
  readonly groups = signal(['CRM_CUSTOMER_G_VIEW']);
  readonly permissions = computed(() => effectivePermissions(this.groups()));
}
@Component({
  selector: 'app-permission-checks-demo',
  imports: [RoleGroupsComponent],
  template: `<app-role-groups [(selected)]="groups" />
    <label
      ><input type="checkbox" [checked]="stale()" (change)="stale.set(!stale()); result.set('')" />UI đã cũ · backend thu hồi quyền
      tạo</label
    >
    <div class="card">
      <h3>Giao diện ứng dụng mô phỏng</h3>
      @if (canView()) {
        <span class="badge">Menu Khách hàng hiển thị</span>
      } @else {
        <p>Menu Khách hàng bị ẩn.</p>
      }
      @if (canCreate()) {
        <button type="button" class="primary" (click)="callApi()">Tạo khách hàng</button>
      } @else {
        <p>Nút tạo bị ẩn do thiếu quyền C_CREATE.</p>
      }
    </div>
    <div class="controls">
      <button type="button" (click)="openRoute()">Thử URL /customer/create</button
      ><button type="button" (click)="callApi()">Gọi API tạo giả lập</button>
    </div>
    <p role="status" class="status">{{ result() || 'Chọn nhóm quyền rồi thử truy cập.' }}</p>`,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionChecksDemoComponent {
  readonly groups = signal(['CRM_CUSTOMER_G_VIEW']);
  readonly stale = signal(false);
  readonly result = signal('');
  readonly effective = computed(() => effectivePermissions(this.groups()));
  readonly canCreate = computed(() => this.effective().includes('CRM_CUSTOMER_C_CREATE'));
  readonly canView = computed(() => this.effective().includes('CRM_CUSTOMER_C_VIEW'));
  openRoute(): void {
    this.result.set(this.canCreate() ? 'Route được phép · có C_CREATE' : 'Route bị từ chối · thiếu C_CREATE');
  }
  callApi(): void {
    this.result.set(
      !this.stale() && this.effective().includes('CRM_CUSTOMER_A_CREATE')
        ? '201 · API giả lập đã tạo khách hàng'
        : '403 · API giả lập từ chối: thiếu A_CREATE'
    );
  }
}
@Component({
  selector: 'app-data-scope-demo',
  template: `<div class="controls">
      <label
        >Người dùng
        <select aria-label="Người dùng" [value]="user()" (change)="setUser($event)">
          <option value="lan">Lan</option>
          <option value="minh">Minh</option>
        </select></label
      >
      <label
        ><input type="checkbox" [checked]="hasView()" (change)="hasView.set(!hasView()); result.set('')" />Có quyền xem khách hàng</label
      >
      <label
        ><input type="checkbox" [checked]="assignment()" (change)="assignment.set(!assignment()); result.set('')" />Giao CUS-002 cho
        Lan</label
      >
    </div>
    <table>
      <caption>
        Khách hàng trong phạm vi
      </caption>
      <thead>
        <tr>
          <th scope="col">Mã</th>
          <th scope="col">Công ty</th>
        </tr>
      </thead>
      <tbody>
        @for (record of visible(); track record.id) {
          <tr>
            <td>{{ record.id }}</td>
            <td>{{ record.name }}</td>
          </tr>
        } @empty {
          <tr>
            <td colspan="2">Không có bản ghi được phép xem.</td>
          </tr>
        }
      </tbody>
    </table>
    <p>Truy cập trực tiếp (vẫn phải kiểm tra policy):</p>
    <div class="controls">
      @for (record of records; track record.id) {
        <button type="button" (click)="open(record.id)">Mở {{ record.id }}</button>
      }
    </div>
    <p class="status" role="status">{{ result() || 'Chưa truy cập hồ sơ.' }}</p>`,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataScopeDemoComponent {
  readonly records = [
    { id: 'CUS-001', name: 'Công ty Minh An', ownerId: 'lan' },
    { id: 'CUS-002', name: 'Công ty Bình Minh', ownerId: 'minh' },
  ];
  readonly user = signal('lan');
  readonly hasView = signal(true);
  readonly assignment = signal(false);
  readonly result = signal('');
  readonly assignments = computed(() => [{ userId: 'lan', recordId: 'CUS-002', active: this.assignment() }]);
  readonly visible = computed(() => this.records.filter(record => canViewRecord(this.hasView(), this.user(), record, this.assignments())));
  setUser(event: Event): void {
    this.user.set((event.target as HTMLSelectElement).value);
    this.result.set('');
  }
  open(id: string): void {
    this.result.set(
      this.visible().some(record => record.id === id) ? 'Được phép xem ' + id : 'Từ chối ' + id + ' · thiếu quyền hoặc ngoài phạm vi'
    );
  }
}
