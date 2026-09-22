import {
  ImportOutlined,
  LeftOutlined,
  PlusOutlined,
  ReloadOutlined,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Flex, Input, Space, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';

interface MaterialToolbarProps {
  keyword: string;
  rangeStart: number;
  rangeEnd: number;
  total: number;
  page: number;
  totalPages: number;
  loading?: boolean;
  onKeywordChange: (keyword: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onCreate: () => void;
  onImport: () => void;
  onRefresh: () => void;
}

export function MaterialToolbar({
  keyword,
  rangeStart,
  rangeEnd,
  total,
  page,
  totalPages,
  loading = false,
  onKeywordChange,
  onPrevious,
  onNext,
  onCreate,
  onImport,
  onRefresh,
}: MaterialToolbarProps) {
  const [searchValue, setSearchValue] = useState(keyword);

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchValue !== keyword) {
        onKeywordChange(searchValue);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [keyword, onKeywordChange, searchValue]);

  return (
    <Flex justify="space-between" align="center" gap={12} wrap className="admin-materials__toolbar">
      <Input
        allowClear
        value={searchValue}
        prefix={<SearchOutlined />}
        placeholder="Tìm mã hoặc tên…"
        aria-label="Tìm theo mã hoặc tên vật tư"
        className="admin-materials__global-search"
        onChange={(event) => setSearchValue(event.target.value)}
      />

      <Space size={8} wrap className="admin-materials__toolbar-actions">
        <Typography.Text type="secondary" className="admin-materials__range">
          {total === 0 ? '0 / 0' : `${rangeStart}-${rangeEnd} / ${total}`}
        </Typography.Text>

        <Space.Compact>
          <Tooltip title="Trang trước" mouseEnterDelay={0.8}>
            <Button
              icon={<LeftOutlined />}
              aria-label="Trang trước"
              disabled={page <= 1 || loading}
              onClick={onPrevious}
            />
          </Tooltip>
          <Tooltip title="Trang sau" mouseEnterDelay={0.8}>
            <Button
              icon={<RightOutlined />}
              aria-label="Trang sau"
              disabled={page >= totalPages || loading || totalPages === 0}
              onClick={onNext}
            />
          </Tooltip>
        </Space.Compact>

        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          Tạo mới
        </Button>
        <Button icon={<ImportOutlined />} onClick={onImport}>
          Nhập khẩu
        </Button>
        <Button icon={<ReloadOutlined />} loading={loading} onClick={onRefresh}>
          Làm mới
        </Button>
      </Space>
    </Flex>
  );
}
