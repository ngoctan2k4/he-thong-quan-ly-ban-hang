export type AccountingVariant =
  | 'purchase-goods'
  | 'purchase-services'
  | 'purchase-returns'
  | 'sales-vouchers'
  | 'sales-invoices'
  | 'ecommerce-vouchers';

export type AccountingStatus = 'DRAFT' | 'PENDING' | 'POSTED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED';

export interface AccountingEntry {
  id: number;
  variant: AccountingVariant;
  code: string;
  documentDate: string;
  partner: string;
  partnerTaxCode: string;
  reference: string;
  description: string;
  subtotal: number;
  vatAmount: number;
  total: number;
  paymentStatus: PaymentStatus;
  status: AccountingStatus;
  channel?: string;
}

export const accountingEntries: AccountingEntry[] = [
  { id: 1, variant: 'purchase-goods', code: 'MH-2609-0042', documentDate: '2026-09-28', partner: 'Công ty TNHH Thiết bị Sao Việt', partnerTaxCode: '0314567890', reference: 'PO-00042 / PNK-260928-002', description: 'Nhập điện thoại và phụ kiện theo đơn mua', subtotal: 238_000_000, vatAmount: 23_800_000, total: 261_800_000, paymentStatus: 'PARTIAL', status: 'POSTED' },
  { id: 2, variant: 'purchase-goods', code: 'MH-2609-0041', documentDate: '2026-09-27', partner: 'Công ty CP Điện máy Đông Á', partnerTaxCode: '0109234567', reference: 'PO-00041 / PNK-260927-005', description: 'Nhập hàng điện máy kho Hà Nội', subtotal: 124_500_000, vatAmount: 12_450_000, total: 136_950_000, paymentStatus: 'UNPAID', status: 'PENDING' },
  { id: 3, variant: 'purchase-goods', code: 'MH-2609-0040', documentDate: '2026-09-25', partner: 'Công ty TNHH Công nghệ Nam Phương', partnerTaxCode: '0401987654', reference: 'PO-00039 / PNK-260925-003', description: 'Nhập máy tính xách tay', subtotal: 89_000_000, vatAmount: 8_900_000, total: 97_900_000, paymentStatus: 'PAID', status: 'POSTED' },

  { id: 11, variant: 'purchase-services', code: 'DV-2609-0018', documentDate: '2026-09-28', partner: 'Công ty CP Vận tải Minh Long', partnerTaxCode: '0318842210', reference: 'HĐ 000184', description: 'Cước vận chuyển liên kho tháng 09', subtotal: 18_600_000, vatAmount: 1_488_000, total: 20_088_000, paymentStatus: 'UNPAID', status: 'PENDING' },
  { id: 12, variant: 'purchase-services', code: 'DV-2609-0017', documentDate: '2026-09-26', partner: 'Công ty TNHH Cloud Việt', partnerTaxCode: '0107788123', reference: 'INV-CLD-0926', description: 'Hạ tầng máy chủ tháng 09', subtotal: 32_000_000, vatAmount: 3_200_000, total: 35_200_000, paymentStatus: 'PAID', status: 'POSTED' },
  { id: 13, variant: 'purchase-services', code: 'DV-2609-0016', documentDate: '2026-09-24', partner: 'Công ty TNHH Quảng cáo Đa Kênh', partnerTaxCode: '0317629011', reference: 'BBNT-0924', description: 'Dịch vụ quảng cáo theo biên bản nghiệm thu', subtotal: 45_000_000, vatAmount: 4_500_000, total: 49_500_000, paymentStatus: 'PARTIAL', status: 'DRAFT' },

  { id: 21, variant: 'purchase-returns', code: 'TL-2609-0007', documentDate: '2026-09-28', partner: 'Công ty TNHH Thiết bị Sao Việt', partnerTaxCode: '0314567890', reference: 'MH-2609-0042', description: 'Trả 2 thiết bị lỗi ngoại quan', subtotal: 24_000_000, vatAmount: 2_400_000, total: 26_400_000, paymentStatus: 'REFUNDED', status: 'POSTED' },
  { id: 22, variant: 'purchase-returns', code: 'TL-2609-0006', documentDate: '2026-09-26', partner: 'Công ty CP Điện máy Đông Á', partnerTaxCode: '0109234567', reference: 'MH-2609-0038', description: 'Trả hàng giao sai model', subtotal: 15_500_000, vatAmount: 1_550_000, total: 17_050_000, paymentStatus: 'UNPAID', status: 'PENDING' },
  { id: 23, variant: 'purchase-returns', code: 'TL-2609-0005', documentDate: '2026-09-23', partner: 'Công ty TNHH Công nghệ Nam Phương', partnerTaxCode: '0401987654', reference: 'MH-2609-0034', description: 'Trả phụ kiện thiếu chứng nhận xuất xứ', subtotal: 8_200_000, vatAmount: 820_000, total: 9_020_000, paymentStatus: 'REFUNDED', status: 'POSTED' },

  { id: 31, variant: 'sales-vouchers', code: 'BH-2609-0104', documentDate: '2026-09-28', partner: 'Công ty CP Thương mại Thành Công', partnerTaxCode: '0311098276', reference: 'SO-01004 / PXK-260928-004', description: 'Bán hàng theo đơn doanh nghiệp', subtotal: 76_800_000, vatAmount: 7_680_000, total: 84_480_000, paymentStatus: 'PARTIAL', status: 'POSTED' },
  { id: 32, variant: 'sales-vouchers', code: 'BH-2609-0103', documentDate: '2026-09-27', partner: 'Cửa hàng Điện tử An Nhiên', partnerTaxCode: '0317284102', reference: 'SO-00987 / PXK-260927-011', description: 'Xuất bán lô phụ kiện', subtotal: 28_500_000, vatAmount: 2_850_000, total: 31_350_000, paymentStatus: 'UNPAID', status: 'PENDING' },
  { id: 33, variant: 'sales-vouchers', code: 'BH-2609-0102', documentDate: '2026-09-26', partner: 'Công ty TNHH Nội thất Gia Phát', partnerTaxCode: '0106811290', reference: 'SO-00965 / PXK-260926-008', description: 'Bán thiết bị văn phòng', subtotal: 112_000_000, vatAmount: 11_200_000, total: 123_200_000, paymentStatus: 'PAID', status: 'POSTED' },

  { id: 41, variant: 'sales-invoices', code: 'HĐ-2609-0188', documentDate: '2026-09-28', partner: 'Công ty CP Thương mại Thành Công', partnerTaxCode: '0311098276', reference: 'BH-2609-0104', description: 'Hóa đơn GTGT bán hàng doanh nghiệp', subtotal: 76_800_000, vatAmount: 7_680_000, total: 84_480_000, paymentStatus: 'PARTIAL', status: 'POSTED' },
  { id: 42, variant: 'sales-invoices', code: 'HĐ-2609-0187', documentDate: '2026-09-27', partner: 'Cửa hàng Điện tử An Nhiên', partnerTaxCode: '0317284102', reference: 'BH-2609-0103', description: 'Hóa đơn GTGT bán phụ kiện', subtotal: 28_500_000, vatAmount: 2_850_000, total: 31_350_000, paymentStatus: 'UNPAID', status: 'PENDING' },
  { id: 43, variant: 'sales-invoices', code: 'HĐ-2609-0186', documentDate: '2026-09-26', partner: 'Công ty TNHH Nội thất Gia Phát', partnerTaxCode: '0106811290', reference: 'BH-2609-0102', description: 'Hóa đơn GTGT thiết bị văn phòng', subtotal: 112_000_000, vatAmount: 11_200_000, total: 123_200_000, paymentStatus: 'PAID', status: 'POSTED' },

  { id: 51, variant: 'ecommerce-vouchers', code: 'EC-2609-0321', documentDate: '2026-09-28', partner: 'Khách lẻ sàn Shopee', partnerTaxCode: '—', reference: 'SPE-240928-8821', description: 'Đối soát hàng hóa và phí sàn', subtotal: 18_490_000, vatAmount: 1_849_000, total: 20_339_000, paymentStatus: 'PARTIAL', status: 'PENDING', channel: 'Shopee' },
  { id: 52, variant: 'ecommerce-vouchers', code: 'EC-2609-0320', documentDate: '2026-09-28', partner: 'Khách lẻ TikTok Shop', partnerTaxCode: '—', reference: 'TTS-928-15022', description: 'Đối soát đơn hoàn tất trong ngày', subtotal: 12_760_000, vatAmount: 1_276_000, total: 14_036_000, paymentStatus: 'PAID', status: 'POSTED', channel: 'TikTok Shop' },
  { id: 53, variant: 'ecommerce-vouchers', code: 'EC-2609-0319', documentDate: '2026-09-27', partner: 'Khách lẻ Website', partnerTaxCode: '—', reference: 'WEB-00998', description: 'Tổng hợp đơn Website đã giao', subtotal: 9_850_000, vatAmount: 985_000, total: 10_835_000, paymentStatus: 'PAID', status: 'DRAFT', channel: 'Website' },
];
