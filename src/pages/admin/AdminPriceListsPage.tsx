import { EditOutlined, EyeOutlined, PauseCircleOutlined, PlayCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { App, Button, Col, Flex, Input, Row, Select, Skeleton, Space, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { AdminListPage } from '../../components/admin/AdminListPage';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { PriceListDetailDrawer } from '../../features/pricing/components/PriceListDetailDrawer';
import { PriceListFormDrawer } from '../../features/pricing/components/PricingForms';
import { CustomerTypeTag, EffectivenessTag } from '../../features/pricing/components/PricingTags';
import { useAdminPricing } from '../../features/pricing/hooks/useAdminPricing';
import type { PriceListFilters, PriceListFormValues, PriceListView, PriceTierFormValues } from '../../features/pricing/pricing.model';
import { initialPriceListFilters, priceListCustomerTypeLabels } from '../../features/pricing/pricing.model';
import type { PriceList } from '../../types/catalog';
import '../../features/pricing/pricing.css';

export function AdminPriceListsPage() {
  const { message } = App.useApp();
  const [filters, setFilters] = useState<PriceListFilters>(initialPriceListFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedId, setSelectedId] = useState<number>();
  const [editingPriceList, setEditingPriceList] = useState<PriceList>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<PriceListView>();
  const {
    listQuery,
    detailQuery,
    productsQuery,
    createPriceList,
    updatePriceList,
    updatePriceListStatus,
    createTier,
    updateTier,
    deleteTier,
    isSavingPriceList,
    isUpdatingStatus,
    isSavingTier,
    isDeletingTier,
  } = useAdminPricing(filters, page, pageSize, selectedId);
  const rows = listQuery.data?.content ?? [];
  const total = listQuery.data?.totalElements ?? 0;

  const openCreate = () => { setEditingPriceList(undefined); setFormOpen(true); };
  const openEdit = (priceList: PriceList) => { setEditingPriceList(priceList); setDetailOpen(false); setFormOpen(true); };
  const savePriceList = async (values: PriceListFormValues) => {
    try {
      if (editingPriceList) await updatePriceList({ id: editingPriceList.id, values });
      else await createPriceList(values);
      void message.success(editingPriceList ? 'Đã cập nhật bảng giá.' : 'Đã thêm bảng giá.');
      setFormOpen(false);
      setEditingPriceList(undefined);
      if (!editingPriceList) setPage(1);
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể lưu bảng giá.');
    }
  };
  const changeStatus = async () => {
    if (!pendingStatus) return;
    try {
      await updatePriceListStatus({ id: pendingStatus.id, isActive: !pendingStatus.isActive });
      void message.success('Đã cập nhật trạng thái bảng giá.');
      setPendingStatus(undefined);
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái bảng giá.');
    }
  };
  const saveTier = async (values: PriceTierFormValues, tierId?: number) => {
    if (selectedId === undefined) return false;
    try {
      if (tierId === undefined) await createTier({ priceListId: selectedId, values });
      else await updateTier({ id: tierId, values });
      void message.success(tierId === undefined ? 'Đã thêm mức giá.' : 'Đã cập nhật mức giá.');
      return true;
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể lưu mức giá.');
      return false;
    }
  };
  const removeTier = async (tierId: number) => {
    try {
      await deleteTier(tierId);
      void message.success('Đã xóa mức giá.');
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể xóa mức giá.');
    }
  };
  const columns: TableProps<PriceListView>['columns'] = [
    { title: 'Mã bảng giá', dataIndex: 'code', width: 160, render: (value: string) => <Typography.Text code>{value}</Typography.Text> },
    { title: 'Tên bảng giá', dataIndex: 'name', width: 260, render: (value: string) => <Typography.Text strong>{value}</Typography.Text> },
    { title: 'Loại khách hàng', dataIndex: 'customerType', width: 150, render: (value) => <CustomerTypeTag value={value} /> },
    { title: 'Hiệu lực từ', dataIndex: 'validFrom', width: 130, responsive: ['md'], render: (value: string) => dayjs(value).format('DD/MM/YYYY') },
    { title: 'Hiệu lực đến', dataIndex: 'validTo', width: 140, responsive: ['md'], render: (value?: string) => value ? dayjs(value).format('DD/MM/YYYY') : 'Không giới hạn' },
    { title: 'Số sản phẩm', dataIndex: 'productCount', width: 120, align: 'center', responsive: ['lg'] },
    { title: 'Trạng thái', dataIndex: 'effectiveness', width: 150, render: (value) => <EffectivenessTag value={value} /> },
    { title: 'Thao tác', key: 'actions', width: 260, render: (_, record) => <Space size={2}><Button type="text" icon={<EyeOutlined />} onClick={() => { setSelectedId(record.id); setDetailOpen(true); }}>Xem</Button><Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)}>Sửa</Button><Button type="text" danger={record.isActive} icon={record.isActive ? <PauseCircleOutlined /> : <PlayCircleOutlined />} onClick={() => setPendingStatus(record)}>{record.isActive ? 'Tắt' : 'Bật'}</Button></Space> },
  ];

  return <div className="admin-pricing-page">
    <AdminListPage
      title="Bảng giá"
      description="Quản lý bảng giá theo nhóm khách hàng và mức giá theo số lượng"
      primaryAction={<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm bảng giá</Button>}
      toolbar={<Row gutter={[12, 12]} align="middle">
        <Col xs={24} md={10} xl={8}><Input allowClear value={filters.keyword} prefix={<SearchOutlined />} placeholder="Tìm mã hoặc tên bảng giá" onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }); setPage(1); }} /></Col>
        <Col xs={24} sm={12} md={5} xl={4}><Select allowClear value={filters.customerType} placeholder="Loại khách hàng" style={{ width: '100%' }} options={Object.entries(priceListCustomerTypeLabels).map(([value, label]) => ({ value, label }))} onChange={(customerType) => { setFilters({ ...filters, customerType }); setPage(1); }} /></Col>
        <Col xs={24} sm={12} md={5} xl={4}><Select value={filters.effectiveness} style={{ width: '100%' }} options={[{ value: 'ALL', label: 'Tất cả hiệu lực' }, { value: 'UPCOMING', label: 'Chưa hiệu lực' }, { value: 'ACTIVE', label: 'Đang hiệu lực' }, { value: 'EXPIRED', label: 'Hết hiệu lực' }]} onChange={(effectiveness) => { setFilters({ ...filters, effectiveness }); setPage(1); }} /></Col>
        <Col xs={24} sm={12} md={4} xl={4}><Button block icon={<ReloadOutlined />} disabled={listQuery.isFetching} onClick={() => { setFilters(initialPriceListFilters); setPage(1); }}>Xóa bộ lọc</Button></Col>
      </Row>}
      summary={<Typography.Text strong>{total} bảng giá</Typography.Text>}
    >
      {listQuery.isLoading ? <div className="admin-pricing__loading"><Skeleton active paragraph={{ rows: 7 }} /></div> : null}
      {listQuery.isError ? <ErrorState message="Không thể tải danh sách bảng giá mock." onRetry={() => void listQuery.refetch()} /> : null}
      {!listQuery.isLoading && !listQuery.isError ? <Table className="admin-pricing__table" rowKey="id" columns={columns} dataSource={rows} loading={listQuery.isFetching} scroll={{ x: 1380 }} pagination={{ current: page, pageSize, total, showSizeChanger: true, pageSizeOptions: [10, 20, 50], showTotal: (count) => `${count} bảng giá`, onChange: (nextPage, nextSize) => { setPage(nextSize !== pageSize ? 1 : nextPage); setPageSize(nextSize); } }} locale={{ emptyText: <Flex vertical align="center" gap={12} className="admin-pricing__empty"><EmptyState description="Chưa có bảng giá phù hợp." /><Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm bảng giá</Button></Flex> }} /> : null}
    </AdminListPage>
    <PriceListFormDrawer open={formOpen} priceList={editingPriceList} loading={isSavingPriceList} onClose={() => { setFormOpen(false); setEditingPriceList(undefined); }} onSubmit={(values) => void savePriceList(values)} />
    <PriceListDetailDrawer open={detailOpen} detail={detailQuery.data} products={productsQuery.data ?? []} loading={detailQuery.isLoading} error={detailQuery.error} productsLoading={productsQuery.isLoading} productsError={productsQuery.error} tierSaving={isSavingTier} tierDeleting={isDeletingTier} onClose={() => { setDetailOpen(false); setSelectedId(undefined); }} onRetry={() => void detailQuery.refetch()} onEditPriceList={openEdit} onSaveTier={saveTier} onDeleteTier={removeTier} />
    <ConfirmModal open={Boolean(pendingStatus)} title={pendingStatus?.isActive ? 'Tắt bảng giá?' : 'Kích hoạt bảng giá?'} content={pendingStatus ? `Xác nhận ${pendingStatus.isActive ? 'tắt' : 'kích hoạt'} “${pendingStatus.name}”. Các mức giá hiện có không bị xóa.` : ''} confirmText={pendingStatus?.isActive ? 'Tắt bảng giá' : 'Kích hoạt'} danger={pendingStatus?.isActive} loading={isUpdatingStatus} onConfirm={() => void changeStatus()} onCancel={() => setPendingStatus(undefined)} />
  </div>;
}
