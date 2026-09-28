import { Alert, Button, Checkbox, Col, Drawer, Flex, Form, Input, Row, Select, Space, Tabs, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import type { UserFormMode, UserFormValues, UserReferences } from '../systemUsers.model';
import type { AdminUserDetail } from '../systemUsers.model';

interface UserFormDrawerProps {
  open: boolean;
  mode: UserFormMode;
  user?: AdminUserDetail;
  references: UserReferences;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
}

export function UserFormDrawer({ open, mode, user, references, loading = false, onClose, onSubmit }: UserFormDrawerProps) {
  const [form] = Form.useForm<UserFormValues>();
  const selectedBranchIds = Form.useWatch('branchIds', form) ?? [];
  const selectedWarehouseIds = Form.useWatch('warehouseIds', form) ?? [];
  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(user ? {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      branchId: user.branchId,
      isActive: user.isActive,
      roleIds: user.roles.map((role) => role.id),
      branchIds: user.accessibleBranches.map((branch) => branch.id),
      warehouseIds: user.accessibleWarehouses.map((warehouse) => warehouse.id),
      password: undefined,
      confirmPassword: undefined,
    } : { username: '', fullName: '', email: '', phone: '', branchId: undefined, isActive: true, roleIds: [], branchIds: [], warehouseIds: [], password: '', confirmPassword: '' });
  }, [form, open, user]);
  const visibleWarehouses = useMemo(() => references.warehouses.filter((warehouse) => (
    selectedBranchIds.includes(warehouse.branchId) || selectedWarehouseIds.includes(warehouse.id)
  )), [references.warehouses, selectedBranchIds, selectedWarehouseIds]);
  const outOfScopeWarehouseIds = useMemo(() => visibleWarehouses
    .filter((warehouse) => selectedWarehouseIds.includes(warehouse.id) && !selectedBranchIds.includes(warehouse.branchId))
    .map((warehouse) => warehouse.id), [selectedBranchIds, selectedWarehouseIds, visibleWarehouses]);
  const close = () => { form.resetFields(); onClose(); };
  const accountTab = <>
    <Row gutter={16}><Col xs={24} sm={12}><Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, whitespace: true, message: 'Nhập tên đăng nhập.' }, { pattern: /^[A-Za-z0-9._-]+$/, message: 'Tên đăng nhập chỉ gồm chữ, số, dấu chấm, gạch ngang hoặc gạch dưới.' }]}><Input disabled={mode === 'edit'} maxLength={64} autoComplete="username" /></Form.Item></Col><Col xs={24} sm={12}><Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, whitespace: true, message: 'Nhập họ và tên.' }]}><Input maxLength={160} /></Form.Item></Col></Row>
    <Row gutter={16}><Col xs={24} sm={12}><Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email không đúng định dạng.' }]}><Input maxLength={160} /></Form.Item></Col><Col xs={24} sm={12}><Form.Item name="phone" label="Số điện thoại" rules={[{ pattern: /^(?:\+?84|0)[0-9\s.-]{8,14}$/, message: 'Số điện thoại không hợp lệ.' }]}><Input maxLength={18} /></Form.Item></Col></Row>
    {mode === 'create' ? <Row gutter={16}><Col xs={24} sm={12}><Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Nhập mật khẩu.' }, { min: 8, message: 'Mật khẩu cần ít nhất 8 ký tự.' }]}><Input.Password autoComplete="new-password" /></Form.Item></Col><Col xs={24} sm={12}><Form.Item name="confirmPassword" label="Xác nhận mật khẩu" dependencies={['password']} rules={[{ required: true, message: 'Xác nhận mật khẩu.' }, ({ getFieldValue }) => ({ validator: (_, value?: string) => !value || getFieldValue('password') === value ? Promise.resolve() : Promise.reject(new Error('Xác nhận mật khẩu không khớp.')) })]}><Input.Password autoComplete="new-password" /></Form.Item></Col></Row> : <Alert type="info" showIcon message="Mật khẩu không được hiển thị" description="Màn hình chỉnh sửa không thay đổi mật khẩu hiện tại. Quy trình đặt lại mật khẩu sẽ được bổ sung riêng khi có contract backend." />}
    <Row gutter={16} style={{ marginTop: mode === 'edit' ? 16 : 0 }}><Col xs={24} sm={12}><Form.Item name="branchId" label="Chi nhánh làm việc chính"><Select allowClear showSearch optionFilterProp="label" options={references.branches.map((branch) => ({ value: branch.id, label: branch.name }))} /></Form.Item></Col><Col xs={24} sm={12}><Form.Item name="isActive" label="Trạng thái" rules={[{ required: true, message: 'Chọn trạng thái.' }]}><Select options={[{ value: true, label: 'Hoạt động' }, { value: false, label: 'Ngừng hoạt động' }]} /></Form.Item></Col></Row>
  </>;
  const rolesTab = <Form.Item name="roleIds" label="Vai trò được gán"><Checkbox.Group style={{ width: '100%' }}><Row gutter={[16, 12]}>{references.roles.map((role) => <Col xs={24} sm={12} key={role.id}><Checkbox value={role.id}>{role.name}</Checkbox></Col>)}</Row></Checkbox.Group></Form.Item>;
  const scopeTab = <Flex vertical gap={8}>
    <Typography.Text type="secondary">Chi nhánh làm việc chính và phạm vi chi nhánh là hai thiết lập độc lập.</Typography.Text>
    <Form.Item name="branchIds" label="Chi nhánh được truy cập"><Checkbox.Group style={{ width: '100%' }}><Row gutter={[16, 12]}>{references.branches.map((branch) => <Col xs={24} sm={12} key={branch.id}><Checkbox value={branch.id}>{branch.name}</Checkbox></Col>)}</Row></Checkbox.Group></Form.Item>
    {outOfScopeWarehouseIds.length ? <Alert type="warning" showIcon message="Có kho nằm ngoài phạm vi chi nhánh" description="Các kho này vẫn được giữ để tránh mất dữ liệu ngoài ý muốn. Hãy chọn lại chi nhánh tương ứng hoặc bỏ chọn kho trước khi lưu." /> : null}
    <Form.Item
      name="warehouseIds"
      label="Kho được truy cập"
      dependencies={['branchIds']}
      rules={[({ getFieldValue }) => ({
        validator: (_, warehouseIds: number[] = []) => {
          const branchIds: number[] = getFieldValue('branchIds') ?? [];
          const invalid = warehouseIds.some((warehouseId) => {
            const warehouse = references.warehouses.find((item) => item.id === warehouseId);
            return !warehouse || !branchIds.includes(warehouse.branchId);
          });
          return invalid
            ? Promise.reject(new Error('Kho được truy cập phải thuộc chi nhánh trong phạm vi dữ liệu.'))
            : Promise.resolve();
        },
      })]}
    ><Checkbox.Group style={{ width: '100%' }}><Row gutter={[16, 12]}>{visibleWarehouses.map((warehouse) => { const branchName = references.branches.find((branch) => branch.id === warehouse.branchId)?.name; const outOfScope = !selectedBranchIds.includes(warehouse.branchId); return <Col xs={24} sm={12} key={warehouse.id}><Checkbox value={warehouse.id}>{warehouse.name}{branchName ? ` — ${branchName}` : ''}{outOfScope ? ' (ngoài phạm vi)' : ''}</Checkbox></Col>; })}</Row></Checkbox.Group>{visibleWarehouses.length === 0 ? <Typography.Text type="secondary">Chọn ít nhất một chi nhánh để xem danh sách kho.</Typography.Text> : null}</Form.Item>
  </Flex>;
  return <Drawer open={open} width="min(780px, 100%)" title={mode === 'create' ? 'Thêm người dùng' : 'Chỉnh sửa người dùng'} destroyOnHidden onClose={close} footer={<Flex justify="flex-end"><Space><Button disabled={loading} onClick={close}>Hủy</Button><Button type="primary" htmlType="submit" form="admin-system-user-form" loading={loading}>{mode === 'create' ? 'Thêm người dùng' : 'Lưu thay đổi'}</Button></Space></Flex>}>
    <Form<UserFormValues> id="admin-system-user-form" form={form} layout="vertical" requiredMark validateTrigger="onBlur" onFinish={onSubmit}><Tabs items={[{ key: 'account', label: 'Thông tin tài khoản', forceRender: true, children: accountTab }, { key: 'roles', label: 'Vai trò', forceRender: true, children: rolesTab }, { key: 'scope', label: 'Phạm vi dữ liệu', forceRender: true, children: scopeTab }]} /></Form>
  </Drawer>;
}
