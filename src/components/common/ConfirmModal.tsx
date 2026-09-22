import { Modal } from 'antd';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  content,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  loading = false,
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      okText={confirmText}
      cancelText={cancelText}
      confirmLoading={loading}
      okButtonProps={{ danger }}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      {content}
    </Modal>
  );
}
