import { EditOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Drawer, Flex, Space, Typography } from 'antd';
import type { AdminMaterialRecord } from '../materials.model';
import { MaterialStatusTag } from './MaterialStatusTag';

interface MaterialDetailDrawerProps {
  open: boolean;
  material?: AdminMaterialRecord;
  onClose: () => void;
  onEdit: (material: AdminMaterialRecord) => void;
}

const numberFormatter = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 });
const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 2,
});
const detailColumns = { xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 } as const;

function displayNumber(value?: number, suffix = '') {
  return value === undefined ? '—' : `${numberFormatter.format(value)}${suffix}`;
}

function displayCurrency(value?: number) {
  return value === undefined ? '—' : currencyFormatter.format(value);
}

function displayBoolean(value: boolean) {
  return value ? 'Có' : 'Không';
}

export function MaterialDetailDrawer({
  open,
  material,
  onClose,
  onEdit,
}: MaterialDetailDrawerProps) {
  return (
    <Drawer
      open={open}
      width="min(680px, 100%)"
      title="Chi tiết vật tư hàng hóa"
      destroyOnHidden
      onClose={onClose}
      footer={
        material ? (
          <Flex justify="flex-end" gap={8}>
            <Button onClick={onClose}>Đóng</Button>
            <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(material)}>
              Sửa
            </Button>
          </Flex>
        ) : null
      }
    >
      {material ? (
        <Flex vertical gap={16}>
          <Flex vertical gap={6}>
            <Space size={10} wrap>
              <Typography.Title level={4} style={{ margin: 0 }}>
                {material.name}
              </Typography.Title>
              <MaterialStatusTag status={material.status} />
            </Space>
            <Typography.Text type="secondary" className="admin-materials__code">
              {material.code}
            </Typography.Text>
          </Flex>

          <div className="admin-material-detail__sections">
            <section className="admin-material-detail__section">
              <Typography.Title level={5}>Thông tin chung</Typography.Title>
              <Descriptions column={detailColumns} bordered size="small">
                <Descriptions.Item label="Mã">{material.code}</Descriptions.Item>
                <Descriptions.Item label="Tên">{material.name}</Descriptions.Item>
                <Descriptions.Item label="Nhóm">{material.group}</Descriptions.Item>
                <Descriptions.Item label="ĐVT chính">{material.unit}</Descriptions.Item>
                <Descriptions.Item label="Loại">{material.type}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <MaterialStatusTag status={material.status} />
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả" span={2}>
                  {material.description || '—'}
                </Descriptions.Item>
              </Descriptions>
            </section>

            <Divider />

            <section className="admin-material-detail__section">
              <Typography.Title level={5}>Bán hàng &amp; Kho</Typography.Title>
              <Descriptions column={detailColumns} bordered size="small">
                <Descriptions.Item label="Cho phép bán">{displayBoolean(material.allowSale)}</Descriptions.Item>
                <Descriptions.Item label="Hiển thị kênh bán">{displayBoolean(material.visibleOnSalesChannel)}</Descriptions.Item>
                <Descriptions.Item label="Kho mặc định">{material.defaultWarehouse || '—'}</Descriptions.Item>
                <Descriptions.Item label="ĐVT ngầm định">{material.defaultUnit || '—'}</Descriptions.Item>
                <Descriptions.Item label="Tồn tối thiểu">{displayNumber(material.minimumStock)}</Descriptions.Item>
                <Descriptions.Item label="Nguồn cấp">
                  {material.supplySource === 'PURCHASE'
                    ? 'Đi mua'
                    : material.supplySource === 'IN_HOUSE'
                      ? 'Tự sản xuất'
                      : material.supplySource === 'BOTH'
                        ? 'Đi mua và tự sản xuất'
                        : '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Quét IMEI/Serial">{displayBoolean(material.requireImeiOnOutbound)}</Descriptions.Item>
                <Descriptions.Item label="In tem chế biến">{displayBoolean(material.allowProcessingLabel)}</Descriptions.Item>
                <Descriptions.Item label="Công thức số lượng" span={2}>{material.quantityFormula || '—'}</Descriptions.Item>
              </Descriptions>
            </section>

            <Divider />

            <section className="admin-material-detail__section">
              <Typography.Title level={5}>Giá &amp; thuế</Typography.Title>
              <Descriptions column={detailColumns} bordered size="small">
                <Descriptions.Item label="Giá mua cố định">{displayCurrency(material.fixedPurchasePrice)}</Descriptions.Item>
                <Descriptions.Item label="Giá mua gần nhất">{displayCurrency(material.latestPurchasePrice)}</Descriptions.Item>
                <Descriptions.Item label="Giá bán">{displayCurrency(material.sellingPrice)}</Descriptions.Item>
                <Descriptions.Item label="Giá nội bộ">{displayCurrency(material.internalPrice)}</Descriptions.Item>
                <Descriptions.Item label="Giá tối thiểu">{displayCurrency(material.minimumSellingPrice)}</Descriptions.Item>
                <Descriptions.Item label="Giá sau thuế">{displayBoolean(material.salePriceIncludesTax)}</Descriptions.Item>
                <Descriptions.Item label="Thuế GTGT">{displayNumber(material.vatRate, '%')}</Descriptions.Item>
                <Descriptions.Item label="Thuế nhập khẩu">{displayNumber(material.importTaxRate, '%')}</Descriptions.Item>
                <Descriptions.Item label="Thuế xuất khẩu">{displayNumber(material.exportTaxRate, '%')}</Descriptions.Item>
                <Descriptions.Item label="Nhóm chịu thuế TTĐB">{material.specialConsumptionTaxGroup || '—'}</Descriptions.Item>
              </Descriptions>
            </section>

            <Divider />

            <section className="admin-material-detail__section">
              <Typography.Title level={5}>Hạch toán</Typography.Title>
              <Descriptions column={detailColumns} bordered size="small">
                <Descriptions.Item label="TK kho">{material.inventoryAccount || '—'}</Descriptions.Item>
                <Descriptions.Item label="TK doanh thu">{material.revenueAccount || '—'}</Descriptions.Item>
                <Descriptions.Item label="TK chiết khấu">{material.discountAccount || '—'}</Descriptions.Item>
                <Descriptions.Item label="TK giảm giá">{material.priceReductionAccount || '—'}</Descriptions.Item>
                <Descriptions.Item label="TK trả lại">{material.salesReturnAccount || '—'}</Descriptions.Item>
                <Descriptions.Item label="TK chi phí">{material.expenseAccount || '—'}</Descriptions.Item>
                <Descriptions.Item label="CK mua hàng">{displayNumber(material.purchaseDiscountRate, '%')}</Descriptions.Item>
              </Descriptions>
            </section>

            <Divider />

            <section className="admin-material-detail__section">
              <Typography.Title level={5}>Nhận diện &amp; kích thước</Typography.Title>
              <Descriptions column={detailColumns} bordered size="small">
                <Descriptions.Item label="Mã tham chiếu">{material.referenceCode || '—'}</Descriptions.Item>
                <Descriptions.Item label="Mã vạch">{material.barcode || '—'}</Descriptions.Item>
                <Descriptions.Item label="Dài">{displayNumber(material.lengthCm, ' cm')}</Descriptions.Item>
                <Descriptions.Item label="Rộng">{displayNumber(material.widthCm, ' cm')}</Descriptions.Item>
                <Descriptions.Item label="Cao">{displayNumber(material.heightCm, ' cm')}</Descriptions.Item>
                <Descriptions.Item label="Trọng lượng">{displayNumber(material.weightKg, ' kg')}</Descriptions.Item>
                <Descriptions.Item label="Nguồn gốc">{material.origin || '—'}</Descriptions.Item>
                <Descriptions.Item label="Số công bố">{material.declarationNumber || '—'}</Descriptions.Item>
              </Descriptions>
            </section>
          </div>
        </Flex>
      ) : null}
    </Drawer>
  );
}
