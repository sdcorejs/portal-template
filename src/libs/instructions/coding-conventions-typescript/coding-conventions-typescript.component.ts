import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

interface TsRule {
  title: string;
  dont: string;
  do: string;
  explain: string;
}

@Component({
  selector: 'app-coding-conventions-typescript',
  standalone: true,
  imports: [CommonModule, SdPageComponent, SdSection, SdCodeEditor],
  template: `
    <sd-page [title]="'Coding Conventions TypeScript (Dev)'" [description]="pageDescription">
      <div class="demo-page-body">
        <div class="d-flex flex-column gap-16">
          <sd-section title="Mục tiêu" icon="rule">
            <div class="guide-note">
              Quy ước TypeScript dành cho dev nhằm giảm any, đặt tên rõ nghĩa, và tạo code dễ đọc/dễ bảo trì.
              Mỗi quy tắc dưới đây được trình bày theo cặp Don\'t / Do và có diễn giải ngắn gọn.
            </div>
          </sd-section>

          @for (rule of rules; track rule.title) {
            <sd-section [title]="rule.title" icon="code">
              <div class="rule-grid">
                <div class="rule-col">
                  <div class="rule-col__title rule-col__title--dont">Don't</div>
                  <sd-code-editor [model]="rule.dont" language="typescript" [viewed]="true" maxHeight="230px"></sd-code-editor>
                </div>
                <div class="rule-col">
                  <div class="rule-col__title rule-col__title--do">Do</div>
                  <sd-code-editor [model]="rule.do" language="typescript" [viewed]="true" maxHeight="230px"></sd-code-editor>
                </div>
              </div>
              <div class="rule-explain mt-12">{{ rule.explain }}</div>
            </sd-section>
          }
        </div>
      </div>
    </sd-page>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;

        .demo-page-body {
          padding: 8px 4px;
          background-color: #f1f5f9;
          min-height: 100%;
        }
      }

      .guide-note {
        padding: 12px 14px;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        background: #ffffff;
        color: #334155;
        font-size: 13px;
        line-height: 1.6;
      }

      .rule-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .rule-col__title {
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 8px;
      }

      .rule-col__title--dont {
        color: #b91c1c;
      }

      .rule-col__title--do {
        color: #166534;
      }

      .rule-explain {
        padding: 10px 12px;
        border: 1px dashed #cbd5e1;
        border-radius: 8px;
        background: #f8fafc;
        font-size: 12px;
        color: #334155;
        line-height: 1.55;
      }

      @media (max-width: 991.98px) {
        .rule-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodingConventionsTypescriptComponent {
  pageDescription =
    'Quy ước đặt tên và khai báo TypeScript cho dev: output naming, typing, naming conventions, private scope, và API Req/Res naming.';

  rules: TsRule[] = [
    {
      title: '1) Khai báo name cho output() của component',
      dont: `onSave = output<void>();\nclick = output<void>(); // Không sử dụng các native name`,
      do: `save = output<void>();`,
      explain:
        'Tên output nên là hành động ngắn gọn (save, submit, close...) và tránh trùng tên native event như click, change, input.',
    },
    {
      title: '2) Tên hàm được trigger bởi sự kiện output()',
      dont: `save = () => { }`,
      do: `onSave = () => { }`,
      explain:
        'Handler function nên có prefix on để đọc là biết đây là callback được trigger bởi event/output.',
    },
    {
      title: '3) Khai báo biến (tránh any)',
      dont: `order: any;\norder = {};\norders: any[];\norders = [];`,
      do: `order: Order = {}; // hoặc Partial<Order>\norders: Order[] = [];\ndonVi: DonVi;\ndsDonVi: DonVi[];`,
      explain:
        'Ưu tiên khai báo type rõ ràng, tránh any. Được phép đặt tên tiếng Việt nếu không có từ tiếng Anh tương đương rõ nghĩa.',
    },
    {
      title: '4) Khai báo hàm có type tham số',
      dont: `sum = (a, b) => { }`,
      do: `sum = (a: number, b: number) => { }`,
      explain: 'Hàm nên tường minh type tham số để IntelliSense, validation và refactor chính xác hơn.',
    },
    {
      title: '5) Gán giá trị cho biến trước khi gọi hàm typed',
      dont: `const req = {\n  a: args.a1,\n  b: args.b1,\n  c: args.c1\n}; // req dễ bị suy diễn lỏng lẻo\nawait this.service.get(req);`,
      do: `const req: Req = {\n  a: args.a1,\n  b: args.b1,\n  c: args.c1\n};\nawait this.service.get(req);\n\n// Hoặc\nawait this.service.get({\n  a: args.a1,\n  b: args.b1,\n  c: args.c1\n});`,
      explain:
        'Khi biến req được tái sử dụng ở nhiều nơi, nên ép type rõ ràng. Nếu chỉ dùng 1 lần, có thể truyền object literal trực tiếp.',
    },
    {
      title: '6) Tên biến số nhiều',
      dont: `order: Order[];\nid: string[];\nitemSelecteds: Item[];\nstatus: Status[];\norders: [];`,
      do: `orders: Order[]; // hoặc listOrder\nids: string[]; // hoặc listId\nselectedItems: Item[]; // hoặc selectedItemList\nstatusList: Status[];`,
      explain:
        'Biến mảng nên thể hiện tính chất số nhiều rõ ràng: ids, orders, selectedItems, ... tránh đặt tên mơ hồ.',
    },
    {
      title: '7) Tên biến bool',
      dont: `select: bool;\nstock: bool;\navailable: bool;`,
      do: `isSelected: bool;\nhasStock: bool;\nisAvailable: bool;`,
      explain:
        'Bool nên dùng tính từ và thường có prefix is/has để đọc code tự nhiên hơn trong điều kiện if/return.',
    },
    {
      title: '8) Tên biến ngày/tháng',
      dont: `dateCreate: string | Date;\ndateOff: string | Date;\ndateOn: string | Date;`,
      do: `createdDate: string | Date;\noffDate: string | Date;\nonDate: string | Date;`,
      explain:
        'Date nên để ở suffix (createdDate, updatedDate...). Rule này có thể linh hoạt với field model từ server trả về.',
    },
    {
      title: '9) Hàm chỉ dùng nội bộ file component',
      dont: `load = () => { }`,
      do: `#load = () => { }`,
      explain: 'Hàm nội bộ không expose ra ngoài nên để private bằng # để giới hạn phạm vi sử dụng.',
    },
    {
      title: '10) Biến chỉ dùng nội bộ file component',
      dont: `shipments: Shipment[];`,
      do: `#shipments: Shipment[];`,
      explain: 'Biến nội bộ không dùng ngoài class nên để private # để tránh bị truy cập/truyền sai ở nơi khác.',
    },
    {
      title: '11) Biến chỉ dùng nội bộ trong hàm',
      dont: `shipments: Shipment[];\n#init = async () => {\n  this.#shipments = await ...\n  ...\n}`,
      do: `#init = async () => {\n  const shipments = await ...\n  ...\n}`,
      explain:
        'Nếu biến chỉ phục vụ logic trong 1 hàm, ưu tiên const local thay vì nâng cấp thành state cấp class.',
    },
    {
      title: '12) Hàm callback chỉ dùng 1 chỗ và ngắn (< 50 dòng)',
      dont: `#init = async () => {\n  this.gridOption = {\n    commands: [{\n      icon: 'edit',\n      click: this.#onClick\n    }]\n  }\n}\n\n#onClick = (value: <type>, rowData: <type>) => {\n  ...\n}`,
      do: `#init = async () => {\n  this.gridOption = {\n    commands: [{\n      icon: 'edit',\n      click: (value, rowData) => {\n        ...\n      }\n    }]\n  }\n}`,
      explain:
        'Với callback ngắn và chỉ dùng 1 nơi, inline sẽ dễ theo dõi context hơn và thường được suy diễn type từ config gốc.',
    },
    {
      title: '13) Naming Request/Response cho service API',
      dont: `interface SaveShipmentRequestDTO {}\ninterface SaveShipmentResponseDTO {}\ninterface SaveShipment {}\ninterface ShipmentDTO {}\n\ngetDetail = async (id: string): Promise<ShipmentDTO> => { }\nsaveShipment = async (req: SaveShipmentRequestDTO): Promise<SaveShipmentResponseDTO> => { }`,
      do: `interface ShipmentSaveReq {}\ninterface ShipmentSaveRes {}\ninterface Shipment {}\n\ngetDetail = async (id: string): Promise<Shipment> => { }\nsaveShipment = async (req: ShipmentSaveReq): Promise<ShipmentSaveRes> => { }`,
      explain:
        'Ưu tiên tên ngắn gọn và rõ nghĩa: Req/Res thay cho RequestDTO/ResponseDTO. Tránh DTO nếu không mang giá trị rõ ràng trong dự án.',
    },
  ];
}
