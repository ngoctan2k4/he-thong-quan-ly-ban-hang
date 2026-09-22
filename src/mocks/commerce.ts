import type { Customer } from '../types/customer';
import type { Order } from '../types/order';
import type { Product } from '../types/product';

export interface CatalogProduct extends Product {
  category: string;
  description: string;
  color: string;
  icon: string;
  featured?: boolean;
}

export const categories = ['Tất cả', 'Đồ uống', 'Thực phẩm', 'Gia dụng', 'Chăm sóc cá nhân'];

export const catalogProducts: CatalogProduct[] = [
  { id: 1, sku: 'BEV-CC-330', barcode: '8934588012228', name: 'Coca-Cola lon 330ml', categoryId: 1, category: 'Đồ uống', brand: 'Coca-Cola', unit: 'Lon', retailPrice: 12000, wholesalePrice: 10500, moq: 24, priceTiers: [{ minQuantity: 24, maxQuantity: 47, unitPrice: 10500 }, { minQuantity: 48, unitPrice: 9800 }], availableStock: 168, status: 'ACTIVE', color: '#d92d20', icon: '🥤', featured: true, description: 'Nước giải khát có ga vị cola, dùng ngon hơn khi uống lạnh.' },
  { id: 2, sku: 'BEV-AQ-500', barcode: '8934588233074', name: 'Aquafina 500ml', categoryId: 1, category: 'Đồ uống', brand: 'Aquafina', unit: 'Chai', retailPrice: 7000, wholesalePrice: 5800, moq: 24, priceTiers: [{ minQuantity: 24, maxQuantity: 47, unitPrice: 5800 }, { minQuantity: 48, unitPrice: 5400 }], availableStock: 234, status: 'ACTIVE', color: '#2563eb', icon: '💧', featured: true, description: 'Nước uống tinh khiết đóng chai tiện lợi cho mọi hoạt động.' },
  { id: 3, sku: 'FOD-OM-75', barcode: '8934563138165', name: 'Mì Omachi sườn hầm ngũ quả', categoryId: 2, category: 'Thực phẩm', brand: 'Omachi', unit: 'Gói', retailPrice: 11000, wholesalePrice: 9200, moq: 30, priceTiers: [{ minQuantity: 30, maxQuantity: 59, unitPrice: 9200 }, { minQuantity: 60, unitPrice: 8700 }], availableStock: 96, status: 'ACTIVE', color: '#f97316', icon: '🍜', featured: true, description: 'Mì khoai tây sợi dai ngon cùng nước súp sườn hầm đậm vị.' },
  { id: 4, sku: 'FOD-RI-05', barcode: '8938501434012', name: 'Gạo thơm Jasmine túi 5kg', categoryId: 2, category: 'Thực phẩm', brand: 'An Gia', unit: 'Túi', retailPrice: 128000, wholesalePrice: 116000, moq: 5, priceTiers: [{ minQuantity: 5, maxQuantity: 9, unitPrice: 116000 }, { minQuantity: 10, unitPrice: 109000 }], availableStock: 42, status: 'ACTIVE', color: '#16a34a', icon: '🌾', featured: true, description: 'Hạt gạo dài, mềm dẻo và thơm nhẹ, phù hợp bữa cơm gia đình.' },
  { id: 5, sku: 'HOM-DW-750', barcode: '8934868113577', name: 'Nước rửa chén Sunlight 750g', categoryId: 3, category: 'Gia dụng', brand: 'Sunlight', unit: 'Chai', retailPrice: 36000, wholesalePrice: 32000, moq: 12, priceTiers: [{ minQuantity: 12, unitPrice: 32000 }], availableStock: 58, status: 'ACTIVE', color: '#eab308', icon: '🧴', description: 'Công thức làm sạch dầu mỡ, hương chanh dịu nhẹ.' },
  { id: 6, sku: 'PER-SH-650', barcode: '8934868175193', name: 'Dầu gội Clear bạc hà 630g', categoryId: 4, category: 'Chăm sóc cá nhân', brand: 'Clear', unit: 'Chai', retailPrice: 148000, wholesalePrice: 135000, moq: 6, priceTiers: [{ minQuantity: 6, unitPrice: 135000 }], availableStock: 27, status: 'ACTIVE', color: '#0f766e', icon: '🫧', description: 'Làm sạch gàu và mang lại cảm giác mát lạnh sảng khoái.' },
  { id: 7, sku: 'BEV-TE-450', barcode: '8936127790055', name: 'Trà xanh Không Độ 455ml', categoryId: 1, category: 'Đồ uống', brand: 'Không Độ', unit: 'Chai', retailPrice: 11000, wholesalePrice: 9500, moq: 24, priceTiers: [{ minQuantity: 24, unitPrice: 9500 }], availableStock: 72, status: 'ACTIVE', color: '#15803d', icon: '🍵', description: 'Trà xanh đóng chai thanh mát, tiện lợi khi di chuyển.' },
  { id: 8, sku: 'FOD-CK-300', barcode: '8934680032056', name: 'Bánh quy bơ Cosy 300g', categoryId: 2, category: 'Thực phẩm', brand: 'Cosy', unit: 'Hộp', retailPrice: 52000, wholesalePrice: 46000, moq: 8, priceTiers: [{ minQuantity: 8, unitPrice: 46000 }], availableStock: 38, status: 'ACTIVE', color: '#b45309', icon: '🍪', description: 'Bánh quy giòn xốp thơm vị bơ, phù hợp dùng cùng trà.' },
  { id: 9, sku: 'HOM-TS-12', barcode: '8936018061028', name: 'Khăn giấy Pulppy 12 cuộn', categoryId: 3, category: 'Gia dụng', brand: 'Pulppy', unit: 'Bịch', retailPrice: 89000, wholesalePrice: 79000, moq: 6, priceTiers: [{ minQuantity: 6, unitPrice: 79000 }], availableStock: 18, status: 'ACTIVE', color: '#7c3aed', icon: '🧻', description: 'Giấy vệ sinh mềm, dai, an toàn cho cả gia đình.' },
  { id: 10, sku: 'PER-TP-180', barcode: '8934868080435', name: 'Kem đánh răng P/S 180g', categoryId: 4, category: 'Chăm sóc cá nhân', brand: 'P/S', unit: 'Tuýp', retailPrice: 39000, wholesalePrice: 34500, moq: 12, priceTiers: [{ minQuantity: 12, unitPrice: 34500 }], availableStock: 65, status: 'ACTIVE', color: '#0284c7', icon: '🪥', description: 'Hỗ trợ bảo vệ răng chắc khỏe và hơi thở thơm mát.' },
  { id: 11, sku: 'FOD-MI-380', barcode: '8934673577038', name: 'Sữa đặc Ông Thọ 380g', categoryId: 2, category: 'Thực phẩm', brand: 'Vinamilk', unit: 'Hộp', retailPrice: 27000, wholesalePrice: 23800, moq: 12, priceTiers: [{ minQuantity: 12, unitPrice: 23800 }], availableStock: 81, status: 'ACTIVE', color: '#dc2626', icon: '🥛', description: 'Sữa đặc có đường, phù hợp pha cà phê và làm món tráng miệng.' },
  { id: 12, sku: 'HOM-DE-34', barcode: '8934868160281', name: 'Bột giặt OMO 3.4kg', categoryId: 3, category: 'Gia dụng', brand: 'OMO', unit: 'Túi', retailPrice: 178000, wholesalePrice: 162000, moq: 4, priceTiers: [{ minQuantity: 4, unitPrice: 162000 }], availableStock: 0, status: 'OUT_OF_STOCK', color: '#be123c', icon: '🧺', description: 'Bột giặt sạch sâu, lưu hương bền lâu trên quần áo.' },
];

export const customerProfiles: Customer[] = [
  { id: 1, fullName: 'Nguyễn Minh Anh', email: 'minhanh@example.com', phone: '0901 234 567', type: 'RETAIL' },
  { id: 2, fullName: 'Công ty TNHH Minh Phát', email: 'muahang@minhphat.vn', phone: '028 3877 8899', type: 'WHOLESALE', companyName: 'Công ty TNHH Minh Phát', taxCode: '0312345678', creditLimit: 50_000_000, creditUsed: 12_500_000 },
  { id: 3, fullName: 'Trần Thu Hà', email: 'thuha@example.com', phone: '0988 765 432', type: 'VIP' },
  { id: 4, fullName: 'Khách lẻ', email: 'walkin@saleshub.vn', phone: '', type: 'RETAIL' },
];

export const seedOrders: Order[] = [
  { id: 1001, code: 'WEB-260918-001', customerId: 1, channel: 'WEBSITE', status: 'SHIPPING', createdAt: '2026-09-18T08:30:00.000Z', totalAmount: 183000, items: [{ id: 1, productId: 1, productName: 'Coca-Cola lon 330ml', quantity: 4, unitPrice: 12000, subtotal: 48000 }, { id: 2, productId: 6, productName: 'Dầu gội Clear bạc hà 630g', quantity: 1, unitPrice: 135000, subtotal: 135000 }] },
  { id: 1002, code: 'WEB-260910-014', customerId: 1, channel: 'WEBSITE', status: 'COMPLETED', createdAt: '2026-09-10T04:15:00.000Z', totalAmount: 244000, items: [{ id: 3, productId: 4, productName: 'Gạo thơm Jasmine túi 5kg', quantity: 1, unitPrice: 128000, subtotal: 128000 }, { id: 4, productId: 5, productName: 'Nước rửa chén Sunlight 750g', quantity: 2, unitPrice: 36000, subtotal: 72000 }, { id: 5, productId: 7, productName: 'Trà xanh Không Độ 455ml', quantity: 4, unitPrice: 11000, subtotal: 44000 }] },
];


