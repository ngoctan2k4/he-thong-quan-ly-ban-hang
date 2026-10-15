import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Drawer, Flex, Form, Input, InputNumber, Select, Skeleton, Table, Typography } from 'antd';
import { useState } from 'react';
import { AdminListPage } from '../../components/admin/AdminListPage';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { inventoryApi, type InventoryBalance } from './inventory.api';

interface Props { variant: 'balance' | 'stock-issues' }

export function InventoryAvailabilityPage({ variant }: Props) {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBalance, setEditingBalance] = useState<InventoryBalance>();
  const balances = useQuery({ queryKey: ['inventory', 'balances'], queryFn: inventoryApi.listBalances });
  const issues = useQuery({ queryKey: ['inventory', 'issues'], queryFn: inventoryApi.listIssues, enabled: variant === 'stock-issues' });
  const products = useQuery({ queryKey: ['inventory', 'products'], queryFn: inventoryApi.listProducts });
  const invalidate = () => Promise.all([
    queryClient.invalidateQueries({ queryKey: ['inventory', 'balances'] }),
    queryClient.invalidateQueries({ queryKey: ['inventory', 'issues'] }),
  ]);
  const saveBalance = useMutation({ mutationFn: ({ productId, values }: { productId: number; values: { onHand: number; reserved: number } }) => inventoryApi.saveBalance(productId, values), onSuccess: invalidate });
  const createIssue = useMutation({ mutationFn: inventoryApi.createIssue, onSuccess: invalidate });
  const query = variant === 'balance' ? balances : issues;

  const submit = async () => {
    try {
      const values = await form.validateFields();
      if (variant === 'balance') await saveBalance.mutateAsync({ productId: values.productId, values: { onHand: values.onHand, reserved: values.reserved } });
      else await createIssue.mutateAsync({ reference: values.reference, productId: values.productId, quantity: values.quantity });
      void message.success(variant === 'balance' ? 'Đã cập nhật tồn kho.' : 'Đã xuất kho và trừ tồn thực tế.');
      setDrawerOpen(false); setEditingBalance(undefined); form.resetFields();
    } catch (error) {
      if (error instanceof Error) void message.error(error.message);
    }
  };

  const openBalance = (record?: InventoryBalance) => {
    setEditingBalance(record); setDrawerOpen(true);
    form.setFieldsValue(record ? { productId: record.productId, onHand: record.onHand, reserved: record.reserved } : { reserved: 0 });
  };

  const balanceColumns = [
    { title: 'SKU', dataIndex: 'sku', width: 160 },
    { title: 'Sản phẩm', dataIndex: 'product', width: 300 },
    { title: 'Thực tế', dataIndex: 'onHand', width: 100, align: 'right' as const },
    { title: 'Giữ chỗ', dataIndex: 'reserved', width: 100, align: 'right' as const },
    { title: 'Khả dụng', dataIndex: 'available', width: 110, align: 'right' as const, render: (value: number, row: InventoryBalance) => <Typography.Text strong type={value <= row.reorderPoint ? 'danger' : undefined}>{value}</Typography.Text> },
    { title: 'Điểm đặt lại', dataIndex: 'reorderPoint', width: 130, align: 'right' as const },
    { title: 'Thao tác', width: 100, render: (_: unknown, row: InventoryBalance) => <Button type="link" onClick={() => openBalance(row)}>Sửa tồn</Button> },
  ];
  const issueColumns = [
    { title: 'Mã phiếu', dataIndex: 'code', width: 160 },
    { title: 'Chứng từ', dataIndex: 'reference', width: 170 },
    { title: 'SKU', dataIndex: 'sku', width: 160 },
    { title: 'Sản phẩm', dataIndex: 'product', width: 300 },
    { title: 'Số lượng xuất', dataIndex: 'quantity', width: 130, align: 'right' as const },
    { title: 'Ngày tạo', dataIndex: 'createdAt', width: 190, render: (value: string) => new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) },
  ];

  return <AdminListPage
    title={variant === 'balance' ? 'Tồn kho khả dụng' : 'Phiếu xuất kho'}
    description={variant === 'balance' ? 'Dữ liệu tồn thực tế, giữ chỗ và khả dụng được lưu trong database.' : 'Hệ thống tự động chặn số lượng xuất vượt tồn khả dụng.'}
    primaryAction={<Button type="primary" icon={<PlusOutlined />} onClick={() => variant === 'balance' ? openBalance() : setDrawerOpen(true)}>{variant === 'balance' ? 'Thiết lập tồn' : 'Tạo phiếu xuất'}</Button>}
    toolbar={null}
    summary={<Typography.Text strong>{query.data?.length ?? 0} bản ghi</Typography.Text>}
  >
    {query.isLoading ? <Skeleton active paragraph={{ rows: 7 }} /> : null}
    {query.isError ? <ErrorState message="Không thể tải dữ liệu tồn kho từ máy chủ." onRetry={() => void query.refetch()} /> : null}
    {!query.isLoading && !query.isError && variant === 'balance' ? <Table rowKey="id" dataSource={balances.data} columns={balanceColumns} scroll={{ x: 980 }} locale={{ emptyText: <EmptyState description="Chưa có dữ liệu." /> }} /> : null}
    {!query.isLoading && !query.isError && variant === 'stock-issues' ? <Table rowKey="id" dataSource={issues.data} columns={issueColumns} scroll={{ x: 980 }} locale={{ emptyText: <EmptyState description="Chưa có dữ liệu." /> }} /> : null}
    <Drawer open={drawerOpen} width="min(520px, 100%)" title={variant === 'balance' ? 'Thiết lập tồn kho' : 'Tạo phiếu xuất kho'} destroyOnHidden onClose={() => { setDrawerOpen(false); setEditingBalance(undefined); form.resetFields(); }} footer={<Flex justify="flex-end" gap={8}><Button onClick={() => setDrawerOpen(false)}>Hủy</Button><Button type="primary" loading={saveBalance.isPending || createIssue.isPending} onClick={() => void submit()}>Lưu</Button></Flex>}>
      <Form form={form} layout="vertical">
        {variant === 'stock-issues' ? <Form.Item name="reference" label="Chứng từ/đơn bán" rules={[{ required: true, message: 'Nhập mã chứng từ.' }]}><Input placeholder="SO-..." /></Form.Item> : null}
        <Form.Item name="productId" label="Sản phẩm" rules={[{ required: true, message: 'Chọn sản phẩm.' }]}><Select showSearch optionFilterProp="label" disabled={Boolean(editingBalance)} options={products.data ?? []} placeholder="Chọn sản phẩm" /></Form.Item>
        {variant === 'balance' ? <><Form.Item name="onHand" label="Tồn thực tế" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item><Form.Item name="reserved" label="Số lượng giữ chỗ" dependencies={['onHand']} rules={[{ required: true }, ({ getFieldValue }) => ({ validator: (_, value) => Number(value) <= Number(getFieldValue('onHand')) ? Promise.resolve() : Promise.reject(new Error('Giữ chỗ không được vượt tồn thực tế.')) })]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></> : <Form.Item name="quantity" label="Số lượng xuất" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>}
      </Form>
    </Drawer>
  </AdminListPage>;
}
