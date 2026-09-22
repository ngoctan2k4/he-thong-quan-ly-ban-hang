import { Card, Typography } from 'antd';
import { PageHeader } from '../../components/common/PageHeader';

interface CustomerPlaceholderPageProps {
  title: string;
  description: string;
}

export function CustomerPlaceholderPage({ title, description }: CustomerPlaceholderPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <Card style={{ marginTop: 24 }}>
        <Typography.Text type="secondary">
          Placeholder cho 7.1. Chưa triển khai nghiệp vụ chi tiết trong Frontend Foundation.
        </Typography.Text>
      </Card>
    </>
  );
}
