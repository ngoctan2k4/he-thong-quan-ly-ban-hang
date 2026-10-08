/* Hallmark · macrostructure: Operations ledger · tone: utilitarian · anchor hue: cobalt
 * pre-emit critique: P5 H4 E4 S5 R5 V4
 */
import { CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { App, Button, Col, Descriptions, Drawer, Flex, Input, Row, Select, Space, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useMemo, useState } from 'react';
import { AdminListPage } from '../../components/admin/AdminListPage';
import { approvals as initialApprovals, type ApprovalRow } from '../../mocks/adminOperations';
import './adminOperations.css';

export type ApprovalTypeFilter = ApprovalRow['type'] | 'ALL';

export function AdminApprovalsPage({ type = 'ALL' }: { type?: ApprovalTypeFilter }) {
  const { message } = App.useApp();
  const [rows, setRows] = useState(initialApprovals);
  const [keyword, setKeyword] = useState('');
  const [risk, setRisk] = useState<ApprovalRow['risk']>();
  const [selected, setSelected] = useState<ApprovalRow>();

  const filtered = useMemo(() => {
    const normalized = keyword.trim().toLocaleLowerCase('vi');
    return rows.filter((row) => (type === 'ALL' || row.type === type)
      && (!risk || row.risk === risk)
      && [row.code, row.title, row.requester, row.branch].some((value) => value.toLocaleLowerCase('vi').includes(normalized)));
  }, [keyword, risk, rows, type]);

  const pendingCount = filtered.filter((row) => row.status === 'PENDING').length;
  const columns: TableProps<ApprovalRow>['columns'] = [
    { title: 'Mã', dataIndex: 'code', width: 180 },
    { title: 'Loại', dataIndex: 'type', width: 150, render: (value: ApprovalRow['type']) => <Tag>{value}</Tag> },
    { title: 'Yêu cầu', dataIndex: 'title', width: 300 },
    { title: 'Người gửi', dataIndex: 'requester', width: 180 },
    { title: 'Chi nhánh', dataIndex: 'branch', width: 140 },
    { title: 'Giá trị', dataIndex: 'amount', width: 160, align: 'right', render: (value?: number) => value === undefined ? '—' : `${value.toLocaleString('vi-VN')} ₫` },
    { title: 'Rủi ro', dataIndex: 'risk', width: 110, render: (value: ApprovalRow['risk']) => <Tag color={value === 'HIGH' ? 'red' : value === 'MEDIUM' ? 'gold' : 'green'}>{value}</Tag> },
    { title: 'Trạng thái', dataIndex: 'status', width: 130, render: (value: ApprovalRow['status']) => <Tag color={value === 'APPROVED' ? 'green' : value === 'REJECTED' ? 'red' : 'gold'}>{value}</Tag> },
    { title: 'Ngày gửi', dataIndex: 'requestedAt', width: 170, render: (value: string) => new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) },
    { title: '', width: 80, fixed: 'right', render: (_, row) => <Button type="link" onClick={() => setSelected(row)}>Xử lý</Button> },
  ];

  const decide = (status: 'APPROVED' | 'REJECTED') => {
    if (!selected) return;
    setRows((current) => current.map((row) => row.id === selected.id ? { ...row, status } : row));
    setSelected(undefined);
    void message.success(status === 'APPROVED' ? 'Đã phê duyệt yêu cầu.' : 'Đã từ chối yêu cầu.');
  };

  return <div className="admin-approvals-page">
    <AdminListPage
      title={type === 'ALL' ? 'Hàng đợi phê duyệt' : `Phê duyệt · ${type}`}
      description="Một hàng đợi thống nhất cho đơn Wholesale, mua hàng, tồn kho, xuất hủy và đề xuất AI."
      toolbar={<Row gutter={[12, 12]}><Col xs={24} md={12} xl={8}><Input allowClear prefix={<SearchOutlined />} value={keyword} placeholder="Tìm mã, nội dung hoặc người gửi" onChange={(event) => setKeyword(event.target.value)} /></Col><Col xs={24} sm={12} md={8} xl={5}><Select allowClear value={risk} placeholder="Tất cả mức rủi ro" options={['LOW', 'MEDIUM', 'HIGH'].map((value) => ({ value, label: value }))} onChange={setRisk} /></Col><Col><Button onClick={() => { setKeyword(''); setRisk(undefined); }}>Đặt lại</Button></Col></Row>}
      summary={<Flex gap={16} wrap><Typography.Text strong>{filtered.length} yêu cầu</Typography.Text><Typography.Text type="warning">{pendingCount} chờ xử lý</Typography.Text></Flex>}
    >
      <Table rowKey="id" dataSource={filtered} columns={columns} scroll={{ x: 1200 }} pagination={{ pageSize: 10 }} />
    </AdminListPage>
    <Drawer open={Boolean(selected)} width="min(620px, 100%)" title={selected ? `Xử lý ${selected.code}` : 'Xử lý yêu cầu'} onClose={() => setSelected(undefined)} extra={selected?.status === 'PENDING' ? <Space><Button danger icon={<CloseOutlined />} onClick={() => decide('REJECTED')}>Từ chối</Button><Button type="primary" icon={<CheckOutlined />} onClick={() => decide('APPROVED')}>Phê duyệt</Button></Space> : null}>
      {selected ? <Descriptions bordered column={1} size="small" items={[
        { key: 'type', label: 'Loại', children: selected.type },
        { key: 'title', label: 'Nội dung', children: selected.title },
        { key: 'requester', label: 'Người gửi', children: selected.requester },
        { key: 'branch', label: 'Chi nhánh', children: selected.branch },
        { key: 'amount', label: 'Giá trị', children: selected.amount ? `${selected.amount.toLocaleString('vi-VN')} ₫` : '—' },
        { key: 'risk', label: 'Rủi ro', children: selected.risk },
        { key: 'status', label: 'Trạng thái', children: selected.status },
      ]} /> : null}
    </Drawer>
  </div>;
}
