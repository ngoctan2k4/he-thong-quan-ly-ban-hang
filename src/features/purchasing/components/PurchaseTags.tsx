import { Tag } from 'antd';
import type {
  GoodsReceiptDiscrepancyType,
  GoodsReceiptStatus,
  PurchaseOrderStatus,
  PurchaseSourceType,
} from '../../../types/purchase';
import {
  discrepancyConfig,
  goodsReceiptStatusConfig,
  purchaseOrderStatusConfig,
  purchaseSourceConfig,
} from '../purchasing.utils';

export function PurchaseOrderStatusTag({ status }: { status: PurchaseOrderStatus }) {
  const config = purchaseOrderStatusConfig[status];
  return <Tag color={config.color}>{config.label}</Tag>;
}

export function GoodsReceiptStatusTag({ status }: { status: GoodsReceiptStatus }) {
  const config = goodsReceiptStatusConfig[status];
  return <Tag color={config.color}>{config.label}</Tag>;
}

export function PurchaseSourceTag({ source }: { source: PurchaseSourceType }) {
  const config = purchaseSourceConfig[source];
  return <Tag color={config.color}>{config.label}</Tag>;
}

export function DiscrepancyTag({ type }: { type: GoodsReceiptDiscrepancyType }) {
  const config = discrepancyConfig[type];
  return <Tag color={config.color}>{config.label}</Tag>;
}
