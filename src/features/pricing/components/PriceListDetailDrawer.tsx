import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Descriptions, Drawer, Empty, Flex, Popconfirm, Skeleton, Space, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { ErrorState } from '../../../components/common/ErrorState';
import type { PriceListDetail, PriceTierFormValues, PriceTierView, PricingProductOption } from '../pricing.model';
import { getPriceListEffectiveness } from '../pricing.model';
import { CustomerTypeTag, EffectivenessTag, vndFormatter } from './PricingTags';
import { PriceTierFormModal } from './PricingForms';

interface PriceListDetailDrawerProps {
  open: boolean;
  detail?: PriceListDetail;
  products: PricingProductOption[];
  loading?: boolean;
  error?: Error | null;
  productsLoading?: boolean;
  productsError?: Error | null;
  tierSaving?: boolean;
  tierDeleting?: boolean;
  onClose: () => void;
  onRetry: () => void;
  onEditPriceList: (priceList: PriceListDetail) => void;
  onSaveTier: (values: PriceTierFormValues, tierId?: number) => Promise<boolean>;
  onDeleteTier: (tierId: number) => Promise<void>;
}

export function PriceListDetailDrawer({ open, detail, products, loading = false, error, productsLoading = false, productsError, tierSaving = false, tierDeleting = false, onClose, onRetry, onEditPriceList, onSaveTier, onDeleteTier }: PriceListDetailDrawerProps) {
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<PriceTierView>();
  const openCreateTier = () => { setEditingTier(undefined); setTierModalOpen(true); };
  const closeTierModal = () => { setTierModalOpen(false); setEditingTier(undefined); };
  const saveTier = async (values: PriceTierFormValues) => {
    if (await onSaveTier(values, editingTier?.id)) closeTierModal();
  };
  const columns: TableProps<PriceTierView>['columns'] = [
    {
      title: 'Sản phẩm',
      key: 'product',
      width: 300,
      render: (_, tier) => <Flex vertical gap={2}><Typography.Text strong>{tier.productCode} - {tier.productName}</Typography.Text>{tier.productIsActive ? null : <Tag style={{ width: 'fit-content' }}>Sản phẩm ngừng hoạt động</Tag>}</Flex>,
    },
    { title: 'SL từ', dataIndex: 'minQty', width: 100, align: 'right' },
    { title: 'SL đến', dataIndex: 'maxQty', width: 110, align: 'right', render: (value?: number) => value ?? 'Không giới hạn' },
    { title: 'Đơn giá', dataIndex: 'unitPrice', width: 150, align: 'right', render: (value: number) => <Typography.Text strong>{vndFormatter.format(value)}</Typography.Text> },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, tier) => <Space size={2}>
        <Button type="text" size="small" icon={<EditOutlined />} aria-label={`Sửa mức giá ${tier.productName}`} onClick={() => { setEditingTier(tier); setTierModalOpen(true); }} />
        <Popconfirm title="Xóa mức giá này?" description="Mức giá sẽ được loại khỏi bảng giá." okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true, loading: tierDeleting }} onConfirm={() => onDeleteTier(tier.id)}><Button type="text" danger size="small" icon={<DeleteOutlined />} aria-label={`Xóa mức giá ${tier.productName}`} /></Popconfirm>
      </Space>,
    },
  ];

  return <>
    <Drawer
      open={open}
      width="min(980px, 100%)"
      title="Chi tiết bảng giá"
      destroyOnHidden
      onClose={() => { closeTierModal(); onClose(); }}
      extra={detail ? <Button icon={<EditOutlined />} onClick={() => onEditPriceList(detail)}>Chỉnh sửa</Button> : null}
    >
      {loading ? <Skeleton active paragraph={{ rows: 10 }} /> : null}
      {error ? <ErrorState message={error.message || 'Không thể tải chi tiết bảng giá.'} onRetry={onRetry} /> : null}
      {!loading && !error && detail ? <Flex vertical gap={24}>
        <section>
          <Typography.Title level={5}>Thông tin chung</Typography.Title>
          <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Mã bảng giá"><Typography.Text code>{detail.code}</Typography.Text></Descriptions.Item>
            <Descriptions.Item label="Tên bảng giá">{detail.name}</Descriptions.Item>
            <Descriptions.Item label="Loại khách hàng"><CustomerTypeTag value={detail.customerType} /></Descriptions.Item>
            <Descriptions.Item label="Trạng thái"><EffectivenessTag value={getPriceListEffectiveness(detail)} /></Descriptions.Item>
            <Descriptions.Item label="Hiệu lực từ">{dayjs(detail.validFrom).format('DD/MM/YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Hiệu lực đến">{detail.validTo ? dayjs(detail.validTo).format('DD/MM/YYYY') : 'Không giới hạn'}</Descriptions.Item>
          </Descriptions>
        </section>
        <section>
          <Flex justify="space-between" align="center" gap={12} wrap>
            <div><Typography.Title level={5} style={{ marginBottom: 0 }}>Mức giá sản phẩm</Typography.Title><Typography.Text type="secondary">Khoảng số lượng được tính bao gồm cả hai đầu mút.</Typography.Text></div>
            <Button type="primary" icon={<PlusOutlined />} loading={productsLoading} disabled={Boolean(productsError)} onClick={openCreateTier}>Thêm mức giá</Button>
          </Flex>
          {productsError ? <Alert type="error" showIcon message="Không thể tải danh sách sản phẩm" description="Hãy thử đóng và mở lại chi tiết bảng giá." style={{ marginTop: 16 }} /> : null}
          <Table className="admin-pricing__tier-table" rowKey="id" size="small" columns={columns} dataSource={detail.tiers} pagination={false} scroll={{ x: 820 }} locale={{ emptyText: <Empty description="Chưa có mức giá sản phẩm" /> }} style={{ marginTop: 16 }} />
        </section>
      </Flex> : null}
    </Drawer>
    <PriceTierFormModal open={tierModalOpen} tier={editingTier} products={products} loading={tierSaving} onClose={closeTierModal} onSubmit={(values) => void saveTier(values)} />
  </>;
}
