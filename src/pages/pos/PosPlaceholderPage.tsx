import { Card, Typography } from 'antd';
import { PageHeader } from '../../components/common/PageHeader';

interface PosPlaceholderPageProps {
  title: string;
}

export function PosPlaceholderPage({ title }: PosPlaceholderPageProps) {
  return (
    <>
      <PageHeader title={title} description="Khung giao diện 7.2 POS." />
      <Card style={{ marginTop: 24 }}>
        <Typography.Text type="secondary">
          Placeholder POS. Phần tìm kiếm barcode, giỏ hàng tại quầy và thanh toán sẽ triển khai sau.
        </Typography.Text>
      </Card>
    </>
  );
}
