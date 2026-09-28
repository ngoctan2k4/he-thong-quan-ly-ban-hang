import {
  EditOutlined,
  EyeOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Alert,
  App,
  Button,
  Col,
  Descriptions,
  Drawer,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  TreeSelect,
  Typography,
} from 'antd';
import type { TableProps } from 'antd';
import { useEffect, useState } from 'react';
import { AdminListPage } from '../../components/admin/AdminListPage';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import '../../features/catalog/catalog.css';
import {
  useAdminBranches,
  useAdminCategories,
  useAdminUnits,
  useAdminWarehouses,
} from '../../features/catalog/hooks/useAdminCatalog';
import type {
  ActiveFilter,
  BranchFormValues,
  CatalogFormMode,
  CategoryFormValues,
  CategoryView,
  UnitFormValues,
  WarehouseFormValues,
  WarehouseView,
} from '../../features/catalog/catalog.model';
import {
  initialBranchFilters,
  initialCategoryFilters,
  initialUnitFilters,
  initialWarehouseFilters,
} from '../../features/catalog/catalog.model';
import type { Branch, ProductCategory, Unit, Warehouse } from '../../types/catalog';

function ActiveTag({ active }: { active: boolean }) {
  return <Tag color={active ? 'success' : 'default'}>{active ? 'Hoạt động' : 'Ngừng hoạt động'}</Tag>;
}

function LoadingRows() {
  return <div className="admin-catalog-page__loading"><Skeleton active paragraph={{ rows: 7 }} /></div>;
}

function PaginationConfig({
  page,
  pageSize,
  total,
  label,
  onChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  label: string;
  onChange: (page: number, pageSize: number) => void;
}) {
  return {
    current: page,
    pageSize,
    total,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50'],
    showTotal: (count: number) => `${count} ${label}`,
    onChange,
  };
}

function SearchToolbar({
  keyword,
  placeholder,
  status,
  loading,
  extra,
  onKeywordChange,
  onStatusChange,
  onReset,
}: {
  keyword: string;
  placeholder: string;
  status?: ActiveFilter;
  loading?: boolean;
  extra?: React.ReactNode;
  onKeywordChange: (value: string) => void;
  onStatusChange?: (value: ActiveFilter) => void;
  onReset: () => void;
}) {
  return (
    <Row gutter={[12, 12]} align="middle">
      <Col xs={24} md={12} xl={8}>
        <Input allowClear value={keyword} prefix={<SearchOutlined />} placeholder={placeholder} onChange={(event) => onKeywordChange(event.target.value)} />
      </Col>
      {extra}
      {status && onStatusChange ? (
        <Col xs={24} sm={12} md={6} xl={4}>
          <Select value={status} style={{ width: '100%' }} onChange={onStatusChange} options={[
            { value: 'ALL', label: 'Tất cả trạng thái' },
            { value: 'ACTIVE', label: 'Hoạt động' },
            { value: 'INACTIVE', label: 'Ngừng hoạt động' },
          ]} />
        </Col>
      ) : null}
      <Col xs={24} sm={12} md={6} xl={4}>
        <Button block icon={<ReloadOutlined />} disabled={loading} onClick={onReset}>Xóa bộ lọc</Button>
      </Col>
    </Row>
  );
}

function getCategoryDescendantIds(categories: ProductCategory[], categoryId: number): Set<number> {
  const descendantIds = new Set<number>();
  const pending = [categoryId];
  while (pending.length) {
    const currentId = pending.shift() as number;
    categories.filter((item) => item.parentId === currentId).forEach((child) => {
      if (!descendantIds.has(child.id)) {
        descendantIds.add(child.id);
        pending.push(child.id);
      }
    });
  }
  return descendantIds;
}

interface CategoryTreeSelectNode {
  value: number;
  title: string;
  disabled: boolean;
  children: CategoryTreeSelectNode[];
}

function buildCategoryTreeSelectData(categories: ProductCategory[], blockedIds: Set<number>, parentId?: number): CategoryTreeSelectNode[] {
  return categories
    .filter((item) => item.parentId === parentId)
    .sort((left, right) => left.name.localeCompare(right.name, 'vi'))
    .map((item) => ({
      value: item.id,
      title: `${item.code} · ${item.name}`,
      disabled: blockedIds.has(item.id),
      children: buildCategoryTreeSelectData(categories, blockedIds, item.id),
    }));
}

function CategoryFormDrawer({
  open,
  mode,
  category,
  categories,
  loading,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: CatalogFormMode;
  category?: ProductCategory;
  categories: ProductCategory[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => void;
}) {
  const [form] = Form.useForm<CategoryFormValues>();
  const blockedParentIds = category
    ? new Set([category.id, ...getCategoryDescendantIds(categories, category.id)])
    : new Set<number>();
  const parentTreeData = buildCategoryTreeSelectData(categories, blockedParentIds);
  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(category ? {
      code: category.code,
      name: category.name,
      parentId: category.parentId,
      description: category.description,
      isActive: category.isActive,
    } : { code: '', name: '', parentId: undefined, description: '', isActive: true });
  }, [category, form, open]);
  return (
    <Drawer open={open} width="min(560px, 100%)" title={mode === 'create' ? 'Thêm nhóm hàng' : 'Chỉnh sửa nhóm hàng'} destroyOnHidden onClose={onClose} footer={
      <Flex justify="flex-end"><Space><Button onClick={onClose}>Hủy</Button><Button type="primary" htmlType="submit" form="category-form" loading={loading}>Lưu</Button></Space></Flex>
    }>
      <Form id="category-form" form={form} layout="vertical" onFinish={onSubmit}>
        <Row gutter={16}>
          <Col xs={24} sm={10}><Form.Item name="code" label="Mã nhóm" rules={[{ required: true, whitespace: true, message: 'Nhập mã nhóm.' }, { pattern: /^[A-Za-z0-9_-]+$/, transform: (value: string) => value.trim(), message: 'Mã chỉ gồm chữ, số, gạch ngang hoặc gạch dưới.' }]}><Input maxLength={32} /></Form.Item></Col>
          <Col xs={24} sm={14}><Form.Item name="name" label="Tên nhóm" rules={[{ required: true, whitespace: true, message: 'Nhập tên nhóm.' }]}><Input maxLength={160} /></Form.Item></Col>
        </Row>
        <Form.Item name="parentId" label="Nhóm cha"><TreeSelect allowClear showSearch treeDefaultExpandAll treeNodeFilterProp="title" placeholder="Không có nhóm cha (nhóm cấp gốc)" treeData={parentTreeData} /></Form.Item>
        <Form.Item name="description" label="Mô tả"><Input.TextArea rows={4} maxLength={500} showCount placeholder="Mô tả phạm vi sản phẩm thuộc nhóm" /></Form.Item>
        <Form.Item name="isActive" label="Trạng thái" rules={[{ required: true, message: 'Chọn trạng thái.' }]}><Select options={[{ value: true, label: 'Hoạt động' }, { value: false, label: 'Ngừng hoạt động' }]} /></Form.Item>
      </Form>
    </Drawer>
  );
}

const categoryDateTimeFormatter = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });

function CategoryDetailDrawer({ open, category, categories, onClose, onEdit }: {
  open: boolean;
  category?: ProductCategory;
  categories: ProductCategory[];
  onClose: () => void;
  onEdit: (category: ProductCategory) => void;
}) {
  if (!category) return <Drawer open={open} width="min(620px, 100%)" title="Chi tiết nhóm hàng" onClose={onClose} />;
  const parent = categories.find((item) => item.id === category.parentId);
  const directChildren = categories.filter((item) => item.parentId === category.id);
  return <Drawer open={open} width="min(620px, 100%)" title={`Nhóm hàng · ${category.name}`} destroyOnHidden onClose={onClose} extra={<Button icon={<EditOutlined />} onClick={() => onEdit(category)}>Chỉnh sửa</Button>}>
    <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
      <Descriptions.Item label="Mã nhóm"><Typography.Text code>{category.code}</Typography.Text></Descriptions.Item>
      <Descriptions.Item label="Tên nhóm">{category.name}</Descriptions.Item>
      <Descriptions.Item label="Nhóm cha" span={2}>{parent?.name ?? 'Nhóm cấp gốc'}</Descriptions.Item>
      <Descriptions.Item label="Mô tả" span={2}>{category.description ?? '—'}</Descriptions.Item>
      <Descriptions.Item label="Trạng thái" span={2}><Tag color={category.isActive ? 'success' : 'default'}>{category.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}</Tag></Descriptions.Item>
      <Descriptions.Item label="Ngày tạo">{categoryDateTimeFormatter.format(new Date(category.createdAt))}</Descriptions.Item>
      <Descriptions.Item label="Ngày cập nhật">{categoryDateTimeFormatter.format(new Date(category.updatedAt))}</Descriptions.Item>
      <Descriptions.Item label="Nhóm con trực tiếp" span={2}>{directChildren.length ? <Flex gap={6} wrap>{directChildren.map((child) => <Tag key={child.id}>{child.name}</Tag>)}</Flex> : 'Không có'}</Descriptions.Item>
    </Descriptions>
  </Drawer>;
}

export function AdminCategoriesPage() {
  const { message } = App.useApp();
  const [filters, setFilters] = useState(initialCategoryFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [mode, setMode] = useState<CatalogFormMode>('create');
  const [selected, setSelected] = useState<ProductCategory>();
  const [detailCategory, setDetailCategory] = useState<ProductCategory>();
  const [formOpen, setFormOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ProductCategory>();
  const { listQuery, referencesQuery, createCategory, updateCategory, updateCategoryStatus, isSaving, isUpdatingStatus } = useAdminCategories(filters, page, pageSize);
  const rows = listQuery.data?.content ?? [];
  const total = listQuery.data?.totalElements ?? 0;
  const categoryCount = listQuery.data?.categoryCount ?? 0;
  const openCreate = () => { setMode('create'); setSelected(undefined); setFormOpen(true); };
  const columns: TableProps<CategoryView>['columns'] = [
    { title: 'Mã nhóm', dataIndex: 'code', width: 150, render: (value: string) => <Typography.Text className="admin-catalog-page__code">{value}</Typography.Text> },
    { title: 'Tên nhóm', dataIndex: 'name', width: 240, render: (value: string) => <Typography.Text strong>{value}</Typography.Text> },
    { title: 'Nhóm cha', dataIndex: 'parentName', width: 240, render: (value?: string) => value ?? '—' },
    { title: 'Mô tả', dataIndex: 'description', width: 280, ellipsis: true, responsive: ['lg'], render: (value?: string) => value ?? '—' },
    { title: 'Trạng thái', dataIndex: 'isActive', width: 170, render: (value: boolean) => <Tag color={value ? 'success' : 'default'}>{value ? 'Đang hoạt động' : 'Ngừng hoạt động'}</Tag> },
    { title: 'Thao tác', key: 'actions', width: 260, render: (_, record) => <Space size={2}><Button type="text" icon={<EyeOutlined />} onClick={() => setDetailCategory(record)}>Xem</Button><Button type="text" icon={<EditOutlined />} onClick={() => { setMode('edit'); setSelected(record); setFormOpen(true); }}>Sửa</Button><Button type="text" danger={record.isActive} icon={record.isActive ? <PauseCircleOutlined /> : <PlayCircleOutlined />} onClick={() => setPendingStatus(record)}>{record.isActive ? 'Tắt' : 'Bật'}</Button></Space> },
  ];
  const save = async (values: CategoryFormValues) => {
    try {
      if (mode === 'edit' && selected) await updateCategory({ id: selected.id, values });
      else await createCategory(values);
      void message.success(mode === 'edit' ? 'Đã cập nhật nhóm hàng.' : 'Đã thêm nhóm hàng.');
      setFormOpen(false); setSelected(undefined);
    } catch (error) { void message.error(error instanceof Error ? error.message : 'Không thể lưu nhóm hàng.'); }
  };
  const changeStatus = async () => {
    if (!pendingStatus) return;
    try { await updateCategoryStatus({ id: pendingStatus.id, isActive: !pendingStatus.isActive }); void message.success('Đã cập nhật trạng thái nhóm hàng.'); setPendingStatus(undefined); }
    catch (error) { void message.error(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái.'); }
  };
  return (
    <div className="admin-catalog-page">
      <AdminListPage title="Nhóm hàng" description="Quản lý danh mục và phân cấp nhóm sản phẩm" primaryAction={<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm nhóm hàng</Button>} toolbar={
        <SearchToolbar keyword={filters.keyword} status={filters.status} loading={listQuery.isFetching} placeholder="Tìm mã hoặc tên nhóm" onKeywordChange={(keyword) => { setFilters({ ...filters, keyword }); setPage(1); }} onStatusChange={(status) => { setFilters({ ...filters, status }); setPage(1); }} onReset={() => { setFilters(initialCategoryFilters); setPage(1); }} />
      } summary={<Typography.Text strong>{categoryCount} nhóm hàng</Typography.Text>}>
        {listQuery.isLoading ? <LoadingRows /> : null}
        {listQuery.isError ? <ErrorState message="Không thể tải danh sách nhóm hàng mock." onRetry={() => void listQuery.refetch()} /> : null}
        {!listQuery.isLoading && !listQuery.isError ? <Table className="admin-catalog-page__category-table" rowKey="id" columns={columns} dataSource={rows} loading={listQuery.isFetching} scroll={{ x: 1200 }} expandable={{ defaultExpandAllRows: true, indentSize: 24 }} pagination={PaginationConfig({ page, pageSize, total, label: 'nhóm gốc', onChange: (next, size) => { setPage(size !== pageSize ? 1 : next); setPageSize(size); } })} locale={{ emptyText: <EmptyState description="Chưa có nhóm hàng phù hợp." /> }} /> : null}
      </AdminListPage>
      <CategoryFormDrawer open={formOpen} mode={mode} category={selected} categories={referencesQuery.data?.categories ?? []} loading={isSaving} onClose={() => { setFormOpen(false); setSelected(undefined); }} onSubmit={(values) => void save(values)} />
      <CategoryDetailDrawer open={Boolean(detailCategory)} category={detailCategory} categories={referencesQuery.data?.categories ?? []} onClose={() => setDetailCategory(undefined)} onEdit={(category) => { setDetailCategory(undefined); setMode('edit'); setSelected(category); setFormOpen(true); }} />
      <ConfirmModal open={Boolean(pendingStatus)} title={pendingStatus?.isActive ? 'Tắt nhóm hàng?' : 'Bật nhóm hàng?'} content={pendingStatus ? `Xác nhận ${pendingStatus.isActive ? 'tắt' : 'bật'} “${pendingStatus.name}”.` : ''} confirmText="Xác nhận" danger={pendingStatus?.isActive} loading={isUpdatingStatus} onConfirm={() => void changeStatus()} onCancel={() => setPendingStatus(undefined)} />
    </div>
  );
}

function UnitFormDrawer({ open, mode, unit, loading, onClose, onSubmit }: { open: boolean; mode: CatalogFormMode; unit?: Unit; loading: boolean; onClose: () => void; onSubmit: (values: UnitFormValues) => void }) {
  const [form] = Form.useForm<UnitFormValues>();
  useEffect(() => { if (open) form.setFieldsValue(unit ? { code: unit.code, name: unit.name, isActive: unit.isActive } : { code: '', name: '', isActive: true }); }, [form, open, unit]);
  return <Drawer open={open} width="min(500px, 100%)" title={mode === 'create' ? 'Thêm đơn vị tính' : 'Chỉnh sửa đơn vị tính'} destroyOnHidden onClose={onClose} footer={<Flex justify="flex-end"><Space><Button onClick={onClose}>Hủy</Button><Button type="primary" htmlType="submit" form="unit-form" loading={loading}>Lưu</Button></Space></Flex>}>
    <Form id="unit-form" form={form} layout="vertical" onFinish={onSubmit}>
      <Form.Item name="code" label="Mã đơn vị" rules={[{ required: true, whitespace: true, message: 'Nhập mã đơn vị.' }, { pattern: /^[A-Za-z0-9_-]+$/, transform: (value: string) => value.trim(), message: 'Mã chỉ gồm chữ, số, gạch ngang hoặc gạch dưới.' }]}><Input maxLength={24} /></Form.Item>
      <Form.Item name="name" label="Tên đơn vị" rules={[{ required: true, whitespace: true, message: 'Nhập tên đơn vị.' }]}><Input maxLength={100} /></Form.Item>
      <Form.Item name="isActive" label="Trạng thái" rules={[{ required: true, message: 'Chọn trạng thái.' }]}><Select options={[{ value: true, label: 'Đang hoạt động' }, { value: false, label: 'Ngừng hoạt động' }]} /></Form.Item>
    </Form>
  </Drawer>;
}

export function AdminUnitsPage() {
  const { message } = App.useApp();
  const [filters, setFilters] = useState(initialUnitFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [mode, setMode] = useState<CatalogFormMode>('create');
  const [selected, setSelected] = useState<Unit>();
  const [formOpen, setFormOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Unit>();
  const { listQuery, createUnit, updateUnit, updateUnitStatus, isSaving, isUpdatingStatus } = useAdminUnits(filters, page, pageSize);
  const rows = listQuery.data?.content ?? [];
  const total = listQuery.data?.totalElements ?? 0;
  const columns: TableProps<Unit>['columns'] = [
    { title: 'Mã đơn vị', dataIndex: 'code', width: 220, render: (value: string) => <Typography.Text className="admin-catalog-page__code">{value}</Typography.Text> },
    { title: 'Tên đơn vị', dataIndex: 'name' },
    { title: 'Trạng thái', dataIndex: 'isActive', width: 180, render: (value: boolean) => <Tag color={value ? 'success' : 'default'}>{value ? 'Đang hoạt động' : 'Ngừng hoạt động'}</Tag> },
    { title: 'Thao tác', width: 220, render: (_, record) => <Space size={2}><Button type="text" icon={<EditOutlined />} onClick={() => { setMode('edit'); setSelected(record); setFormOpen(true); }}>Sửa</Button><Button type="text" danger={record.isActive} icon={record.isActive ? <PauseCircleOutlined /> : <PlayCircleOutlined />} onClick={() => setPendingStatus(record)}>{record.isActive ? 'Tắt' : 'Bật'}</Button></Space> },
  ];
  const save = async (values: UnitFormValues) => {
    try { if (mode === 'edit' && selected) await updateUnit({ id: selected.id, values }); else await createUnit(values); void message.success(mode === 'edit' ? 'Đã cập nhật đơn vị tính.' : 'Đã thêm đơn vị tính.'); setFormOpen(false); setSelected(undefined); }
    catch (error) { void message.error(error instanceof Error ? error.message : 'Không thể lưu đơn vị tính.'); }
  };
  const changeStatus = async () => {
    if (!pendingStatus) return;
    try {
      await updateUnitStatus({ id: pendingStatus.id, isActive: !pendingStatus.isActive });
      void message.success('Đã cập nhật trạng thái đơn vị tính.');
      setPendingStatus(undefined);
    } catch (error) { void message.error(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái đơn vị tính.'); }
  };
  return <div className="admin-catalog-page"><AdminListPage title="Đơn vị tính" description="Quản lý danh mục đơn vị tính sử dụng cho sản phẩm" primaryAction={<Button type="primary" icon={<PlusOutlined />} onClick={() => { setMode('create'); setSelected(undefined); setFormOpen(true); }}>Thêm đơn vị tính</Button>} toolbar={<SearchToolbar keyword={filters.keyword} status={filters.status} loading={listQuery.isFetching} placeholder="Tìm mã hoặc tên đơn vị" onKeywordChange={(keyword) => { setFilters({ ...filters, keyword }); setPage(1); }} onStatusChange={(status) => { setFilters({ ...filters, status }); setPage(1); }} onReset={() => { setFilters(initialUnitFilters); setPage(1); }} />} summary={<Typography.Text strong>{total} đơn vị tính</Typography.Text>}>
    {listQuery.isLoading ? <LoadingRows /> : null}{listQuery.isError ? <ErrorState message="Không thể tải danh sách đơn vị tính mock." onRetry={() => void listQuery.refetch()} /> : null}
    {!listQuery.isLoading && !listQuery.isError ? <Table rowKey="id" columns={columns} dataSource={rows} loading={listQuery.isFetching} scroll={{ x: 780 }} pagination={PaginationConfig({ page, pageSize, total, label: 'đơn vị', onChange: (next, size) => { setPage(size !== pageSize ? 1 : next); setPageSize(size); } })} locale={{ emptyText: <EmptyState description="Chưa có đơn vị tính phù hợp." /> }} /> : null}
  </AdminListPage><UnitFormDrawer open={formOpen} mode={mode} unit={selected} loading={isSaving} onClose={() => { setFormOpen(false); setSelected(undefined); }} onSubmit={(values) => void save(values)} /><ConfirmModal open={Boolean(pendingStatus)} title={pendingStatus?.isActive ? 'Ngừng sử dụng đơn vị?' : 'Kích hoạt đơn vị?'} content={pendingStatus ? pendingStatus.isActive ? `Đơn vị “${pendingStatus.name}” sẽ không còn được chọn cho sản phẩm hoặc quy đổi mới. Dữ liệu đang tham chiếu vẫn được giữ nguyên.` : `Xác nhận kích hoạt lại đơn vị “${pendingStatus.name}”.` : ''} confirmText={pendingStatus?.isActive ? 'Ngừng sử dụng' : 'Kích hoạt'} danger={pendingStatus?.isActive} loading={isUpdatingStatus} onConfirm={() => void changeStatus()} onCancel={() => setPendingStatus(undefined)} /></div>;
}

function BranchFormDrawer({ open, mode, branch, loading, onClose, onSubmit }: { open: boolean; mode: CatalogFormMode; branch?: Branch; loading: boolean; onClose: () => void; onSubmit: (values: BranchFormValues) => void }) {
  const [form] = Form.useForm<BranchFormValues>();
  useEffect(() => { if (open) form.setFieldsValue(branch ? { code: branch.code, name: branch.name, address: branch.address, phone: branch.phone, isActive: branch.isActive } : { code: '', name: '', address: '', phone: '', isActive: true }); }, [branch, form, open]);
  return <Drawer open={open} width="min(620px, 100%)" title={mode === 'create' ? 'Thêm chi nhánh' : 'Chỉnh sửa chi nhánh'} destroyOnHidden onClose={onClose} footer={<Flex justify="flex-end"><Space><Button onClick={onClose}>Hủy</Button><Button type="primary" htmlType="submit" form="branch-form" loading={loading}>Lưu</Button></Space></Flex>}>
    <Form id="branch-form" form={form} layout="vertical" onFinish={onSubmit}><Row gutter={16}><Col xs={24} sm={10}><Form.Item name="code" label="Mã chi nhánh" rules={[{ required: true, whitespace: true, message: 'Nhập mã chi nhánh.' }, { pattern: /^[A-Za-z0-9_-]+$/, message: 'Mã không hợp lệ.' }]}><Input maxLength={32} /></Form.Item></Col><Col xs={24} sm={14}><Form.Item name="name" label="Tên chi nhánh" rules={[{ required: true, whitespace: true, message: 'Nhập tên chi nhánh.' }]}><Input maxLength={160} /></Form.Item></Col></Row>
      <Form.Item name="address" label="Địa chỉ"><Input.TextArea rows={3} maxLength={300} /></Form.Item><Form.Item name="phone" label="Điện thoại" rules={[{ pattern: /^(?:\+?84|0)[0-9\s.-]{8,14}$/, message: 'Số điện thoại không hợp lệ.' }]}><Input maxLength={18} /></Form.Item><Form.Item name="isActive" label="Trạng thái" rules={[{ required: true, message: 'Chọn trạng thái.' }]}><Select options={[{ value: true, label: 'Hoạt động' }, { value: false, label: 'Ngừng hoạt động' }]} /></Form.Item>
    </Form>
  </Drawer>;
}

export function AdminBranchesPage() {
  const { message } = App.useApp();
  const [filters, setFilters] = useState(initialBranchFilters);
  const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  const [mode, setMode] = useState<CatalogFormMode>('create'); const [selected, setSelected] = useState<Branch>();
  const [selectedId, setSelectedId] = useState<number>(); const [formOpen, setFormOpen] = useState(false); const [detailOpen, setDetailOpen] = useState(false); const [pendingStatus, setPendingStatus] = useState<Branch>();
  const { listQuery, detailQuery, createBranch, updateBranch, updateBranchStatus, isSaving, isUpdatingStatus } = useAdminBranches(filters, page, pageSize, selectedId);
  const rows = listQuery.data?.content ?? []; const total = listQuery.data?.totalElements ?? 0;
  const columns: TableProps<Branch>['columns'] = [
    { title: 'Mã chi nhánh', dataIndex: 'code', width: 160, render: (value: string) => <Typography.Text className="admin-catalog-page__code">{value}</Typography.Text> }, { title: 'Tên chi nhánh', dataIndex: 'name', width: 240 }, { title: 'Địa chỉ', dataIndex: 'address', ellipsis: true }, { title: 'Điện thoại', dataIndex: 'phone', width: 160, render: (value?: string) => value ?? '—' }, { title: 'Trạng thái', dataIndex: 'isActive', width: 150, render: (value: boolean) => <ActiveTag active={value} /> },
    { title: 'Thao tác', width: 255, render: (_, record) => <Space size={2}><Button type="text" icon={<EyeOutlined />} onClick={() => { setSelectedId(record.id); setDetailOpen(true); }}>Xem</Button><Button type="text" icon={<EditOutlined />} onClick={() => { setMode('edit'); setSelected(record); setFormOpen(true); setDetailOpen(false); }}>Sửa</Button><Button type="text" danger={record.isActive} onClick={() => setPendingStatus(record)}>{record.isActive ? 'Tắt' : 'Bật'}</Button></Space> },
  ];
  const save = async (values: BranchFormValues) => { try { if (mode === 'edit' && selected) await updateBranch({ id: selected.id, values }); else await createBranch(values); void message.success(mode === 'edit' ? 'Đã cập nhật chi nhánh.' : 'Đã thêm chi nhánh.'); setFormOpen(false); setSelected(undefined); } catch (error) { void message.error(error instanceof Error ? error.message : 'Không thể lưu chi nhánh.'); } };
  const changeStatus = async () => { if (!pendingStatus) return; try { await updateBranchStatus({ id: pendingStatus.id, isActive: !pendingStatus.isActive }); void message.success('Đã cập nhật trạng thái chi nhánh.'); setPendingStatus(undefined); } catch (error) { void message.error(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái.'); } };
  return <div className="admin-catalog-page"><AdminListPage title="Chi nhánh" description="Quản lý branches và xem các kho trực thuộc từng chi nhánh." primaryAction={<Button type="primary" icon={<PlusOutlined />} onClick={() => { setMode('create'); setSelected(undefined); setFormOpen(true); }}>Thêm chi nhánh</Button>} toolbar={<SearchToolbar keyword={filters.keyword} status={filters.status} loading={listQuery.isFetching} placeholder="Tìm mã, tên, địa chỉ hoặc điện thoại" onKeywordChange={(keyword) => { setFilters({ ...filters, keyword }); setPage(1); }} onStatusChange={(status) => { setFilters({ ...filters, status }); setPage(1); }} onReset={() => { setFilters(initialBranchFilters); setPage(1); }} />} summary={<Typography.Text strong>{total} chi nhánh</Typography.Text>}>
    {listQuery.isLoading ? <LoadingRows /> : null}{listQuery.isError ? <ErrorState message="Không thể tải danh sách chi nhánh mock." onRetry={() => void listQuery.refetch()} /> : null}{!listQuery.isLoading && !listQuery.isError ? <Table rowKey="id" columns={columns} dataSource={rows} loading={listQuery.isFetching} scroll={{ x: 1180 }} pagination={PaginationConfig({ page, pageSize, total, label: 'chi nhánh', onChange: (next, size) => { setPage(size !== pageSize ? 1 : next); setPageSize(size); } })} locale={{ emptyText: <EmptyState description="Chưa có chi nhánh phù hợp." /> }} /> : null}
  </AdminListPage>
    <Drawer open={detailOpen} width="min(720px, 100%)" title="Chi tiết chi nhánh" onClose={() => { setDetailOpen(false); setSelectedId(undefined); }}>{detailQuery.isLoading ? <LoadingRows /> : detailQuery.isError ? <ErrorState message="Không thể tải chi tiết chi nhánh." onRetry={() => void detailQuery.refetch()} /> : detailQuery.data ? <Flex vertical gap={24}><Descriptions bordered column={1} size="small" items={[{ key: 'code', label: 'Mã chi nhánh', children: detailQuery.data.code }, { key: 'name', label: 'Tên chi nhánh', children: detailQuery.data.name }, { key: 'address', label: 'Địa chỉ', children: detailQuery.data.address ?? '—' }, { key: 'phone', label: 'Điện thoại', children: detailQuery.data.phone ?? '—' }, { key: 'status', label: 'Trạng thái', children: <ActiveTag active={detailQuery.data.isActive} /> }]} /><div><Typography.Title level={5}>Kho thuộc chi nhánh</Typography.Title><Table rowKey="id" size="small" pagination={false} dataSource={detailQuery.data.warehouses} columns={[{ title: 'Mã kho', dataIndex: 'code' }, { title: 'Tên kho', dataIndex: 'name' }, { title: 'Kho mặc định', dataIndex: 'isDefault', render: (value: boolean) => value ? <Tag color="blue">Mặc định</Tag> : '—' }, { title: 'Trạng thái', dataIndex: 'isActive', render: (value: boolean) => <ActiveTag active={value} /> }]} scroll={{ x: 620 }} /></div></Flex> : null}</Drawer>
    <BranchFormDrawer open={formOpen} mode={mode} branch={selected} loading={isSaving} onClose={() => { setFormOpen(false); setSelected(undefined); }} onSubmit={(values) => void save(values)} /><ConfirmModal open={Boolean(pendingStatus)} title={pendingStatus?.isActive ? 'Tắt chi nhánh?' : 'Bật chi nhánh?'} content={pendingStatus ? `Xác nhận ${pendingStatus.isActive ? 'tắt' : 'bật'} “${pendingStatus.name}”.` : ''} confirmText="Xác nhận" danger={pendingStatus?.isActive} loading={isUpdatingStatus} onConfirm={() => void changeStatus()} onCancel={() => setPendingStatus(undefined)} />
  </div>;
}

function WarehouseFormDrawer({ open, mode, warehouse, branches, loading, onClose, onSubmit }: { open: boolean; mode: CatalogFormMode; warehouse?: Warehouse; branches: Branch[]; loading: boolean; onClose: () => void; onSubmit: (values: WarehouseFormValues) => void }) {
  const [form] = Form.useForm<WarehouseFormValues>(); const isDefault = Form.useWatch('isDefault', form);
  useEffect(() => { if (open) form.setFieldsValue(warehouse ? { code: warehouse.code, name: warehouse.name, branchId: warehouse.branchId, isDefault: warehouse.isDefault, isActive: warehouse.isActive } : { code: '', name: '', branchId: branches.find((item) => item.isActive)?.id, isDefault: false, isActive: true }); }, [branches, form, open, warehouse]);
  return <Drawer open={open} width="min(600px, 100%)" title={mode === 'create' ? 'Thêm kho' : 'Chỉnh sửa kho'} destroyOnHidden onClose={onClose} footer={<Flex justify="flex-end"><Space><Button onClick={onClose}>Hủy</Button><Button type="primary" htmlType="submit" form="warehouse-form" loading={loading}>Lưu</Button></Space></Flex>}><Form id="warehouse-form" form={form} layout="vertical" onFinish={onSubmit}><Row gutter={16}><Col xs={24} sm={10}><Form.Item name="code" label="Mã kho" rules={[{ required: true, whitespace: true, message: 'Nhập mã kho.' }, { pattern: /^[A-Za-z0-9_-]+$/, message: 'Mã không hợp lệ.' }]}><Input maxLength={32} /></Form.Item></Col><Col xs={24} sm={14}><Form.Item name="name" label="Tên kho" rules={[{ required: true, whitespace: true, message: 'Nhập tên kho.' }]}><Input maxLength={160} /></Form.Item></Col></Row><Form.Item name="branchId" label="Chi nhánh" rules={[{ required: true, message: 'Chọn chi nhánh.' }]}><Select showSearch optionFilterProp="label" options={branches.map((item) => ({ value: item.id, label: `${item.code} · ${item.name}` }))} /></Form.Item><Row gutter={16}><Col xs={24} sm={12}><Form.Item name="isDefault" label="Kho mặc định" rules={[{ required: true, message: 'Chọn thiết lập kho mặc định.' }]}><Select options={[{ value: false, label: 'Không' }, { value: true, label: 'Có' }]} /></Form.Item></Col><Col xs={24} sm={12}><Form.Item name="isActive" label="Trạng thái" rules={[{ required: true, message: 'Chọn trạng thái.' }]}><Select options={[{ value: true, label: 'Hoạt động' }, { value: false, label: 'Ngừng hoạt động' }]} /></Form.Item></Col></Row>{isDefault ? <Alert showIcon type="warning" message="Kho mặc định duy nhất" description="Khi lưu, kho mặc định hiện tại của chi nhánh sẽ tự động được bỏ đánh dấu để đảm bảo mỗi chi nhánh chỉ có một kho mặc định." /> : null}</Form></Drawer>;
}

export function AdminWarehousesPage() {
  const { message } = App.useApp(); const [filters, setFilters] = useState(initialWarehouseFilters); const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10); const [mode, setMode] = useState<CatalogFormMode>('create'); const [selected, setSelected] = useState<Warehouse>(); const [formOpen, setFormOpen] = useState(false); const [pendingStatus, setPendingStatus] = useState<WarehouseView>();
  const { listQuery, referencesQuery, createWarehouse, updateWarehouse, updateWarehouseStatus, isSaving, isUpdatingStatus } = useAdminWarehouses(filters, page, pageSize); const rows = listQuery.data?.content ?? []; const total = listQuery.data?.totalElements ?? 0; const branches = referencesQuery.data?.branches ?? [];
  const columns: TableProps<WarehouseView>['columns'] = [{ title: 'Mã kho', dataIndex: 'code', width: 160, render: (value: string) => <Typography.Text className="admin-catalog-page__code">{value}</Typography.Text> }, { title: 'Tên kho', dataIndex: 'name', width: 260 }, { title: 'Chi nhánh', dataIndex: 'branchName', width: 260 }, { title: 'Kho mặc định', dataIndex: 'isDefault', width: 150, render: (value: boolean) => value ? <Tag color="blue">Mặc định</Tag> : '—' }, { title: 'Trạng thái', dataIndex: 'isActive', width: 150, render: (value: boolean) => <ActiveTag active={value} /> }, { title: 'Thao tác', width: 210, render: (_, record) => <Space size={2}><Button type="text" icon={<EditOutlined />} onClick={() => { setMode('edit'); setSelected(record); setFormOpen(true); }}>Sửa</Button><Button type="text" danger={record.isActive} onClick={() => setPendingStatus(record)}>{record.isActive ? 'Tắt' : 'Bật'}</Button></Space> }];
  const save = async (values: WarehouseFormValues) => { try { if (mode === 'edit' && selected) await updateWarehouse({ id: selected.id, values }); else await createWarehouse(values); void message.success(values.isDefault ? 'Đã lưu kho và cập nhật kho mặc định của chi nhánh.' : mode === 'edit' ? 'Đã cập nhật kho.' : 'Đã thêm kho.'); setFormOpen(false); setSelected(undefined); } catch (error) { void message.error(error instanceof Error ? error.message : 'Không thể lưu kho.'); } };
  const changeStatus = async () => { if (!pendingStatus) return; try { await updateWarehouseStatus({ id: pendingStatus.id, isActive: !pendingStatus.isActive }); void message.success('Đã cập nhật trạng thái kho.'); setPendingStatus(undefined); } catch (error) { void message.error(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái kho.'); } };
  return <div className="admin-catalog-page"><AdminListPage title="Kho" description="Quản lý warehouses theo chi nhánh và đảm bảo duy nhất một kho mặc định." primaryAction={<Button type="primary" icon={<PlusOutlined />} onClick={() => { setMode('create'); setSelected(undefined); setFormOpen(true); }}>Thêm kho</Button>} toolbar={<SearchToolbar keyword={filters.keyword} status={filters.status} loading={listQuery.isFetching} placeholder="Tìm mã, tên kho hoặc chi nhánh" onKeywordChange={(keyword) => { setFilters({ ...filters, keyword }); setPage(1); }} onStatusChange={(status) => { setFilters({ ...filters, status }); setPage(1); }} onReset={() => { setFilters(initialWarehouseFilters); setPage(1); }} extra={<Col xs={24} sm={12} md={6} xl={4}><Select allowClear showSearch optionFilterProp="label" value={filters.branchId} placeholder="Tất cả chi nhánh" style={{ width: '100%' }} options={branches.map((item) => ({ value: item.id, label: item.name }))} onChange={(branchId) => { setFilters({ ...filters, branchId }); setPage(1); }} /></Col>} />} summary={<Typography.Text strong>{total} kho</Typography.Text>}>
    {listQuery.isLoading ? <LoadingRows /> : null}{listQuery.isError ? <ErrorState message="Không thể tải danh sách kho mock." onRetry={() => void listQuery.refetch()} /> : null}{!listQuery.isLoading && !listQuery.isError ? <Table rowKey="id" columns={columns} dataSource={rows} loading={listQuery.isFetching} scroll={{ x: 1140 }} pagination={PaginationConfig({ page, pageSize, total, label: 'kho', onChange: (next, size) => { setPage(size !== pageSize ? 1 : next); setPageSize(size); } })} locale={{ emptyText: <EmptyState description="Chưa có kho phù hợp." /> }} /> : null}
  </AdminListPage><WarehouseFormDrawer open={formOpen} mode={mode} warehouse={selected} branches={branches} loading={isSaving} onClose={() => { setFormOpen(false); setSelected(undefined); }} onSubmit={(values) => void save(values)} /><ConfirmModal open={Boolean(pendingStatus)} title={pendingStatus?.isActive ? 'Tắt kho?' : 'Bật kho?'} content={pendingStatus ? `Xác nhận ${pendingStatus.isActive ? 'tắt' : 'bật'} “${pendingStatus.name}”.` : ''} confirmText="Xác nhận" danger={pendingStatus?.isActive} loading={isUpdatingStatus} onConfirm={() => void changeStatus()} onCancel={() => setPendingStatus(undefined)} /></div>;
}
