# Portal Template 🇺🇸🇻🇳

*(Scroll down for Vietnamese / Kéo xuống dưới để xem tiếng Việt)*

Portal Template is a robust Angular-based starter project designed to bootstrap new enterprise portal applications quickly and efficiently. It comes pre-configured with modern Angular 20, Angular Material components, and best practices.

## Features

- **Modern Stack**: Built with Angular 20 and TypeScript.
- **Micro-Frontend Ready (Module Encapsulation)**: Modules are strictly designed to be encapsulated, ensuring they exist independently without relying on the host's global state. This plug-and-play architecture allows modules to be easily imported and reused across any other portals.
- **UI & Theming**: Integrated with Angular Material and `@ng-matero/extensions` for comprehensive UI components.
- **Core Library**: Leverages `@sdcorejs/angular` for shared enterprise features.
- **Code Generation**: Pre-configured `plop` generators to rapidly scaffold modules and entities, saving development time and enforcing consistency.
- **Formatting & Linting**: Built-in ESLint and Prettier configurations for clean code.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository down to your local machine.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Sync any Git submodules if required:
   ```bash
   npm run fetch
   ```

### Development Server

Start the development server with:
```bash
npm start
```
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode on `http://localhost:4200/`.

### `npm run fetch`
Executes `sync-submodules.js` to initialize or update Git submodules required for the project.

### `npm run lint`
Runs ESLint over your codebase to catch errors and enforce code styling.

### Building for Different Environments
The project is configured with multiple build targets. The build artifacts will be stored in the `dist/` directory.

- `npm run build` or `npm run build-dev`: Builds the app for the **development** environment.
- `npm run build-qc`: Builds the app for the **QC (quality control)** environment.
- `npm run build-uat`: Builds the app for the **UAT (user acceptance testing)** environment.
- `npm run build-prod`: Builds and optimizes the app for **production**.

## Code Generation

This project uses [Plop](https://plopjs.com/) to easily generate boilerplate code and ensure project structure consistency. 

- **Generate a new Module**:
  ```bash
  npm run plop:module
  ```
  Follow the prompt to create a complete module structure.

- **Generate a new Entity**:
  ```bash
  npm run plop:entity
  ```
  Follow the prompt to scaffold entity configurations, services, or models based on project conventions.

## Project Structure

- `src/`: Application source code (components, services, modules).
- `public/`: Static assets such as images and icons.
- `plop-templates/`: Handlebars templates used by the Plop code generator.
- `angular.json`: Angular workspace configuration.

---

# Portal Template (Tiếng Việt)

Portal Template là một dự án mẫu nền tảng Angular mạnh mẽ, được thiết kế để khởi tạo các ứng dụng portal doanh nghiệp một cách nhanh chóng và hiệu quả. Dự án được cấu hình sẵn với Angular 20 bản mới, các component Angular Material, và các tiêu chuẩn coding tốt nhất.

## Tính năng nổi bật

- **Công nghệ hiện đại**: Xây dựng với Angular 20 và TypeScript.
- **Tính đóng gói Module (Micro-Frontend Ready)**: Các module được thiết kế chặt chẽ theo nguyên tắc đóng gói (encapsulation), đảm bảo có thể hoạt động độc lập mà không can thiệp hay phụ thuộc vào global state của host. Kiến trúc "cắm-là-chạy" (plug-and-play) này cho phép các module dễ dàng được tái sử dụng và nhúng vào bất kỳ ứng dụng portal nào khác.
- **Giao diện & Theme**: Tích hợp sẵn Angular Material và `@ng-matero/extensions` với vô số các component linh hoạt.
- **Thư viện lõi (Core Library)**: Sử dụng trực tiếp `@sdcorejs/angular` cho các tính năng hệ thống chia sẻ cấp doanh nghiệp.
- **Sinh mã tự động (Code Generation)**: Các generator `plop` được cấu hình sẵn để nhanh chóng tạo khung module và entity mẫu, giúp tiết kiệm thời gian và đảm bảo tính đồng nhất source code dự án.
- **Format & Linting**: Cấu hình ESLint và Prettier sẵn sàng để code luôn sạch đẹp.

## Bắt đầu dự án

### Yêu cầu hệ thống
- Node.js (khuyến nghị phiên bản 18 trở lên)
- npm

### Cài đặt
1. Clone repository về máy tính của bạn.
2. Cài đặt các gói phụ thuộc (dependencies):
   ```bash
   npm install
   ```
3. Đồng bộ dữ liệu Git submodules (nếu có):
   ```bash
   npm run fetch
   ```

### Chạy ứng dụng (Development Server)
Khởi động server phát triển bằng lệnh:
```bash
npm start
```
Truy cập `http://localhost:4200/`. Ứng dụng sẽ tự động tải lại (reload) mỗi khi bạn thay đổi các file mã nguồn.

## Các lệnh có sẵn (Scripts)

Tại thư mục gốc của dự án, bạn có thể chạy:

### `npm start`
Khởi chạy ứng dụng ở chế độ phát triển tại `http://localhost:4200/`.

### `npm run fetch`
Thực thi script `sync-submodules.js` để khởi tạo hoặc cập nhật các Git submodules cần thiết cho dự án.

### `npm run lint`
Chạy ESLint để quét lỗi ứng dụng và ép tuân thủ các chuẩn format source code.

### Build theo từng môi trường
Dự án được cấu hình với nhiều mục tiêu build (build targets) khác nhau cho từng môi trường riêng biệt. Bản build cuối cùng được lưu ở thư mục `dist/`.

- `npm run build` hoặc `npm run build-dev`: Build ứng dụng cho môi trường **development** (phát triển).
- `npm run build-qc`: Build ứng dụng cho môi trường **QC** (kiểm định / QA).
- `npm run build-uat`: Build ứng dụng cho môi trường **UAT**.
- `npm run build-prod`: Build và tối ưu hoá ứng dụng cho vòng đời chạy thật **production**.

## Code Generation (Sinh mã tự động)

Dự án này sử dụng [Plop](https://plopjs.com/) để dễ dàng tạo ra các đoạn code lặp lại giúp đảm bảo cấu trúc nhất quán và hiệu suất coding.

- **Tạo một Module mới**:
  ```bash
  npm run plop:module
  ```
  Làm theo hướng dẫn trên terminal để tạo toàn bộ cấu trúc đầy đủ cho module.

- **Tạo một Entity mới**:
  ```bash
  npm run plop:entity
  ```
  Làm theo hướng dẫn để tự động sinh ra các file config, service hoặc model theo convention.

## Cấu trúc thư mục

- `src/`: Chứa mã nguồn logic của ứng dụng (components, services, modules).
- `public/`: Chứa các tài nguyên tĩnh (assets) như hình ảnh, css phụ, icons.
- `plop-templates/`: Các file mẫu tĩnh Handlebars của Plop code generator.
- `angular.json`: Nơi cấu hình chính cho toàn Workspace Angular.
