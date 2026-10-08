/* Hallmark · macrostructure: Operations ledger · tone: technical · anchor hue: cobalt
 * pre-emit critique: P5 H4 E4 S5 R5 V4
 */
import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Descriptions, Drawer, Input, Row, Select, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useMemo, useState } from 'react';
import { AdminListPage } from '../../components/admin/AdminListPage';
import { auditLogs, type AuditLogRow } from '../../mocks/adminOperations';
import './adminOperations.css';

export function AdminAuditLogPage({ activityOnly = false }: { activityOnly?: boolean }) {
  const [keyword, setKeyword] = useState('');
  const [module, setModule] = useState<AuditLogRow['module']>();
  const [result, setResult] = useState<AuditLogRow['result']>();
  const [selected, setSelected] = useState<AuditLogRow>();
  const filtered = useMemo(() => {
    const normalized = keyword.trim().toLocaleLowerCase('vi');
    return auditLogs.filter((row) => (!module || row.module === module) && (!result || row.result === result)
      && (!activityOnly || row.actor !== 'ai-agent@saleshub.vn')
      && [row.actor, row.action, row.object, row.detail, row.ipAddress].some((value) => value.toLocaleLowerCase('vi').includes(normalized)));
  }, [activityOnly, keyword, module, result]);
  const columns: TableProps<AuditLogRow>['columns'] = [
    { title: 'Thời gian', dataIndex: 'occurredAt', width: 180, render: (value: string) => new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'medium' }).format(new Date(value)) },
    { title: 'Người thực hiện', dataIndex: 'actor', width: 240 },
    { title: 'Hành động', dataIndex: 'action', width: 140, render: (value: string) => <Tag>{value}</Tag> },
    { title: 'Phân hệ', dataIndex: 'module', width: 140 },
    { title: 'Đối tượng', dataIndex: 'object', width: 190 },
    { title: 'IP', dataIndex: 'ipAddress', width: 140 },
    { title: 'Kết quả', dataIndex: 'result', width: 120, render: (value: AuditLogRow['result']) => <Tag color={value === 'SUCCESS' ? 'green' : 'red'}>{value}</Tag> },
    { title: '', width: 80, fixed: 'right', render: (_, row) => <Button type="link" onClick={() => setSelected(row)}>Xem</Button> },
  ];
  return <div className="admin-audit-page">
    <AdminListPage title={activityOnly ? 'Nhật ký hoạt động người dùng' : 'Audit Log'} description="Tra cứu dấu vết thay đổi dữ liệu và kết quả thao tác trong hệ thống." toolbar={<Row gutter={[12, 12]}><Col xs={24} md={12} xl={8}><Input allowClear prefix={<SearchOutlined />} value={keyword} placeholder="Tìm người dùng, hành động hoặc đối tượng" onChange={(event) => setKeyword(event.target.value)} /></Col><Col xs={12} md={6} xl={4}><Select allowClear value={module} placeholder="Phân hệ" options={['CATALOG', 'SALES', 'PURCHASING', 'INVENTORY', 'AI', 'ADMIN'].map((value) => ({ value, label: value }))} onChange={setModule} /></Col><Col xs={12} md={6} xl={4}><Select allowClear value={result} placeholder="Kết quả" options={['SUCCESS', 'FAILED'].map((value) => ({ value, label: value }))} onChange={setResult} /></Col><Col><Button onClick={() => { setKeyword(''); setModule(undefined); setResult(undefined); }}>Đặt lại</Button></Col></Row>} summary={<Typography.Text strong>{filtered.length} sự kiện</Typography.Text>}>
      <Table rowKey="id" dataSource={filtered} columns={columns} scroll={{ x: 1150 }} pagination={{ pageSize: 10 }} />
    </AdminListPage>
    <Drawer open={Boolean(selected)} width="min(600px, 100%)" title="Chi tiết sự kiện" onClose={() => setSelected(undefined)}>{selected ? <Descriptions bordered column={1} size="small" items={Object.entries(selected).filter(([key]) => key !== 'id').map(([key, value]) => ({ key, label: key, children: String(value) }))} /> : null}</Drawer>
  </div>;
}
