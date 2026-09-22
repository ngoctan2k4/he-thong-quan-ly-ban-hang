import { PageHeader } from '../../components/common/PageHeader';

interface AdminPlaceholderPageProps {
  title: string;
}

export function AdminPlaceholderPage({ title }: AdminPlaceholderPageProps) {
  return <PageHeader title={title} />;
}
