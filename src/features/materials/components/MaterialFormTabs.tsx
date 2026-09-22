import {
  PictureOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
  Upload,
} from 'antd';
import type { FormInstance } from 'antd';
import type { MaterialFormValues } from '../materials.model';
import { materialGroups, materialTypes, materialUnits } from '../materials.model';

const industryOptions = [
  'Thực phẩm & Đồ uống',
  'Thời trang',
  'Gia dụng',
  'Điện tử',
  'Sản xuất',
  'Khác',
].map((value) => ({ value, label: value }));

const categoryOptions = [
  'Nguyên liệu sản xuất',
  'Hàng bán lẻ',
  'Bao bì đóng gói',
  'Công cụ vận hành',
  'Thành phẩm',
].map((value) => ({ value, label: value }));

const qrRuleOptions = [
  { value: 'ITEM', label: 'Mã hàng' },
  { value: 'ITEM_BATCH', label: 'Mã hàng + Số lô' },
  { value: 'ITEM_SERIAL', label: 'Mã hàng + Serial' },
  { value: 'BARCODE', label: 'Barcode' },
  { value: 'AUTO', label: 'Tự động' },
];

interface MaterialFormSectionsProps {
  form: FormInstance<MaterialFormValues>;
  materialId?: string;
  autoFocusCode?: boolean;
  checkCodeTaken: (code: string, excludeId?: string) => Promise<boolean>;
}

const nonNegativeRule = (label: string) => ({
  type: 'number' as const,
  min: 0,
  message: `${label} không được nhỏ hơn 0.`,
});

const percentageRule = (label: string) => ({
  type: 'number' as const,
  min: 0,
  max: 100,
  message: `${label} phải nằm trong khoảng 0–100.`,
});

export function MaterialFormSections({
  form,
  materialId,
  autoFocusCode = false,
  checkCodeTaken,
}: MaterialFormSectionsProps) {
  const imageUrl = Form.useWatch('imageUrl', form);

  return (
    <div className="admin-material-form__sections">
      <section className="admin-material-form__section" aria-labelledby="material-general-heading">
        <Form.Item name="sku" hidden>
          <Input />
        </Form.Item>
        <Typography.Title id="material-general-heading" level={5} className="admin-material-form__section-title">
          Thông tin chung
        </Typography.Title>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="code"
              label="Mã"
              validateFirst
              rules={[
                { required: true, whitespace: true, message: 'Nhập mã.' },
                {
                  validator: async (_, value: string | undefined) => {
                    if (!value?.trim()) {
                      return;
                    }
                    if (await checkCodeTaken(value, materialId)) {
                      throw new Error('Mã đã tồn tại.');
                    }
                  },
                },
              ]}
            >
              <Input
                autoFocus={autoFocusCode}
                maxLength={24}
                placeholder="Ví dụ: NVL0001"
                className="admin-materials__code-input"
              />
            </Form.Item>

            <Form.Item
              name="name"
              label="Tên"
              rules={[{ required: true, whitespace: true, message: 'Nhập tên.' }]}
            >
              <Input maxLength={160} placeholder="Tên vật tư hàng hóa" />
            </Form.Item>

            <Form.Item name="nature" label="Tính chất">
              <Select options={[{ value: 'MATERIAL_GOODS', label: 'Vật tư hàng hóa' }]} />
            </Form.Item>

            <Form.Item
              name="unit"
              label="ĐVT chính"
              rules={[{ required: true, message: 'Chọn đơn vị tính cơ bản.' }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                options={materialUnits.map((unit) => ({ value: unit, label: unit }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <div className="admin-material-create__image-block">
              <Typography.Text strong>Hình ảnh</Typography.Text>
              <div className="admin-material-create__image-preview">
                {imageUrl ? (
                  <Image src={imageUrl} alt="Ảnh vật tư" preview={false} />
                ) : (
                  <Flex vertical align="center" gap={8}>
                    <PictureOutlined />
                  </Flex>
                )}
              </div>
              <Upload
                accept="image/*"
                maxCount={1}
                showUploadList={false}
                beforeUpload={(file) => {
                  const reader = new FileReader();
                  reader.addEventListener('load', () => {
                    if (typeof reader.result === 'string') {
                      form.setFieldValue('imageUrl', reader.result);
                    }
                  });
                  reader.readAsDataURL(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
              </Upload>
            </div>

            <Form.Item
              name="group"
              label="Nhóm vật tư hàng hóa"
              rules={[{ required: true, message: 'Chọn nhóm vật tư hàng hóa.' }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                options={materialGroups.map((group) => ({ value: group, label: group }))}
              />
            </Form.Item>

            <Form.Item name="type" label="Loại">
              <Select options={materialTypes.map((type) => ({ value: type, label: type }))} />
            </Form.Item>

            <Form.Item
              name="imageUrl"
              label="Link ảnh"
              rules={[{ type: 'url', warningOnly: true, message: 'Link ảnh chưa đúng định dạng URL.' }]}
            >
              <Input placeholder="https://example.com/material.jpg" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="industry" label="Ngành hàng">
              <Select allowClear showSearch optionFilterProp="label" options={industryOptions} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="category" label="Nhóm hàng">
              <Select allowClear showSearch optionFilterProp="label" options={categoryOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="origin" label="Nguồn gốc">
              <Input maxLength={100} placeholder="Ví dụ: Việt Nam" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="brand" label="Nhãn hiệu">
              <Input maxLength={100} placeholder="Tên nhãn hiệu" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea
            rows={2}
            maxLength={500}
            placeholder="Ghi chú nhận diện hoặc phạm vi sử dụng vật tư"
          />
        </Form.Item>
      </section>

      <Divider className="admin-material-form__divider" />

      <section className="admin-material-form__section" aria-labelledby="material-sales-heading">
        <Typography.Title id="material-sales-heading" level={5} className="admin-material-form__section-title">
          Bán hàng &amp; Kho
        </Typography.Title>
          <div className="admin-material-form__check-grid">
            <Form.Item name="allowSale" valuePropName="checked">
              <Checkbox>Cho phép bán</Checkbox>
            </Form.Item>
            <Form.Item name="visibleOnSalesChannel" valuePropName="checked">
              <Checkbox>Hiển thị sản phẩm trên kênh bán hàng</Checkbox>
            </Form.Item>
            <Form.Item name="requireImeiOnOutbound" valuePropName="checked">
              <Checkbox>Yêu cầu quét IMEI/Serial khi xuất kho</Checkbox>
            </Form.Item>
          </div>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="minimumStock"
                label="Tồn tối thiểu"
                rules={[nonNegativeRule('Số lượng tồn tối thiểu')]}
              >
                <InputNumber min={0} precision={2} placeholder="Ví dụ: 20" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="quantityFormula" label="Công thức tính số lượng">
                <Input maxLength={160} placeholder="Ví dụ: Số thùng × 24" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="supplySource" label="Nguồn cấp vật tư">
            <Select
              options={[
                { value: 'PURCHASE', label: 'Đi mua' },
                { value: 'IN_HOUSE', label: 'Tự sản xuất' },
                { value: 'BOTH', label: 'Đi mua và tự sản xuất' },
              ]}
            />
          </Form.Item>

          <Form.Item name="purchaseNote" label="Diễn giải khi mua">
            <Input.TextArea rows={2} maxLength={500} placeholder="Ví dụ: Hàng nhập theo thùng 24 lon." />
          </Form.Item>

          <Form.Item name="salesNote" label="Diễn giải khi bán">
            <Input.TextArea rows={2} maxLength={500} placeholder="Ví dụ: Bán lẻ theo lon hoặc theo lốc." />
          </Form.Item>
      </section>

      <Divider className="admin-material-form__divider" />

      <section className="admin-material-form__section" aria-labelledby="material-accounting-heading">
        <Typography.Title id="material-accounting-heading" level={5} className="admin-material-form__section-title">
          Kho &amp; hạch toán
        </Typography.Title>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="defaultWarehouse"
              label="Kho mặc định"
              rules={[{ required: true, whitespace: true, message: 'Nhập kho mặc định.' }]}
            >
              <Input maxLength={48} placeholder="Ví dụ: KHO_HCM" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="defaultUnit" label="ĐVT ngầm định">
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                options={materialUnits.map((unit) => ({ value: unit, label: unit }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="inventoryAccount" label="TK kho">
              <Input maxLength={32} placeholder="Ví dụ: 1561" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="revenueAccount" label="TK doanh thu">
              <Input maxLength={32} placeholder="Ví dụ: 5111" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="discountAccount" label="TK chiết khấu">
              <Input maxLength={32} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="priceReductionAccount" label="TK giảm giá">
              <Input maxLength={32} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="salesReturnAccount" label="TK trả lại">
              <Input maxLength={32} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="expenseAccount" label="TK chi phí">
              <Input maxLength={32} placeholder="Ví dụ: 632" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} align="bottom">
          <Col xs={24} md={12}>
            <Form.Item
              name="purchaseDiscountRate"
              label="Tỷ lệ CK mua hàng"
              rules={[percentageRule('Tỷ lệ chiết khấu mua hàng')]}
            >
              <InputNumber min={0} max={100} precision={2} addonAfter="%" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="allowProcessingLabel" valuePropName="checked" className="admin-material-form__inline-check">
              <Checkbox>Cho phép in tem chế biến</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </section>

      <Divider className="admin-material-form__divider" />

      <section className="admin-material-form__section" aria-labelledby="material-pricing-heading">
        <Typography.Title id="material-pricing-heading" level={5} className="admin-material-form__section-title">
          Giá &amp; thuế
        </Typography.Title>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="fixedPurchasePrice" label="Đơn giá mua cố định" rules={[nonNegativeRule('Đơn giá mua cố định')]}> 
              <InputNumber min={0} precision={2} addonAfter="₫" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="latestPurchasePrice" label="Đơn giá mua gần nhất" rules={[nonNegativeRule('Đơn giá mua gần nhất')]}> 
              <InputNumber min={0} precision={2} addonAfter="₫" readOnly style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="sellingPrice" label="Đơn giá bán" rules={[nonNegativeRule('Đơn giá bán')]}> 
              <InputNumber min={0} precision={2} addonAfter="₫" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="internalPrice" label="Giá nội bộ" rules={[nonNegativeRule('Giá nội bộ')]}> 
              <InputNumber min={0} precision={2} addonAfter="₫" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="minimumSellingPrice" label="Giá tối thiểu" rules={[nonNegativeRule('Giá tối thiểu')]}> 
              <InputNumber min={0} precision={2} addonAfter="₫" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="vatRate" label="Thuế GTGT" rules={[percentageRule('Thuế GTGT')]}> 
              <InputNumber min={0} max={100} precision={2} addonAfter="%" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="importTaxRate" label="Thuế nhập khẩu" rules={[percentageRule('Thuế nhập khẩu')]}> 
              <InputNumber min={0} max={100} precision={2} addonAfter="%" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="exportTaxRate" label="Thuế xuất khẩu" rules={[percentageRule('Thuế xuất khẩu')]}> 
              <InputNumber min={0} max={100} precision={2} addonAfter="%" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} align="bottom">
          <Col xs={24} md={12}>
            <Form.Item name="specialConsumptionTaxGroup" label="Nhóm HHDV chịu thuế TTĐB">
              <Input maxLength={100} placeholder="Nhập nhóm nếu áp dụng" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="salePriceIncludesTax" valuePropName="checked" className="admin-material-form__inline-check">
              <Checkbox>Giá bán là đơn giá sau thuế</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </section>

      <Divider className="admin-material-form__divider" />

      <section className="admin-material-form__section" aria-labelledby="material-dimensions-heading">
        <Typography.Title id="material-dimensions-heading" level={5} className="admin-material-form__section-title">
          Kích thước
        </Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="lengthCm" label="Chiều dài (cm)" rules={[nonNegativeRule('Chiều dài')]}>
                <InputNumber min={0} precision={2} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="widthCm" label="Chiều rộng (cm)" rules={[nonNegativeRule('Chiều rộng')]}>
                <InputNumber min={0} precision={2} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="heightCm" label="Chiều cao (cm)" rules={[nonNegativeRule('Chiều cao')]}>
                <InputNumber min={0} precision={2} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="weightKg" label="Trọng lượng (kg)" rules={[nonNegativeRule('Trọng lượng')]}> 
                <InputNumber min={0} precision={3} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="grossWeight" label="Trọng lượng gross" rules={[nonNegativeRule('Trọng lượng gross')]}> 
                <InputNumber min={0} precision={3} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="netWeight" label="Trọng lượng net" rules={[nonNegativeRule('Trọng lượng net')]}> 
                <InputNumber min={0} precision={3} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
      </section>

      <Divider className="admin-material-form__divider" />

      <section className="admin-material-form__section" aria-labelledby="material-identity-heading">
        <Typography.Title id="material-identity-heading" level={5} className="admin-material-form__section-title">
          Nhận diện
        </Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="referenceCode" label="Mã tham chiếu">
                <Input maxLength={48} placeholder="Ví dụ: REF-0001" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="barcode" label="Mã vạch">
                <Input maxLength={48} placeholder="Ví dụ: 8938505974190" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="qrRule" label="Quy tắc tạo mã QR">
                <Select options={qrRuleOptions} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="declarationNumber" label="Số công bố">
                <Input maxLength={100} placeholder="Ví dụ: 01/2026/ATTP-XNCB" />
              </Form.Item>
            </Col>
          </Row>

      </section>

      <Divider className="admin-material-form__divider" />

      <section className="admin-material-form__section" aria-labelledby="material-additional-heading">
        <Typography.Title id="material-additional-heading" level={5} className="admin-material-form__section-title">
          Thông tin bổ sung
        </Typography.Title>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="status" label="Trạng thái">
              <Select
                options={[
                  { value: 'ACTIVE', label: 'Đang sử dụng' },
                  { value: 'INACTIVE', label: 'Ngừng sử dụng' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Thời hạn bảo hành">
              <Space.Compact block>
                <Form.Item
                  noStyle
                  name="warrantyDuration"
                  rules={[nonNegativeRule('Thời hạn bảo hành')]}
                >
                  <InputNumber
                    min={0}
                    precision={0}
                    placeholder="Ví dụ: 12"
                    aria-label="Thời hạn bảo hành"
                    style={{ width: '65%' }}
                  />
                </Form.Item>
                <Form.Item noStyle name="warrantyUnit">
                  <Select
                    aria-label="Đơn vị bảo hành"
                    style={{ width: '35%' }}
                    options={[
                      { value: 'DAY', label: 'Ngày' },
                      { value: 'MONTH', label: 'Tháng' },
                      { value: 'YEAR', label: 'Năm' },
                    ]}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>
      </section>
    </div>
  );
}
