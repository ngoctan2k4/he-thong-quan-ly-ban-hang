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

## Chạy project

```bash
npm install
npm run dev
```

Kiểm tra build:

```bash
npm run build
```

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
