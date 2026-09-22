import { Flex, Typography } from 'antd';
import type { ReactNode } from 'react';

interface AdminListPageProps {
  title: string;
  description?: string;
  primaryAction?: ReactNode;
  toolbar: ReactNode;
  summary?: ReactNode;
  children: ReactNode;
}

export function AdminListPage({
  title,
  description,
  primaryAction,
  toolbar,
  summary,
  children,
}: AdminListPageProps) {
  return (
    <Flex vertical gap={12} className="admin-list-page">
      <header className="admin-page-heading">
        <div className="admin-page-heading__copy">
          <Typography.Title level={3}>{title}</Typography.Title>
          {description ? (
            <Typography.Text className="admin-page-heading__description">
              {description}
            </Typography.Text>
          ) : null}
        </div>
        {primaryAction}
      </header>

      <section className="admin-list-workspace">
        <div className="admin-list-workspace__toolbar">
          {toolbar}
        </div>

        {summary ? (
          <div className="admin-list-workspace__summary">
            {summary}
          </div>
        ) : null}

        {children}
      </section>
    </Flex>
  );
}
