# API backend module 3.B

Base URL mặc định: `http://localhost:3000/api`.

## Quy ước phản hồi

Phản hồi thành công:

```json
{ "success": true, "data": {} }
```

Phản hồi lỗi:

```json
{ "success": false, "message": "Mô tả lỗi" }
```

Các API danh sách nhận `page` và `size` (tối đa 100), cùng các bộ lọc được dùng trên giao diện. Mã lỗi chính: `400` dữ liệu không hợp lệ, `404` không tìm thấy, `409` xung đột nghiệp vụ và `500` lỗi hệ thống.

## Endpoint

### Hệ thống

- `GET /health`: trạng thái HTTP service và PostgreSQL.

### Danh mục

- `GET|POST /admin/catalog/categories`
- `PUT /admin/catalog/categories/:id`
- `PATCH /admin/catalog/categories/:id/status`
- `GET|POST /admin/catalog/units`
- `PUT /admin/catalog/units/:id`
- `PATCH /admin/catalog/units/:id/status`
- `GET /admin/catalog/references`

### Sản phẩm

- `GET|POST /admin/products`
- `PUT /admin/products/:id`
- `PATCH /admin/products/:id/active`
- `PATCH /admin/products/:id/status`
- `GET /admin/products/references`
- `GET /admin/products/references/suppliers`
- `GET /admin/products/:id/quote`
- `GET|POST /admin/products/:id/conversions`
- `PATCH|DELETE /admin/products/conversions/:id`
- `GET|POST /admin/products/:id/suppliers`
- `PUT|DELETE /admin/products/:productId/suppliers/:relationId`

### Bảng giá

- `GET|POST /admin/price-lists`
- `GET|PUT /admin/price-lists/:id`
- `PATCH /admin/price-lists/:id/status`
- `GET /admin/price-lists/products`
- `POST /admin/price-lists/:id/tiers`
- `PUT|DELETE /admin/price-lists/tiers/:id`

### Nhà cung cấp

- `GET|POST /admin/suppliers`
- `GET|PUT /admin/suppliers/:id`
- `PATCH /admin/suppliers/:id/status`
- `GET /admin/suppliers/products`
- `POST /admin/suppliers/:id/products`
- `PUT|DELETE /admin/suppliers/:supplierId/products/:relationId`

### Tồn kho cơ bản

- `GET /admin/inventory/products`
- `GET /admin/inventory/balances`
- `PUT /admin/inventory/balances/:productId`
- `GET|POST /admin/inventory/issues`

## Giới hạn phạm vi

API hiện phục vụ module 3.B và chưa phải API production cho toàn bộ hệ thống bán hàng. Xác thực/phân quyền, khách hàng, đơn bán, đơn mua, thanh toán và các nghiệp vụ kho nâng cao chưa thuộc contract này. Không triển khai public Internet trước khi bổ sung authentication và authorization middleware.
