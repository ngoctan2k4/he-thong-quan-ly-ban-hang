import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import type { Role } from '../../../types/auth';
import type { Branch } from '../../../types/catalog';
import type { AdminUserFilters } from '../systemUsers.model';
import { initialAdminUserFilters } from '../systemUsers.model';

interface UserFiltersProps {
  filters: AdminUserFilters;
  roles: Role[];
  branches: Branch[];
  loading?: boolean;
  onChange: (filters: AdminUserFilters) => void;
  onReset: () => void;
}

export function UserFilters({ filters, roles, branches, loading = false, onChange, onReset }: UserFiltersProps) {
  const [keyword, setKeyword] = useState(filters.keyword);
  useEffect(() => setKeyword(filters.keyword), [filters.keyword]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (keyword !== filters.keyword) onChange({ ...filters, keyword });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [filters, keyword, onChange]);
  const hasFilters = filters.keyword !== initialAdminUserFilters.keyword
    || filters.branchId !== initialAdminUserFilters.branchId
    || filters.roleId !== initialAdminUserFilters.roleId
    || filters.status !== initialAdminUserFilters.status;
  return <Row gutter={[12, 12]} align="middle">
    <Col xs={24} md={12} xl={8}><Input allowClear value={keyword} prefix={<SearchOutlined />} placeholder="Tìm username, họ tên, email hoặc số điện thoại" aria-label="Tìm người dùng" onChange={(event) => setKeyword(event.target.value)} /></Col>
    <Col xs={24} sm={12} md={6} xl={4}><Select allowClear showSearch optionFilterProp="label" value={filters.branchId} placeholder="Tất cả chi nhánh" style={{ width: '100%' }} options={branches.map((branch) => ({ value: branch.id, label: branch.name }))} onChange={(branchId) => onChange({ ...filters, branchId })} /></Col>
    <Col xs={24} sm={12} md={6} xl={4}><Select allowClear showSearch optionFilterProp="label" value={filters.roleId} placeholder="Tất cả vai trò" style={{ width: '100%' }} options={roles.map((role) => ({ value: role.id, label: role.name }))} onChange={(roleId) => onChange({ ...filters, roleId })} /></Col>
    <Col xs={24} sm={12} md={6} xl={4}><Select value={filters.status} style={{ width: '100%' }} options={[{ value: 'ALL', label: 'Tất cả trạng thái' }, { value: 'ACTIVE', label: 'Hoạt động' }, { value: 'INACTIVE', label: 'Ngừng hoạt động' }]} onChange={(status) => onChange({ ...filters, status })} /></Col>
    <Col xs={24} sm={12} md={6} xl={4}><Button block icon={<ReloadOutlined />} disabled={!hasFilters || loading} onClick={onReset}>Đặt lại bộ lọc</Button></Col>
  </Row>;
}
