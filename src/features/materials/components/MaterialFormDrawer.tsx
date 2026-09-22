import { Button, Drawer, Flex, Form, Space, theme } from 'antd';
import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import type {
  AdminMaterialRecord,
  MaterialFormMode,
  MaterialFormValues,
} from '../materials.model';
import { initialMaterialFormValues } from '../materials.model';
import { MaterialFormSections } from './MaterialFormTabs';

interface MaterialFormDrawerProps {
  open: boolean;
  mode: MaterialFormMode;
  material?: AdminMaterialRecord;
  loading?: boolean;
  checkCodeTaken: (code: string, excludeId?: string) => Promise<boolean>;
  onClose: () => void;
  onSubmit: (values: MaterialFormValues) => Promise<void>;
}

export function MaterialFormDrawer({
  open,
  mode,
  material,
  loading = false,
  checkCodeTaken,
  onClose,
  onSubmit,
}: MaterialFormDrawerProps) {
  const [form] = Form.useForm<MaterialFormValues>();
  const { token } = theme.useToken();

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === 'edit' && material) {
      form.setFieldsValue({ ...initialMaterialFormValues, ...material });
      return;
    }

    form.setFieldsValue(initialMaterialFormValues);
  }, [form, material, mode, open]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      open={open}
      width="min(960px, 100%)"
      title={mode === 'create' ? 'Tạo vật tư hàng hóa' : 'Chỉnh sửa vật tư hàng hóa'}
      className="admin-material-form-drawer"
      rootStyle={
        {
          '--materials-color-border': token.colorBorderSecondary,
          '--materials-color-fill': token.colorFillQuaternary,
          '--materials-color-text-secondary': token.colorTextSecondary,
          '--materials-color-primary': token.colorPrimary,
          '--materials-color-primary-bg': token.colorPrimaryBg,
        } as CSSProperties
      }
      destroyOnHidden
      onClose={handleClose}
      footer={
        <Flex justify="flex-end">
          <Space>
            <Button disabled={loading} onClick={handleClose}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              form="admin-material-form"
              loading={loading}
            >
              Lưu
            </Button>
          </Space>
        </Flex>
      }
    >
      <Form<MaterialFormValues>
        id="admin-material-form"
        form={form}
        layout="vertical"
        requiredMark
        onFinish={onSubmit}
      >
        <MaterialFormSections
          form={form}
          materialId={material?.id}
          checkCodeTaken={checkCodeTaken}
        />
      </Form>
    </Drawer>
  );
}
