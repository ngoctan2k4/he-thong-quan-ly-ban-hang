import { Alert, Card, Col, Flex, Row, Statistic, Table, Tag, Typography } from 'antd';
import { PageHeader } from '../../components/common/PageHeader';
import { useCommerce } from '../../features/commerce/CommerceContext';
import { aiProposals, inventorySignals, stockBalances } from '../../mocks/adminOperations';

export function AdminDashboardPage() {
  const { orders } = useCommerce();
  const revenue = orders.filter((order) => order.status !== 'CANCELLED').reduce((sum, order) => sum + order.totalAmount, 0);
  const lowStock = stockBalances.filter((item) => item.available <= item.reorderPoint);
  const pendingAi = aiProposals.filter((item) => item.status === 'PENDING_APPROVAL');

  return (
    <>
      <PageHeader title="Dashboard vận hành" />
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} xl={6}><Card><Statistic title="Doanh thu đơn hiện có" value={revenue} suffix="₫" /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card><Statistic title="Đơn hàng" value={orders.length} /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card><Statistic title="Mặt hàng dưới ngưỡng" value={lowStock.length} /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card><Statistic title="Đề xuất AI chờ duyệt" value={pendingAi.length} /></Card></Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} xl={15}>
          <Card title="Tồn kho cần chú ý">
            <Table rowKey="id" size="small" pagination={false} dataSource={lowStock} columns={[
              { title: 'SKU', dataIndex: 'sku', width: 140 },
              { title: 'Sản phẩm', dataIndex: 'product' },
              { title: 'Kho', dataIndex: 'warehouse', responsive: ['md'] },
              { title: 'Khả dụng', dataIndex: 'available', width: 100, align: 'right', render: (value: number) => <Typography.Text type="danger" strong>{value}</Typography.Text> },
              { title: 'Điểm đặt lại', dataIndex: 'reorderPoint', width: 120, align: 'right' },
            ]} scroll={{ x: 720 }} />
          </Card>
        </Col>
        <Col xs={24} xl={9}>
          <Card title="Inventory Signals">
            <Flex vertical gap={12}>
              {inventorySignals.map((signal) => <Alert key={signal.id} type={signal.severity === 'CRITICAL' ? 'error' : signal.severity === 'WARNING' ? 'warning' : 'info'} showIcon message={<Flex justify="space-between" gap={8}><span>{signal.product}</span><Tag>{signal.status}</Tag></Flex>} description={signal.summary} />)}
            </Flex>
          </Card>
        </Col>
      </Row>
    </>
  );
}
