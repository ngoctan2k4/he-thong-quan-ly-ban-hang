import {
  CheckOutlined,
  EyeOutlined,
  PlusOutlined,
  PrinterOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  App,
  Button,
  Card,
  Flex,
  Form,
  Space,
  theme,
} from 'antd';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialFormSections } from '../../features/materials/components/MaterialFormTabs';
import { useAdminMaterialsMock } from '../../features/materials/hooks/useAdminMaterialsMock';
import type { MaterialFormValues } from '../../features/materials/materials.model';
import {
  initialAdminMaterialFilters,
  initialMaterialFormValues,
} from '../../features/materials/materials.model';
import '../../features/materials/materials.css';

export function AdminMaterialCreatePage() {
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const { token } = theme.useToken();
  const [form] = Form.useForm<MaterialFormValues>();
  const [tracking, setTracking] = useState(false);

  const { createMaterial, checkCodeTaken, isSavingMaterial } = useAdminMaterialsMock({
    filters: initialAdminMaterialFilters,
    page: 1,
    pageSize: 20,
  });

  const leaveCreatePage = () => navigate('/admin/materials');

  const handleCancel = () => {
    if (!form.isFieldsTouched()) {
      leaveCreatePage();
      return;
    }

    modal.confirm({
      title: 'Hủy thông tin đang nhập?',
      content: 'Các thay đổi chưa lưu trên biểu mẫu sẽ bị mất.',
      okText: 'Hủy thay đổi',
      cancelText: 'Tiếp tục nhập',
      okButtonProps: { danger: true },
      onOk: leaveCreatePage,
    });
  };

  const handleSave = async (createAnother = false) => {
    try {
      const values = {
        ...initialMaterialFormValues,
        ...(await form.validateFields()),
      };
      await createMaterial(values);
      void message.success('Đã tạo vật tư hàng hóa.');

      if (createAnother) {
        form.resetFields();
        setTracking(false);
        return;
      }

      leaveCreatePage();
    } catch (error) {
      if (typeof error === 'object' && error && 'errorFields' in error) {
        return;
      }
      void message.error(
        error instanceof Error ? error.message : 'Không thể lưu vật tư. Vui lòng thử lại.',
      );
    }
  };

  return (
    <div
      className="admin-materials-page admin-material-create-page"
      style={
        {
          '--materials-color-border': token.colorBorderSecondary,
          '--materials-color-fill': token.colorFillQuaternary,
          '--materials-color-text-secondary': token.colorTextSecondary,
          '--materials-color-primary': token.colorPrimary,
          '--materials-color-primary-bg': token.colorPrimaryBg,
        } as CSSProperties
      }
    >
      <Flex vertical gap={12}>
        <Flex justify="flex-end" className="admin-material-create__actionbar">
          <Space size={8} wrap className="admin-material-create__primary-actions">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={isSavingMaterial}
              onClick={() => void handleSave()}
            >
              Lưu
            </Button>
            <Button
              icon={<PlusOutlined />}
              disabled={isSavingMaterial}
              onClick={() => void handleSave(true)}
            >
              Lưu và Tạo mới
            </Button>
            <Button disabled={isSavingMaterial} onClick={handleCancel}>
              Hủy bỏ
            </Button>
          </Space>
        </Flex>

        <Flex
          justify="space-between"
          align="center"
          gap={12}
          wrap
          className="admin-material-create__commandbar"
        >
          <Space size={8} wrap>
            <Button
              type={tracking ? 'primary' : 'default'}
              icon={tracking ? <CheckOutlined /> : <EyeOutlined />}
              onClick={() => setTracking((current) => !current)}
            >
              {tracking ? 'Đang theo dõi' : 'Theo dõi'}
            </Button>
          </Space>
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
            In
          </Button>
        </Flex>

        <Card className="admin-material-create__card" styles={{ body: { padding: 0 } }}>
          <Form<MaterialFormValues>
            id="admin-material-create-form"
            form={form}
            layout="vertical"
            requiredMark
            initialValues={initialMaterialFormValues}
            className="admin-material-create__form-shell"
          >
            <div className="admin-material-create__scroll-region">
              <MaterialFormSections
                form={form}
                autoFocusCode
                checkCodeTaken={checkCodeTaken}
              />
            </div>
            <Flex justify="flex-end" gap={8} className="admin-material-form__footer">
              <Button disabled={isSavingMaterial} onClick={handleCancel}>
                Hủy
              </Button>
              <Button
                type="primary"
                loading={isSavingMaterial}
                onClick={() => void handleSave()}
              >
                Lưu
              </Button>
            </Flex>
          </Form>
        </Card>
      </Flex>
    </div>
  );
}
