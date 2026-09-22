# Quy ước làm việc chung Frontend

## Phân công

- Thành viên A: 7.1 Website khách hàng + 7.2 POS
- Thành viên B: 7.3 Web quản trị

## Shared contract — phải đồng bộ trước khi sửa

Các vùng sau dùng chung cho cả nhóm:

- `src/app/`
- `src/api/`
- `src/types/`
- `src/components/common/`
- `src/hooks/`
- `src/utils/`

Không tạo model/API client trùng lặp cho Customer, POS và Admin.

## Quy tắc kiến trúc

- React + TypeScript, strict mode.
- Server state: TanStack Query.
- HTTP: duy nhất `src/api/client.ts`.
- UI: Ant Design + theme chung.
- Route chia namespace Customer / POS / Admin.
- Backend là nơi quyết định authorization; frontend chỉ hỗ trợ UX ẩn/hiện theo quyền.

## Git gợi ý

- `main`: foundation ổn định.
- `feat/customer-pos`: 7.1 + 7.2.
- `feat/admin`: 7.3.

Mọi thay đổi shared contract nên merge nhỏ, thường xuyên và báo cho thành viên còn lại.
