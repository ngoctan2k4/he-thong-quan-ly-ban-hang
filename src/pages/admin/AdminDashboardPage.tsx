import { Card, Col, Row, Statistic } from 'antd';
import { PageHeader } from '../../components/common/PageHeader';

export function AdminDashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} xl={6}><Card><Statistic title="Doanh thu" value={0} suffix="₫" /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card><Statistic title="Đơn hàng" value={0} /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card><Statistic title="Cảnh báo tồn kho" value={0} /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card><Statistic title="AI chờ duyệt" value={0} /></Card></Col>
      </Row>
    </>
  );
}
