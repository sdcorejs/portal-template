import type { Meta } from '@storybook/angular';
import { SdAnchor, SdAnchorItem } from '@sdcorejs/angular/components/anchor';

export interface AnchorPlaygroundArgs {
  sidebarWidth: string;
  containerHeight: number;
  ellipsis: boolean;
  overScroll: boolean;
  hideNav: boolean;
  hideNavOnMobile: boolean;
  sectionTitle: string;
}

export const anchorPlayground: Meta<AnchorPlaygroundArgs> = {
  component: SdAnchor,
  tags: ['autodocs'],
  args: {
    sidebarWidth: '160px',
    containerHeight: 420,
    ellipsis: true,
    overScroll: false,
    hideNav: false,
    hideNavOnMobile: false,
    sectionTitle: 'Thông tin công ty và người liên hệ',
  },
  argTypes: {
    sidebarWidth: { control: 'select', options: ['120px', '160px', '200px', '240px'], description: 'Chiều rộng thanh điều hướng.' },
    containerHeight: { control: 'select', options: [320, 420, 540], description: 'Chiều cao vùng cuộn (px), thuộc phần bọc ví dụ.' },
    sectionTitle: { control: 'text', description: 'Tiêu đề mục đầu tiên; thử tên dài để xem ellipsis.' },
    ellipsis: { control: 'boolean', description: 'Rút gọn tiêu đề dài trên thanh điều hướng.' },
    hideNav: { control: 'boolean', description: 'Ẩn thanh điều hướng.' },
    hideNavOnMobile: {
      control: 'boolean',
      description: 'Tự ẩn thanh điều hướng khi viewport nhỏ. Tắt mặc định để thử trong khung Storybook hẹp.',
    },
    overScroll: { control: 'boolean', description: 'Cho phép cuộn tiếp ra trang ngoài khi đã đến đầu hoặc cuối nội dung.' },
  },
  parameters: {
    layout: 'padded',
    controls: { include: ['sidebarWidth', 'containerHeight', 'sectionTitle', 'ellipsis', 'hideNav', 'hideNavOnMobile', 'overScroll'] },
    docs: {
      description: {
        component:
          'Chọn mục bên trái hoặc cuộn nội dung để thử điều hướng. Đổi thuộc tính trong bảng Controls bên dưới; trong tab Playground, mở panel Controls. Mỗi preview giữ trạng thái riêng.',
      },
    },
  },
  render: args => ({
    props: args,
    moduleMetadata: { imports: [SdAnchor, SdAnchorItem] },
    template: `
      <div style="padding: 16px; background: var(--sd-background, #f7f8fa)">
        <div [style.height.px]="containerHeight" style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden">
          <sd-anchor [sidebarWidth]="sidebarWidth" [ellipsis]="ellipsis" [overScroll]="overScroll"
            [hideNav]="hideNav" [hideNavOnMobile]="hideNavOnMobile">
            <sd-anchor-item [title]="sectionTitle" icon="business">
              <section style="min-height: 360px; padding: 24px">
                <h3>{{ sectionTitle }}</h3><p>Công ty Minh An · CUS-0001</p>
                <dl><dt>Người liên hệ</dt><dd>Nguyễn Minh Anh</dd><dt>Khu vực</dt><dd>Miền Bắc</dd></dl>
              </section>
            </sd-anchor-item>
            <sd-anchor-item title="Điều khoản hợp tác" icon="description">
              <section style="min-height: 360px; padding: 24px; border-top: 1px solid #e2e8f0">
                <h3>Điều khoản hợp tác</h3>
                <p>Thanh toán trong 30 ngày kể từ ngày đối soát. Giao hàng theo lịch thống nhất với người phụ trách.</p>
                <dl><dt>Hạn mức</dt><dd>250.000.000 VND</dd><dt>Chu kỳ đối soát</dt><dd>Ngày 25 hằng tháng</dd></dl>
              </section>
            </sd-anchor-item>
            <sd-anchor-item title="Lịch sử làm việc" icon="history">
              <section style="min-height: 360px; padding: 24px; border-top: 1px solid #e2e8f0">
                <h3>Lịch sử làm việc</h3><p>10/09/2026 — Cập nhật người liên hệ.</p>
                <p>08/09/2026 — Hoàn tất đối soát đơn hàng.</p><p>01/09/2026 — Khởi tạo hồ sơ công ty.</p>
              </section>
            </sd-anchor-item>
          </sd-anchor>
        </div>
      </div>`,
  }),
};
