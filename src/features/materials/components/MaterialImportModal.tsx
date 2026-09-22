import { FileExcelOutlined, InboxOutlined } from '@ant-design/icons';
import { Alert, Modal, Typography, Upload } from 'antd';
import type { UploadFile } from 'antd';
import { useState } from 'react';

interface MaterialImportModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (file: UploadFile) => void;
}

export function MaterialImportModal({ open, onClose, onConfirm }: MaterialImportModalProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const closeModal = () => {
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Nhập khẩu vật tư hàng hóa"
      width={560}
      okText="Xác nhận tệp"
      cancelText="Hủy"
      okButtonProps={{ disabled: fileList.length === 0 }}
      onCancel={closeModal}
      onOk={() => {
        const file = fileList[0];
        if (file) {
          onConfirm(file);
          closeModal();
        }
      }}
    >
      <div className="admin-materials__import-body">
        <Upload.Dragger
          accept=".xlsx,.xls,.csv"
          maxCount={1}
          fileList={fileList}
          beforeUpload={() => false}
          onChange={({ fileList: nextFileList }) => setFileList(nextFileList)}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Kéo thả tệp vào đây hoặc bấm để chọn</p>
          <p className="ant-upload-hint">Hỗ trợ .xlsx, .xls và .csv · tối đa một tệp</p>
        </Upload.Dragger>

        <Alert
          showIcon
          type="info"
          icon={<FileExcelOutlined />}
          message="Bản frontend thử nghiệm"
          description={
            <Typography.Text type="secondary">
              Tệp được giữ cục bộ để hoàn thiện luồng giao diện. Việc đọc dữ liệu và ghi nhận hàng loạt sẽ kết nối backend sau.
            </Typography.Text>
          }
        />
      </div>
    </Modal>
  );
}
