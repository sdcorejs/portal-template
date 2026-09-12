import type { ArticleText } from '../instruction-content';
export default {
  goals: ['Phân biệt commit của repo cha với commit submodule.', 'Đồng bộ source có kiểm soát và bảo toàn thay đổi local.'],
  prerequisites: 'Git. Repo này hiện không có .gitmodules; workflow submodule chỉ áp dụng khi đã tích hợp submodule.',
  caption: 'Repo cha lưu gitlink trỏ commit của repo con. Pull cha không đồng nghĩa working tree repo con đã cập nhật.',
  steps: [
    {
      title: 'Kiểm tra trước khi đồng bộ',
      text: 'Đọc status cả repo cha và con. Commit/stash thay đổi của mình trước khi đổi branch; xác định branch và remote đúng.',
      file: 'Terminal',
      code: 'git status --short\ngit submodule status\ngit submodule foreach "git status --short"',
      result: 'Không còn thay đổi cần bảo toàn chưa xử lý.',
    },
    {
      title: 'Tái tạo đúng commit đã được ghim',
      text: 'Dùng update init recursive để checkout commit được repo cha ghi nhận. Đây là luồng tái lập checkout.',
      file: 'Terminal',
      code: 'git pull --ff-only\ngit submodule update --init --recursive',
      result: 'Submodule tại commit gitlink; có thể detached HEAD và đó là bình thường khi tái tạo checkout.',
    },
    {
      title: 'Hiểu script hiện có trước khi chạy',
      text: 'npm run fetch gọi sync-submodules.js: pull repo cha rồi fetch/checkout -B theo branch. Chỉ dùng khi mọi submodule có branch tương ứng và worktree đã sạch.',
      file: 'sync-submodules.js',
      code: 'npm run fetch\n# Sau khi chủ động cập nhật repo con:\ngit diff --submodule',
      result: 'Nếu gitlink đổi, review và commit ở repo cha sau khi commit repo con đã push và người khác fetch được.',
    },
  ],
  exercise: 'Thử các trạng thái worktree bẩn, thiếu branch và lệch gitlink. UI chỉ mô phỏng, không thực thi Git.',
  expected: 'Mỗi trạng thái có bước xử lý đúng; không cho giả lập đồng bộ khi còn thay đổi local.',
  exampleCode:
    '// Phân biệt:\n// update --init --recursive: checkout commit đã ghim\n// fetch + checkout branch: chủ động theo nhánh, có thể thay gitlink',
  pitfalls: [
    'checkout -B có thể đặt lại branch; không chạy khi chưa kiểm tra thay đổi.',
    'Đừng commit gitlink trỏ commit chưa push ở repo con.',
    'Không coi detached HEAD là lỗi trong checkout tái lập.',
  ],
  checklist: ['Worktree đã an toàn.', 'Commit repo con có trên remote.', 'Repo cha ghim đúng commit.'],
  sources: [
    {
      title: 'Đồng bộ Git submodules',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/3747184643',
    },
    {
      title: 'Tích hợp module',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/3749315006',
    },
  ],
  related: ['integration', 'setup'],
} satisfies ArticleText;
