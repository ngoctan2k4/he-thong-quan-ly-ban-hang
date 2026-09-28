import { ArrowLeftOutlined } from '@ant-design/icons';
import { App, Button, Flex, Skeleton } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorState } from '../../components/common/ErrorState';
import { PageHeader } from '../../components/common/PageHeader';
import { GoodsReceiptForm } from '../../features/purchasing/components/GoodsReceiptForm';
import { useGoodsReceiptForm } from '../../features/purchasing/hooks/useAdminPurchasing';
import type { GoodsReceiptFormValues } from '../../features/purchasing/purchasing.model';
import '../../features/purchasing/purchasing.css';

export function AdminGoodsReceiptFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { message, modal } = App.useApp();
  const parsedPurchaseOrderId = Number(searchParams.get('purchaseOrderId'));
  const initialPurchaseOrderId = Number.isFinite(parsedPurchaseOrderId) && parsedPurchaseOrderId > 0
    ? parsedPurchaseOrderId
    : undefined;
  const { referencesQuery, createGoodsReceipt, isSaving } = useGoodsReceiptForm();

  const leavePage = () => navigate('/admin/purchase/goods-receipts');
  const requestLeave = () => {
    modal.confirm({
      title: 'Rời biểu mẫu?',
      content: 'Các thay đổi chưa lưu trên phiếu nhận sẽ bị mất.',
      okText: 'Rời trang',
      cancelText: 'Tiếp tục nhập',
      okButtonProps: { danger: true },
      onOk: leavePage,
    });
  };

  const handleSubmit = async (values: GoodsReceiptFormValues) => {
    try {
      await createGoodsReceipt(values);
      void message.success('Đã tạo phiếu nhận nháp.');
      leavePage();
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể tạo phiếu nhận.');
    }
  };

  return (
    <div className="purchasing-page purchasing-form-page">
      <Flex vertical gap={12}>
        <PageHeader
          title="Tạo phiếu nhận hàng"
          description="Hỗ trợ nhận theo PO hoặc nhập trực tiếp không có PO; không tự cập nhật tồn kho V6."
          extra={<Button icon={<ArrowLeftOutlined />} onClick={requestLeave}>Quay lại</Button>}
        />
        {referencesQuery.isLoading ? <Skeleton active paragraph={{ rows: 12 }} /> : null}
        {referencesQuery.isError ? (
          <ErrorState
            message="Không thể tải dữ liệu biểu mẫu nhận hàng."
            onRetry={() => void referencesQuery.refetch()}
          />
        ) : null}
        {referencesQuery.data ? (
          <GoodsReceiptForm
            references={referencesQuery.data}
            initialPurchaseOrderId={initialPurchaseOrderId}
            submitting={isSaving}
            onSubmit={(values) => void handleSubmit(values)}
            onCancel={requestLeave}
          />
        ) : null}
      </Flex>
    </div>
  );
}
