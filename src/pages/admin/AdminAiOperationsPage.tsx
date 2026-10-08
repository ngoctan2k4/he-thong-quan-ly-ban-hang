/* Hallmark · macrostructure: Operations ledger · tone: technical · anchor hue: cobalt
 * pre-emit critique: P5 H4 E4 S5 R5 V4
 */
import { CheckOutlined, CloseOutlined, RobotOutlined, SearchOutlined, SendOutlined } from '@ant-design/icons';
import { App, Button, Col, Descriptions, Drawer, Flex, Input, Row, Select, Space, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useMemo, useState } from 'react';
import { AdminListPage } from '../../components/admin/AdminListPage';
import {
  aiProposals as initialProposals,
  inventorySignals,
  toolCalls,
  type AiProposalRow,
  type InventorySignalRow,
  type ToolCallRow,
} from '../../mocks/adminOperations';
import './adminOperations.css';

export type AiPageVariant = 'chat' | 'signals' | 'proposals' | 'tool-history';

interface AdminAiOperationsPageProps {
  variant: AiPageVariant;
}

type AiRow = InventorySignalRow | AiProposalRow | ToolCallRow;

const dateTime = (value: string) => new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
const proposalTypeLabel: Record<AiProposalRow['type'], string> = { PURCHASE_ORDER: 'Nhập hàng', STOCK_TRANSFER: 'Chuyển kho', CREDIT_APPROVAL: 'Duyệt công nợ' };
const signalTypeLabel: Record<InventorySignalRow['type'], string> = { LOW_STOCK: 'Sắp hết hàng', OVERSTOCK: 'Tồn dư', NO_MOVEMENT: 'Không luân chuyển', DEMAND_SPIKE: 'Nhu cầu tăng' };

function ChatWorkspace() {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Array<{ id: number; role: 'user' | 'assistant'; text: string }>>([
    { id: 1, role: 'assistant', text: 'Tôi có thể hỗ trợ kiểm tra tồn kho, giải thích cảnh báo và chuẩn bị đề xuất nhập hoặc chuyển hàng. Dữ liệu hiện tại là mock FE.' },
  ]);

  const send = (text = draft) => {
    const value = text.trim();
    if (!value) return;
    setMessages((current) => [...current,
      { id: Date.now(), role: 'user', text: value },
      { id: Date.now() + 1, role: 'assistant', text: value.toLocaleLowerCase('vi').includes('tồn')
        ? 'Kho Hà Nội đang có 2 iPhone 16 Pro Max khả dụng, thấp hơn điểm đặt hàng lại là 10. Bạn có thể mở Inventory Signals để xem cảnh báo hoặc Đề xuất AI để xử lý.'
        : 'Tôi đã ghi nhận yêu cầu. Với bản FE hiện tại, kết quả được mô phỏng từ dữ liệu vận hành và chưa gọi backend AI.' },
    ]);
    setDraft('');
  };

  return <div className="admin-ai-chat">
    <Flex vertical gap={12} className="admin-ai-chat__messages">
      {messages.map((item) => <div key={item.id} className={`admin-ai-chat__message admin-ai-chat__message--${item.role}`}>
        <Typography.Text style={{ color: 'inherit' }}>{item.text}</Typography.Text>
      </div>)}
    </Flex>
    <div className="admin-ai-chat__composer">
      <Flex vertical gap={8}>
        <Space wrap>{['Tồn kho iPhone tại Hà Nội?', 'Có đề xuất chuyển kho nào?', 'Đơn nào đang chờ duyệt?'].map((item) => <Button key={item} size="small" onClick={() => send(item)}>{item}</Button>)}</Space>
        <Flex gap={8}><Input value={draft} placeholder="Hỏi AI về tồn kho và vận hành" onChange={(event) => setDraft(event.target.value)} onPressEnter={() => send()} /><Button type="primary" icon={<SendOutlined />} disabled={!draft.trim()} onClick={() => send()}>Gửi</Button></Flex>
      </Flex>
    </div>
  </div>;
}

export function AdminAiOperationsPage({ variant }: AdminAiOperationsPageProps) {
  if (variant === 'chat') {
    return <div className="admin-ai-page"><AdminListPage title="Chat với AI" description="Hỏi đáp và phân tích dữ liệu vận hành trong phạm vi được cấp quyền." toolbar={<Space><RobotOutlined /><Typography.Text type="secondary">AI chỉ đề xuất; thao tác thay đổi dữ liệu luôn cần người dùng xác nhận.</Typography.Text></Space>}><ChatWorkspace /></AdminListPage></div>;
  }
  return <AdminAiDataPage variant={variant} />;
}

function AdminAiDataPage({ variant }: { variant: Exclude<AiPageVariant, 'chat'> }) {
  const { message } = App.useApp();
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<string>();
  const [selected, setSelected] = useState<AiRow>();
  const [proposals, setProposals] = useState(initialProposals);

  const copy = variant === 'signals'
    ? { title: 'Inventory Signals', description: 'Cảnh báo tồn kho cần được theo dõi hoặc xử lý.' }
    : variant === 'proposals'
      ? { title: 'Đề xuất AI', description: 'Rà soát đề xuất trước khi gửi vào hàng đợi phê duyệt.' }
      : { title: 'Lịch sử tool call', description: 'Theo dõi công cụ mà AI đã gọi, thời gian xử lý và kết quả.' };
  const source: AiRow[] = variant === 'signals' ? inventorySignals : variant === 'proposals' ? proposals : toolCalls;
  const filtered = useMemo(() => {
    const normalized = keyword.trim().toLocaleLowerCase('vi');
    return source.filter((row) => Object.values(row).some((value) => String(value).toLocaleLowerCase('vi').includes(normalized)) && (!status || ('status' in row && row.status === status)));
  }, [keyword, source, status]);

  const columns = useMemo<TableProps<AiRow>['columns']>(() => {
    if (variant === 'signals') return [
      { title: 'Mức độ', dataIndex: 'severity', width: 120, render: (value: InventorySignalRow['severity']) => <Tag color={value === 'CRITICAL' ? 'red' : value === 'WARNING' ? 'gold' : 'blue'}>{value}</Tag> },
      { title: 'Loại', dataIndex: 'type', width: 160, render: (value: InventorySignalRow['type']) => signalTypeLabel[value] },
      { title: 'SKU / Sản phẩm', width: 300, render: (_, row) => { const item = row as InventorySignalRow; return <Flex vertical><Typography.Text strong>{item.sku}</Typography.Text><Typography.Text type="secondary">{item.product}</Typography.Text></Flex>; } },
      { title: 'Kho', dataIndex: 'warehouse', width: 220 },
      { title: 'Nhận định', dataIndex: 'summary', width: 360 },
      { title: 'Trạng thái', dataIndex: 'status', width: 150, render: (value: string) => <Tag>{value}</Tag> },
      { title: 'Phát hiện', dataIndex: 'detectedAt', width: 170, render: dateTime },
      { title: '', width: 80, fixed: 'right', render: (_, row) => <Button type="link" onClick={() => setSelected(row)}>Xem</Button> },
    ];
    if (variant === 'proposals') return [
      { title: 'Mã', dataIndex: 'code', width: 170 },
      { title: 'Loại', dataIndex: 'type', width: 150, render: (value: AiProposalRow['type']) => proposalTypeLabel[value] },
      { title: 'Đề xuất', dataIndex: 'title', width: 320 },
      { title: 'Tác động', dataIndex: 'impact', width: 380 },
      { title: 'Trạng thái', dataIndex: 'status', width: 170, render: (value: AiProposalRow['status']) => <Tag color={value === 'APPROVED' ? 'green' : value === 'REJECTED' ? 'red' : value === 'PENDING_APPROVAL' ? 'gold' : 'default'}>{value}</Tag> },
      { title: 'Ngày tạo', dataIndex: 'createdAt', width: 170, render: dateTime },
      { title: '', width: 80, fixed: 'right', render: (_, row) => <Button type="link" onClick={() => setSelected(row)}>Xem</Button> },
    ];
    return [
      { title: 'Thời gian', dataIndex: 'calledAt', width: 180, render: dateTime },
      { title: 'Công cụ', dataIndex: 'tool', width: 230 },
      { title: 'Request ID', dataIndex: 'requestId', width: 160 },
      { title: 'Mục đích', dataIndex: 'purpose', width: 320 },
      { title: 'Thời gian xử lý', dataIndex: 'durationMs', width: 160, align: 'right', render: (value: number) => `${value} ms` },
      { title: 'Kết quả', dataIndex: 'status', width: 120, render: (value: ToolCallRow['status']) => <Tag color={value === 'SUCCESS' ? 'green' : 'red'}>{value}</Tag> },
      { title: '', width: 80, fixed: 'right', render: (_, row) => <Button type="link" onClick={() => setSelected(row)}>Xem</Button> },
    ];
  }, [variant]);

  const updateProposal = (nextStatus: AiProposalRow['status']) => {
    if (!selected || !('code' in selected)) return;
    setProposals((current) => current.map((item) => item.id === selected.id ? { ...item, status: nextStatus } : item));
    setSelected(undefined);
    void message.success(nextStatus === 'PENDING_APPROVAL' ? 'Đã gửi đề xuất vào hàng đợi.' : 'Đã cập nhật đề xuất.');
  };

  return <div className="admin-ai-page">
    <AdminListPage title={copy.title} description={copy.description} toolbar={<Row gutter={[12, 12]}><Col xs={24} md={12} xl={8}><Input allowClear prefix={<SearchOutlined />} value={keyword} placeholder="Tìm trong dữ liệu" onChange={(event) => setKeyword(event.target.value)} /></Col><Col xs={24} sm={12} md={8} xl={5}><Select allowClear value={status} placeholder="Tất cả trạng thái" options={Array.from(new Set(source.filter((row) => 'status' in row).map((row) => ('status' in row ? row.status : '')))).map((value) => ({ value, label: value }))} onChange={setStatus} /></Col><Col><Button onClick={() => { setKeyword(''); setStatus(undefined); }}>Đặt lại</Button></Col></Row>} summary={<Typography.Text strong>{filtered.length} bản ghi</Typography.Text>}>
      <Table<AiRow> rowKey="id" dataSource={filtered} columns={columns} scroll={{ x: 1100 }} pagination={{ pageSize: 10 }} />
    </AdminListPage>
    <Drawer open={Boolean(selected)} width="min(640px, 100%)" title="Chi tiết" onClose={() => setSelected(undefined)} extra={variant === 'proposals' && selected && 'status' in selected && selected.status === 'DRAFT' ? <Space><Button danger icon={<CloseOutlined />} onClick={() => updateProposal('REJECTED')}>Bỏ đề xuất</Button><Button type="primary" icon={<CheckOutlined />} onClick={() => updateProposal('PENDING_APPROVAL')}>Gửi phê duyệt</Button></Space> : null}>
      {selected ? <Descriptions bordered column={1} size="small" items={Object.entries(selected).filter(([key]) => key !== 'id').map(([key, value]) => ({ key, label: key, children: String(value) }))} /> : null}
    </Drawer>
  </div>;
}
