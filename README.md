# Frontend Foundation — Sales Management System

Foundation React + TypeScript dùng chung cho:

- 7.1 Website khách hàng
- 7.2 POS
- 7.3 Web quản trị

## Công nghệ

- React + TypeScript + Vite
- React Router
- TanStack Query
- Axios
- Ant Design
- Node.js 22 + Express
- PostgreSQL 17

## Cài đặt

Yêu cầu Node.js 22 trở lên. Cài dependency cho cả frontend và backend:

```bash
npm ci
npm ci --prefix server
```

Chạy frontend và backend ở hai terminal:

```bash
npm run dev
npm run dev:server
```

Frontend chạy tại `http://localhost:5173` và chuyển tiếp `/api` đến backend tại `http://localhost:3000`.

## Chạy toàn bộ bằng Docker

Chỉ cần cài và mở Docker Desktop, sau đó chạy:

```bash
docker compose up --build -d
```

Docker sẽ build frontend/backend, khởi động PostgreSQL, tự tạo schema và seed dữ liệu ở lần chạy đầu. Mở `http://localhost:3000` để sử dụng ứng dụng.

Kiểm tra trạng thái và log:

```bash
docker compose ps
docker compose logs -f app
```

Dừng hệ thống nhưng giữ nguyên dữ liệu:

```bash
docker compose down
```

Dữ liệu nằm trong volume `frontend-foundation_postgres_data`, vì vậy không bị mất khi container được tạo lại.

Kiểm tra toàn bộ trước khi tạo pull request:

```bash
npm run check
```

## Backend module 3.B

Backend TypeScript/Express nằm trong `server/` và dùng PostgreSQL để lưu dữ liệu. Đây là backend cho phạm vi module 3.B: danh mục hàng hóa, giá, nhà cung cấp và tồn kho cơ bản.

Nếu chỉ muốn chạy PostgreSQL trong Docker và chạy mã nguồn bằng Node.js:

```bash
docker compose up -d postgres
```

```bash
npm run db:seed
```

Lệnh seed không ghi đè database đã có dữ liệu. Dữ liệu PostgreSQL nằm trong Docker volume `postgres_data` và không được commit vào Git.

Các biến môi trường backend:

- `PORT`: cổng HTTP, mặc định `3000`.
- `DATABASE_URL`: connection string PostgreSQL, mặc định local là `postgresql://postgres:postgres@localhost:5432/sales_management`.
- `CORS_ORIGIN`: một hoặc nhiều origin, phân cách bằng dấu phẩy.

Sao chép `server/.env.example` thành `server/.env` khi cần thay đổi cấu hình local. Không commit file `.env`.

Để chạy FE và BE trên cùng cổng `3000`:

```bash
npm run build:all
npm start
```

Sau đó chỉ cần mở `http://localhost:3000`. Backend phục vụ bản build React và giữ toàn bộ API dưới `/api`.

Health check: `GET /api/health` trả trạng thái ứng dụng và kết nối database.

Danh sách endpoint và quy ước phản hồi nằm tại [`server/API.md`](server/API.md).

Các API đã có: nhóm hàng, đơn vị tính, hàng hóa, quy đổi đơn vị, giá lẻ/sỉ, MOQ khách sỉ, thiết lập tồn, bảng giá theo bậc số lượng, thông tin mua hàng/nhà cung cấp mặc định và chặn xuất vượt tồn khả dụng. Những màn hình khác trong frontend vẫn là dữ liệu mô phỏng và không thuộc backend module 3.B này.

## Kiểm tra chất lượng

- `npm run lint`: kiểm tra ESLint cho frontend và backend.
- `npm run build:all`: build TypeScript, frontend và backend.
- `npm run test:server`: chạy integration test API và persistence test PostgreSQL in-memory.
- `npm run check`: chạy toàn bộ các bước trên theo đúng thứ tự CI.

GitHub Actions chạy `npm run check` cho mọi push và pull request.

## Routes hiện tại

Customer:
- `/`
- `/products`
- `/products/:id`
- `/cart`
- `/checkout`
- `/orders`
- `/orders/:id`
- `/account`
- `/login`
- `/register`

POS:
- `/pos`
- `/pos/sale`

Admin:
- `/admin/dashboard`
- `/admin/products`
- `/admin/customers`
- `/admin/suppliers`
- `/admin/sales`
- `/admin/purchase`
- `/admin/inventory`
- `/admin/ai`
- `/admin/approvals`
- `/admin/users`
- `/admin/roles`
- `/admin/permissions`
- `/admin/scopes`
- `/admin/audit-logs`

## Quy ước phát triển nhóm

- Không tạo project frontend thứ hai.
- Không tạo API client riêng cho Customer/POS/Admin.
- Domain types dùng chung trong `src/types`.
- Shared UI đặt tại `src/components/common`.
- 7.1/7.2 phát triển dưới `pages/customer`, `pages/pos`.
- 7.3 phát triển dưới `pages/admin`.
