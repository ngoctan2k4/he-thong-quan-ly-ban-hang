import { ArrowLeftOutlined } from '@ant-design/icons';
import { App, Button, Flex, Skeleton } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorState } from '../../components/common/ErrorState';
import { PageHeader } from '../../components/common/PageHeader';
import { PurchaseOrderForm } from '../../features/purchasing/components/PurchaseOrderForm';
import { usePurchaseOrderForm } from '../../features/purchasing/hooks/useAdminPurchasing';
import type { PurchaseOrderFormValues } from '../../features/purchasing/purchasing.model';
import '../../features/purchasing/purchasing.css';

interface AdminPurchaseOrderFormPageProps {
  retailOnly?: boolean;
}

export function AdminPurchaseOrderFormPage({ retailOnly = false }: AdminPurchaseOrderFormPageProps) {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const { message, modal } = App.useApp();
  const parsedId = params.id ? Number(params.id) : undefined;
  const orderId = parsedId && Number.isFinite(parsedId) ? parsedId : undefined;
  const { detailQuery, referencesQuery, createPurchaseOrder, updatePurchaseOrder, isSaving } =
    usePurchaseOrderForm(orderId);
  const isEdit = orderId !== undefined;

  const listPath = retailOnly ? '/admin/purchase/retail-orders' : '/admin/purchase/orders';
  const leavePage = () => navigate(listPath);
  const requestLeave = () => {
    modal.confirm({
      title: 'Rời biểu mẫu?',
      content: 'Các thay đổi chưa lưu trên đơn mua sẽ bị mất.',
      okText: 'Rời trang',
      cancelText: 'Tiếp tục nhập',
      okButtonProps: { danger: true },
      onOk: leavePage,
    });
  };

  const handleSubmit = async (values: PurchaseOrderFormValues) => {
    try {
      if (isEdit && orderId) {
        await updatePurchaseOrder({ id: orderId, values });
        void message.success('Đã cập nhật đơn mua.');
      } else {
        await createPurchaseOrder(values);
        void message.success(retailOnly ? 'Đã tạo đơn mua lẻ nháp.' : 'Đã tạo đơn mua nháp.');
      }
      leavePage();
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể lưu đơn mua.');
    }
  };

  const loading = referencesQuery.isLoading || (isEdit && detailQuery.isLoading);
  const error = referencesQuery.isError || (isEdit && detailQuery.isError);

  return (
    <div className="purchasing-page purchasing-form-page">
      <Flex vertical gap={12}>
        <PageHeader
          title={isEdit
            ? (retailOnly ? 'Sửa đơn mua hàng lẻ' : 'Sửa đơn mua')
            : (retailOnly ? 'Tạo đơn mua hàng lẻ' : 'Tạo đơn mua')}
          description={retailOnly
            ? 'Đơn mua lẻ được tạo thủ công và không làm tăng tồn kho trước khi nhận hàng.'
            : 'Đơn tạo thủ công luôn có nguồn MANUAL và không làm tăng tồn kho.'}
          extra={<Button icon={<ArrowLeftOutlined />} onClick={requestLeave}>Quay lại</Button>}
        />
        {loading ? <Skeleton active paragraph={{ rows: 12 }} /> : null}
        {error ? (
          <ErrorState
            message="Không thể tải dữ liệu biểu mẫu đơn mua."
            onRetry={() => {
              void referencesQuery.refetch();
              if (isEdit) void detailQuery.refetch();
            }}
          />
        ) : null}
        {!loading && !error && referencesQuery.data ? (
          <PurchaseOrderForm
            order={detailQuery.data}
            retailOnly={retailOnly}
            references={referencesQuery.data}
            submitting={isSaving}
            onSubmit={(values) => void handleSubmit(values)}
            onCancel={requestLeave}
          />
        ) : null}
      </Flex>
    </div>
  );
}
