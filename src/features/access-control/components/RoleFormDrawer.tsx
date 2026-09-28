import { Button, Checkbox, Drawer, Flex, Form, Input, Space, Typography } from 'antd';
import { useEffect } from 'react';
import type { Permission } from '../../../types/auth';
import type { AdminRoleRecord, RoleFormMode, RoleFormValues } from '../accessControl.model';
import { PermissionGroups } from './PermissionGroups';

interface RoleFormDrawerProps {
  open: boolean;
  mode: RoleFormMode;
  role?: AdminRoleRecord;
  permissions: Permission[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: RoleFormValues) => void;
}

export function RoleFormDrawer({ open, mode, role, permissions, loading = false, onClose, onSubmit }: RoleFormDrawerProps) {
  const [form] = Form.useForm<RoleFormValues>();

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(role ? {
      code: role.code,
      name: role.name,
      description: role.description,
      permissionIds: role.permissions.map((permission) => permission.id),
    } : { code: '', name: '', description: '', permissionIds: [] });
  }, [form, open, role]);

  const close = () => {
    form.resetFields();
    onClose();
  };

  return <Drawer
    open={open}
    width="min(900px, 100%)"
    title={mode === 'create' ? 'Thêm vai trò' : 'Chỉnh sửa vai trò'}
    destroyOnHidden
    onClose={close}
    footer={<Flex justify="flex-end"><Space><Button disabled={loading} onClick={close}>Hủy</Button><Button type="primary" htmlType="submit" form="admin-role-form" loading={loading}>{mode === 'create' ? 'Thêm vai trò' : 'Lưu thay đổi'}</Button></Space></Flex>}
  >
    <Form<RoleFormValues> id="admin-role-form" form={form} layout="vertical" requiredMark validateTrigger="onBlur" onFinish={onSubmit}>
      <Flex gap={16} wrap>
        <Form.Item name="code" label="Mã vai trò" className="admin-access-control__form-field" rules={[{ required: true, whitespace: true, message: 'Nhập mã vai trò.' }, { pattern: /^[A-Za-z][A-Za-z0-9_]*$/, message: 'Mã chỉ gồm chữ, số, gạch dưới và bắt đầu bằng chữ.' }]}>
          <Input disabled={mode === 'edit'} maxLength={64} placeholder="Ví dụ: SALES_SUPERVISOR" />
        </Form.Item>
        <Form.Item name="name" label="Tên vai trò" className="admin-access-control__form-field" rules={[{ required: true, whitespace: true, message: 'Nhập tên vai trò.' }]}>
          <Input maxLength={120} />
        </Form.Item>
      </Flex>
      <Form.Item name="description" label="Mô tả"><Input.TextArea rows={3} maxLength={500} showCount /></Form.Item>
      <Typography.Title level={5}>Quyền hạn</Typography.Title>
      <Typography.Paragraph type="secondary">Quyền được nhóm theo module để dễ rà soát. Backend cần tiếp tục kiểm tra quyền trên từng API nghiệp vụ.</Typography.Paragraph>
      <Form.Item name="permissionIds">
        <Checkbox.Group className="admin-access-control__permission-checkbox-group">
          <PermissionGroups permissions={permissions} selectable />
        </Checkbox.Group>
      </Form.Item>
    </Form>
  </Drawer>;
}
