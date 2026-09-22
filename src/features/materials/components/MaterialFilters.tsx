import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Select, Tooltip } from 'antd';
import type { AdminMaterialFilters } from '../materials.model';
import {
  initialAdminMaterialFilters,
  materialGroups,
} from '../materials.model';

interface MaterialFiltersProps {
  filters: AdminMaterialFilters;
  loading?: boolean;
  onChange: (filters: AdminMaterialFilters) => void;
  onReset: () => void;
}

export function MaterialFilters({
  filters,
  loading = false,
  onChange,
  onReset,
}: MaterialFiltersProps) {
  const hasActiveFilters =
    filters.group !== initialAdminMaterialFilters.group;

  return (
    <div className="admin-materials__filters">
      <Select
        allowClear
        size="small"
        value={filters.group}
        placeholder="Lọc theo nhóm vật tư"
        aria-label="Lọc theo nhóm vật tư hàng hóa"
        className="admin-materials__group-filter"
        options={materialGroups.map((group) => ({ value: group, label: group }))}
        onChange={(group) => onChange({ ...filters, group })}
      />
      <Tooltip title="Xóa bộ lọc" mouseEnterDelay={0.8}>
        <span>
          <Button
            type="text"
            size="small"
            icon={<CloseCircleOutlined />}
            aria-label="Xóa bộ lọc"
            disabled={!hasActiveFilters || loading}
            onClick={onReset}
          />
        </span>
      </Tooltip>
    </div>
  );
}
