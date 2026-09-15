import type { ArticleText } from '../instruction-content';
export default {
  goals: ['Chọn primary nhất quán và kiểm tra độ tương phản.', 'Dùng theme tool có sẵn để tạo palette thay vì rải mã màu trong feature.'],
  prerequisites: 'Core styles đã được host tải.',
  caption: 'Màu thương hiệu → palette → token → button/badge/focus. Kiểm tra contrast trước khi áp dụng.',
  steps: [
    {
      title: 'Thử primary trong ngữ cảnh',
      text: 'Chọn màu rồi xem chữ trắng trên nền primary. Demo dùng cách tính tương phản WCAG để hỗ trợ chọn màu, chưa áp dụng toàn Portal.',
      file: 'features/custom-theme/tool',
      code: '/instruction/custom-theme/tool',
      result: 'Biết màu chính có đủ contrast cho chữ thường hay cần đổi tone.',
    },
    {
      title: 'Dùng token và kiểm tra trạng thái',
      text: 'Xuất SCSS từ theme tool, review token theo output của phiên bản Core đang cài; kiểm tra hover, disabled, focus, error và success.',
      file: 'src/styles.scss',
      code: "@use '@sdcorejs/angular/assets/scss/themes/default' as sd;\n\nhtml {\n  @include sd.theme((\n    primary: #2a66f4,\n    primary-light: #eaf1ff,\n    primary-dark: #1c4ad9,\n    primary-contrast: #fff,\n  ));\n}\n// Merge các token này vào lời gọi sd.theme hiện có trong src/styles.scss.",
      result: 'Theme thống nhất ở component, form và Pages.',
    },
  ],
  exercise: 'Đổi màu primary, quan sát tỷ lệ tương phản và preview. Reset quay về #2A66F4; mở tool để xuất palette.',
  expected: 'Màu sáng báo không đạt 4.5:1 cho chữ thường trên nền trắng/primary; màu đủ tối được đánh dấu đạt.',
  exampleCode:
    "@use '@sdcorejs/angular/assets/scss/themes/default' as sd;\nhtml { @include sd.theme((primary: #2a66f4, primary-contrast: #fff)); }\n\n// Contrast = (Lighter + 0.05) / (Darker + 0.05)\n// Chữ thường: kiểm tra ít nhất 4.5:1.",
  pitfalls: ['Không chỉ đổi primary rồi bỏ qua focus/error/disabled.', 'Không dùng màu làm dấu hiệu trạng thái duy nhất.'],
  checklist: ['Primary nhất quán.', 'Contrast được kiểm tra.', 'Có kiểm tra cả form và Pages.'],
  sources: [
    {
      title: 'Core UI — theme',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/3756754126',
    },
  ],
  related: ['spacing', 'quality', 'portal-config'],
} satisfies ArticleText;
