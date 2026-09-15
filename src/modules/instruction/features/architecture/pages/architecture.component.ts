import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-architecture',
  imports: [RouterLink],
  templateUrl: './architecture.component.html',
  styleUrl: '../../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchitectureComponent {
  readonly treeMode = signal<'blueprint' | 'portal'>('blueprint');
  readonly blueprintTree =
    'src/\n├── app/                         # Portal host: layout, auth, menu\n├── modules/\n│   └── crm/\n│       ├── configurations/      # Interface + Injection Token\n│       ├── features/\n│       │   └── customer/\n│       │       ├── pages/       # List, detail, create, update\n│       │       ├── components/\n│       │       ├── pipes/\n│       │       ├── directives/\n│       │       ├── services/\n│       │       │   ├── customer.model.ts\n│       │       │   └── customer.service.ts\n│       │       └── routes.ts\n│       ├── services/            # Shared trong module\n│       ├── models/\n│       ├── guards/\n│       ├── routes.ts\n│       └── index.ts             # Public API\n└── shared/                      # Hạ tầng dùng chung';
  readonly portalTree =
    'src/\n├── app/                         # Layout, menu, cấu hình Portal\n├── modules/\n│   ├── components/features/     # Anchor, badge, table…\n│   ├── forms/features/          # Input, select, validation…\n│   ├── services/features/       # Confirm, notify, loading…\n│   ├── utilities/features/      # Icons, tooltip\n│   ├── instructions/\n│   │   ├── features/\n│   │   │   └── architecture/pages/\n│   │   ├── catalog/             # Metadata + nội dung 17 bài\n│   │   ├── components/          # Article + example\n│   │   ├── routes.ts\n│   │   └── index.ts\n│   └── pages/\n│       ├── features/            # 12 mẫu list / detail / form\n│       ├── components/\n│       ├── data/                # Mock store\n│       ├── catalog/\n│       ├── reference/\n│       ├── routes.ts\n│       └── index.ts\n└── shared/                      # Storybook helpers';
}
