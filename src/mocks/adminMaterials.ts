import type {
  AdminMaterialFilters,
  AdminMaterialListResult,
  AdminMaterialRecord,
  MaterialFormValues,
  MaterialGroup,
  MaterialType,
  MaterialUnit,
} from '../features/materials/materials.model';

interface MaterialSeed {
  name: string;
  group: MaterialGroup;
  unit: MaterialUnit;
  type: MaterialType;
}

const materialSeeds: MaterialSeed[] = [
  { name: 'Bột mì đa dụng', group: 'Nguyên vật liệu', unit: 'Kg', type: 'Nguyên vật liệu' },
  { name: 'Đường tinh luyện RE', group: 'Nguyên vật liệu', unit: 'Kg', type: 'Nguyên vật liệu' },
  { name: 'Dầu ăn hướng dương', group: 'Nguyên vật liệu', unit: 'Chai', type: 'Nguyên vật liệu' },
  { name: 'Muối tinh sấy', group: 'Nguyên vật liệu', unit: 'Kg', type: 'Nguyên vật liệu' },
  { name: 'Sữa bột nguyên kem', group: 'Nguyên vật liệu', unit: 'Kg', type: 'Nguyên vật liệu' },
  { name: 'Cà phê Arabica rang mộc', group: 'Nguyên vật liệu', unit: 'Kg', type: 'Nguyên vật liệu' },
  { name: 'Hạt điều rang không muối', group: 'Nguyên vật liệu', unit: 'Kg', type: 'Nguyên vật liệu' },
  { name: 'Bột cacao nguyên chất', group: 'Nguyên vật liệu', unit: 'Kg', type: 'Nguyên vật liệu' },
  { name: 'Màng co PE khổ 50 cm', group: 'Bao bì', unit: 'Cuộn', type: 'Nguyên vật liệu' },
  { name: 'Thùng carton 40 x 30 x 25 cm', group: 'Bao bì', unit: 'Cái', type: 'Hàng hóa' },
  { name: 'Túi zipper bạc 500 g', group: 'Bao bì', unit: 'Túi', type: 'Hàng hóa' },
  { name: 'Hộp giấy kraft 20 cm', group: 'Bao bì', unit: 'Hộp', type: 'Hàng hóa' },
  { name: 'Nhãn decal cuộn 50 x 30 mm', group: 'Bao bì', unit: 'Cuộn', type: 'Hàng hóa' },
  { name: 'Chai PET trong 500 ml', group: 'Bao bì', unit: 'Chai', type: 'Hàng hóa' },
  { name: 'Nắp chai nhựa trắng', group: 'Bao bì', unit: 'Cái', type: 'Hàng hóa' },
  { name: 'Áo thun cotton cổ tròn', group: 'Thành phẩm', unit: 'Cái', type: 'Thành phẩm' },
  { name: 'Cà phê rang xay túi 500 g', group: 'Thành phẩm', unit: 'Gói', type: 'Thành phẩm' },
  { name: 'Bánh quy bơ hộp 300 g', group: 'Thành phẩm', unit: 'Hộp', type: 'Thành phẩm' },
  { name: 'Trà ô long túi lọc', group: 'Thành phẩm', unit: 'Hộp', type: 'Thành phẩm' },
  { name: 'Nước ép cam nguyên chất', group: 'Thành phẩm', unit: 'Chai', type: 'Thành phẩm' },
  { name: 'Mì khô rau củ 400 g', group: 'Thành phẩm', unit: 'Gói', type: 'Thành phẩm' },
  { name: 'Granola hạt dinh dưỡng', group: 'Thành phẩm', unit: 'Túi', type: 'Thành phẩm' },
  { name: 'Gia vị rắc cơm rong biển', group: 'Thành phẩm', unit: 'Hộp', type: 'Thành phẩm' },
  { name: 'Dầu gội thảo mộc 500 ml', group: 'Thành phẩm', unit: 'Chai', type: 'Thành phẩm' },
  { name: 'Bình giữ nhiệt inox 750 ml', group: 'Hàng hóa', unit: 'Cái', type: 'Hàng hóa' },
  { name: 'Máy quét mã vạch cầm tay', group: 'Hàng hóa', unit: 'Cái', type: 'Hàng hóa' },
  { name: 'Giấy in hóa đơn K80', group: 'Hàng hóa', unit: 'Cuộn', type: 'Hàng hóa' },
  { name: 'Kệ sắt lắp ghép 5 tầng', group: 'Hàng hóa', unit: 'Bộ', type: 'Hàng hóa' },
  { name: 'Cân điện tử 30 kg', group: 'Hàng hóa', unit: 'Cái', type: 'Hàng hóa' },
  { name: 'Đèn bàn LED chống chói', group: 'Hàng hóa', unit: 'Cái', type: 'Hàng hóa' },
  { name: 'Bộ ly thủy tinh 6 chiếc', group: 'Hàng hóa', unit: 'Bộ', type: 'Hàng hóa' },
  { name: 'Hộp bảo quản thực phẩm', group: 'Hàng hóa', unit: 'Hộp', type: 'Hàng hóa' },
  { name: 'Khăn giấy đa năng', group: 'Hàng hóa', unit: 'Thùng', type: 'Hàng hóa' },
  { name: 'Nước rửa tay dịu nhẹ', group: 'Hàng hóa', unit: 'Chai', type: 'Hàng hóa' },
  { name: 'Máy khoan pin 18V', group: 'Công cụ dụng cụ', unit: 'Bộ', type: 'Công cụ dụng cụ' },
  { name: 'Bộ tua vít kỹ thuật 24 đầu', group: 'Công cụ dụng cụ', unit: 'Bộ', type: 'Công cụ dụng cụ' },
  { name: 'Xe đẩy hàng 300 kg', group: 'Công cụ dụng cụ', unit: 'Cái', type: 'Công cụ dụng cụ' },
  { name: 'Thang nhôm gấp 4 đoạn', group: 'Công cụ dụng cụ', unit: 'Cái', type: 'Công cụ dụng cụ' },
  { name: 'Dao rọc giấy công nghiệp', group: 'Công cụ dụng cụ', unit: 'Cái', type: 'Công cụ dụng cụ' },
  { name: 'Bộ đàm cầm tay nội bộ', group: 'Công cụ dụng cụ', unit: 'Bộ', type: 'Công cụ dụng cụ' },
  { name: 'Máy dán thùng carton', group: 'Công cụ dụng cụ', unit: 'Cái', type: 'Công cụ dụng cụ' },
  { name: 'Khay nhựa linh kiện 12 ngăn', group: 'Công cụ dụng cụ', unit: 'Cái', type: 'Công cụ dụng cụ' },
  { name: 'Găng tay bảo hộ phủ PU', group: 'Công cụ dụng cụ', unit: 'Đôi', type: 'Công cụ dụng cụ' },
  { name: 'Cuộn dây đai nhựa PP', group: 'Bao bì', unit: 'Cuộn', type: 'Nguyên vật liệu' },
  { name: 'Băng keo trong 48 mm', group: 'Bao bì', unit: 'Cuộn', type: 'Hàng hóa' },
  { name: 'Hộp quà giấy cứng', group: 'Bao bì', unit: 'Hộp', type: 'Hàng hóa' },
  { name: 'Sốt cà chua chai 250 ml', group: 'Thành phẩm', unit: 'Chai', type: 'Thành phẩm' },
  { name: 'Bột ngũ cốc dinh dưỡng', group: 'Thành phẩm', unit: 'Hộp', type: 'Thành phẩm' },
  { name: 'Coca Cola 330ml', group: 'Hàng hóa', unit: 'Lon', type: 'Hàng hóa' },
  { name: 'Dây điện mềm 2 x 1.5 mm', group: 'Nguyên vật liệu', unit: 'Mét', type: 'Nguyên vật liệu' },
];

const codePrefix: Record<MaterialGroup, string> = {
  'Thành phẩm': 'TP',
  'Nguyên vật liệu': 'NVL',
  'Công cụ dụng cụ': 'CCDC',
  'Hàng hóa': 'HH',
  'Bao bì': 'BB',
};

const groupCounters = new Map<MaterialGroup, number>();

const seedMaterials: AdminMaterialRecord[] = materialSeeds.map((seed, index) => {
  const sequence = (groupCounters.get(seed.group) ?? 0) + 1;
  groupCounters.set(seed.group, sequence);
  const code = `${codePrefix[seed.group]}${String(sequence).padStart(4, '0')}`;
  const isSaleable = seed.type === 'Hàng hóa' || seed.type === 'Thành phẩm';
  const requiresSerial = seed.name.includes('Máy') || seed.name.includes('Bộ đàm');
  const isCola = seed.name === 'Coca Cola 330ml';

  return {
    ...seed,
    id: String(index + 1),
    code,
    sku: `${code}-SKU`,
    barcode: isCola ? '8938505974190' : `893${String(1000000000 + index).padStart(10, '0')}`,
    description: `Danh mục vật tư mẫu phục vụ kiểm thử nghiệp vụ ${seed.group.toLocaleLowerCase('vi-VN')}.`,
    status: (index + 1) % 8 === 0 ? 'INACTIVE' : 'ACTIVE',
    allowSale: isSaleable,
    visibleOnSalesChannel: isSaleable && (index + 1) % 6 !== 0,
    requireImeiOnOutbound: requiresSerial,
    lengthCm: isCola ? 6.5 : undefined,
    widthCm: isCola ? 6.5 : undefined,
    heightCm: isCola ? 12 : undefined,
    qrRule: isCola
      ? 'ITEM_BATCH'
      : requiresSerial
        ? 'ITEM_SERIAL'
        : seed.group === 'Nguyên vật liệu'
          ? 'ITEM_BATCH'
          : 'BARCODE',
    referenceCode: `REF-${code}`,
    minimumStock: isCola ? 24 : (index + 1) % 5 === 0 ? 10 : undefined,
    quantityFormula: isCola ? '1 thùng = 24 lon' : undefined,
    defaultWarehouse: 'KHO_HCM',
    inventoryAccount: '1561',
    revenueAccount: isSaleable ? '5111' : undefined,
    discountAccount: undefined,
    priceReductionAccount: undefined,
    salesReturnAccount: undefined,
    expenseAccount: '632',
    purchaseDiscountRate: 0,
    defaultUnit: seed.unit,
    allowProcessingLabel: seed.group === 'Thành phẩm',
    fixedPurchasePrice: 0,
    latestPurchasePrice: 0,
    sellingPrice: 0,
    internalPrice: 0,
    minimumSellingPrice: 0,
    salePriceIncludesTax: false,
    vatRate: 0,
    importTaxRate: 0,
    exportTaxRate: 0,
    specialConsumptionTaxGroup: undefined,
    origin: 'Việt Nam',
    supplySource: 'PURCHASE',
    warrantyDuration: requiresSerial ? 12 : undefined,
    warrantyUnit: requiresSerial ? 'MONTH' : undefined,
    declarationNumber: isCola ? '01/2026/ATTP-XNCB' : undefined,
    purchaseNote: isCola ? 'Nhập hàng theo thùng.' : undefined,
    salesNote: isCola ? 'Có thể bán theo lon hoặc lốc.' : undefined,
    updatedAt: new Date(Date.UTC(2026, 8, 20 - (index % 18), 8 + (index % 8), 15)).toISOString(),
  };
});

let materials = seedMaterials.map((material) => ({ ...material }));

function wait(duration = 260): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('vi-VN');
}

function normalizeCode(value: string): string {
  return value.trim().toLocaleUpperCase('vi-VN');
}

function trimOptional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export async function listMockAdminMaterials(
  filters: AdminMaterialFilters,
  page: number,
  size: number,
): Promise<AdminMaterialListResult> {
  await wait();
  const keyword = normalize(filters.keyword);
  const code = normalize(filters.code);
  const name = normalize(filters.name);

  const filteredMaterials = materials.filter((material) => {
    const normalizedCode = normalize(material.code);
    const normalizedName = normalize(material.name);
    const matchesKeyword =
      !keyword || normalizedCode.includes(keyword) || normalizedName.includes(keyword);
    const matchesCode = !code || normalizedCode.includes(code);
    const matchesName = !name || normalizedName.includes(name);
    const matchesGroup = !filters.group || material.group === filters.group;
    const matchesType = !filters.type || material.type === filters.type;
    const matchesStatus = filters.status === 'ALL' || material.status === filters.status;

    return matchesKeyword && matchesCode && matchesName && matchesGroup && matchesType && matchesStatus;
  });

  const start = (page - 1) * size;

  return {
    content: filteredMaterials.slice(start, start + size).map((material) => ({ ...material })),
    totalElements: filteredMaterials.length,
    page,
    size,
    totalPages: Math.ceil(filteredMaterials.length / size),
  };
}

export async function isMockAdminMaterialCodeTaken(
  code: string,
  excludeId?: string,
): Promise<boolean> {
  await wait(120);
  const normalizedCode = normalize(code);
  return materials.some(
    (material) => normalize(material.code) === normalizedCode && material.id !== excludeId,
  );
}

export async function createMockAdminMaterial(
  values: MaterialFormValues,
): Promise<AdminMaterialRecord> {
  await wait(360);
  if (await isMockAdminMaterialCodeTaken(values.code)) {
    throw new Error('Mã vật tư đã tồn tại trong danh mục.');
  }

  const nextId = String(Math.max(...materials.map((material) => Number(material.id)), 0) + 1);
  const material: AdminMaterialRecord = {
    ...values,
    id: nextId,
    code: normalizeCode(values.code),
    name: values.name.trim(),
    sku: trimOptional(values.sku),
    barcode: trimOptional(values.barcode),
    description: trimOptional(values.description),
    referenceCode: trimOptional(values.referenceCode),
    quantityFormula: trimOptional(values.quantityFormula),
    defaultWarehouse: trimOptional(values.defaultWarehouse),
    inventoryAccount: trimOptional(values.inventoryAccount),
    revenueAccount: trimOptional(values.revenueAccount),
    discountAccount: trimOptional(values.discountAccount),
    priceReductionAccount: trimOptional(values.priceReductionAccount),
    salesReturnAccount: trimOptional(values.salesReturnAccount),
    expenseAccount: trimOptional(values.expenseAccount),
    specialConsumptionTaxGroup: trimOptional(values.specialConsumptionTaxGroup),
    origin: trimOptional(values.origin),
    declarationNumber: trimOptional(values.declarationNumber),
    purchaseNote: trimOptional(values.purchaseNote),
    salesNote: trimOptional(values.salesNote),
    updatedAt: new Date().toISOString(),
  };

  materials = [material, ...materials];
  return { ...material };
}

export async function updateMockAdminMaterial(
  id: string,
  values: MaterialFormValues,
): Promise<AdminMaterialRecord> {
  await wait(360);
  const existingMaterial = materials.find((material) => material.id === id);
  if (!existingMaterial) {
    throw new Error('Không tìm thấy vật tư cần cập nhật.');
  }
  if (await isMockAdminMaterialCodeTaken(values.code, id)) {
    throw new Error('Mã vật tư đã tồn tại trong danh mục.');
  }

  const updatedMaterial: AdminMaterialRecord = {
    ...existingMaterial,
    ...values,
    code: normalizeCode(values.code),
    name: values.name.trim(),
    sku: trimOptional(values.sku),
    barcode: trimOptional(values.barcode),
    description: trimOptional(values.description),
    referenceCode: trimOptional(values.referenceCode),
    quantityFormula: trimOptional(values.quantityFormula),
    defaultWarehouse: trimOptional(values.defaultWarehouse),
    inventoryAccount: trimOptional(values.inventoryAccount),
    revenueAccount: trimOptional(values.revenueAccount),
    discountAccount: trimOptional(values.discountAccount),
    priceReductionAccount: trimOptional(values.priceReductionAccount),
    salesReturnAccount: trimOptional(values.salesReturnAccount),
    expenseAccount: trimOptional(values.expenseAccount),
    specialConsumptionTaxGroup: trimOptional(values.specialConsumptionTaxGroup),
    origin: trimOptional(values.origin),
    declarationNumber: trimOptional(values.declarationNumber),
    purchaseNote: trimOptional(values.purchaseNote),
    salesNote: trimOptional(values.salesNote),
    updatedAt: new Date().toISOString(),
  };

  materials = materials.map((material) => (material.id === id ? updatedMaterial : material));
  return { ...updatedMaterial };
}
