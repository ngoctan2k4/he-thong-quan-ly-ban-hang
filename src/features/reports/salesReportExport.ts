import { strToU8, zipSync } from 'fflate';
import type { CatalogProduct } from '../../mocks/commerce';
import type { Customer } from '../../types/customer';
import type { Order, OrderChannel, OrderStatus } from '../../types/order';

interface SalesReportSource {
  orders: Order[];
  customers: Customer[];
  products: CatalogProduct[];
}

interface ReportCell {
  value: string | number;
  style?: number;
}

interface ReportRow {
  cells: Array<ReportCell | null>;
  height?: number;
}

interface WorksheetOptions {
  rows: ReportRow[];
  widths: number[];
  merges?: string[];
  autoFilter?: string;
  freezeRows?: number;
}

const recordedStatuses = new Set<OrderStatus>([
  'CONFIRMED',
  'PROCESSING',
  'SHIPPING',
  'COMPLETED',
]);

const channelLabels: Record<OrderChannel, string> = {
  WEBSITE: 'Website',
  POS: 'POS',
  WHOLESALE: 'Wholesale',
};

const statusLabels: Record<OrderStatus, string> = {
  DRAFT: 'Nháp / Chờ duyệt',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  REJECTED: 'Bị từ chối',
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function getColumnName(index: number): string {
  let result = '';
  let current = index + 1;

  while (current > 0) {
    const remainder = (current - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    current = Math.floor((current - 1) / 26);
  }

  return result;
}

function createCellXml(cell: ReportCell, rowIndex: number, columnIndex: number): string {
  const reference = `${getColumnName(columnIndex)}${rowIndex}`;
  const style = cell.style === undefined ? '' : ` s="${cell.style}"`;

  if (typeof cell.value === 'number') {
    return `<c r="${reference}"${style}><v>${cell.value}</v></c>`;
  }

  return `<c r="${reference}" t="inlineStr"${style}><is><t xml:space="preserve">${escapeXml(cell.value)}</t></is></c>`;
}

function createWorksheetXml({
  rows,
  widths,
  merges = [],
  autoFilter,
  freezeRows,
}: WorksheetOptions): string {
  const maxColumns = Math.max(1, ...rows.map((row) => row.cells.length));
  const lastCell = `${getColumnName(maxColumns - 1)}${Math.max(rows.length, 1)}`;
  const columnsXml = widths
    .map(
      (width, index) =>
        `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`,
    )
    .join('');
  const rowsXml = rows
    .map((row, rowOffset) => {
      const rowIndex = rowOffset + 1;
      const height = row.height ? ` ht="${row.height}" customHeight="1"` : '';
      const cellsXml = row.cells
        .map((cell, columnIndex) =>
          cell ? createCellXml(cell, rowIndex, columnIndex) : '',
        )
        .join('');

      return `<row r="${rowIndex}"${height}>${cellsXml}</row>`;
    })
    .join('');
  const paneXml = freezeRows
    ? `<sheetViews><sheetView workbookViewId="0"><pane ySplit="${freezeRows}" topLeftCell="A${freezeRows + 1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`
    : '<sheetViews><sheetView workbookViewId="0"/></sheetViews>';
  const mergesXml = merges.length
    ? `<mergeCells count="${merges.length}">${merges.map((range) => `<mergeCell ref="${range}"/>`).join('')}</mergeCells>`
    : '';
  const autoFilterXml = autoFilter ? `<autoFilter ref="${autoFilter}"/>` : '';

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:${lastCell}"/>
  ${paneXml}
  <sheetFormatPr defaultRowHeight="18"/>
  <cols>${columnsXml}</cols>
  <sheetData>${rowsXml}</sheetData>
  ${autoFilterXml}
  ${mergesXml}
  <pageMargins left="0.3" right="0.3" top="0.5" bottom="0.5" header="0.2" footer="0.2"/>
</worksheet>`;
}

function toExcelSerial(value: string): number | undefined {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const localTime = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  );

  return localTime / 86_400_000 + 25_569;
}

function createSummaryRows(orders: Order[], generatedAt: string): ReportRow[] {
  const channels: OrderChannel[] = ['WEBSITE', 'POS', 'WHOLESALE'];
  const rows: ReportRow[] = [
    {
      cells: [{ value: 'BÁO CÁO DOANH SỐ VÀ SẢN LƯỢNG', style: 1 }],
      height: 25,
    },
    {
      cells: [{ value: `Xuất lúc: ${generatedAt}`, style: 2 }],
    },
    { cells: [] },
    {
      cells: [
        { value: 'Kênh bán', style: 3 },
        { value: 'Tổng số đơn', style: 3 },
        { value: 'Số đơn ghi nhận', style: 3 },
        { value: 'Sản lượng', style: 3 },
        { value: 'Doanh số (VND)', style: 3 },
      ],
      height: 28,
    },
  ];

  const summaries = channels.map((channel) => {
    const channelOrders = orders.filter((order) => order.channel === channel);
    const recordedOrders = channelOrders.filter((order) =>
      recordedStatuses.has(order.status),
    );

    return {
      channel,
      totalOrders: channelOrders.length,
      recordedOrders: recordedOrders.length,
      quantity: recordedOrders.reduce(
        (sum, order) =>
          sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
        0,
      ),
      revenue: recordedOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    };
  });

  summaries.forEach((summary) => {
    rows.push({
      cells: [
        { value: channelLabels[summary.channel] },
        { value: summary.totalOrders, style: 4 },
        { value: summary.recordedOrders, style: 4 },
        { value: summary.quantity, style: 4 },
        { value: summary.revenue, style: 5 },
      ],
    });
  });

  rows.push({
    cells: [
      { value: 'Tổng cộng', style: 7 },
      {
        value: summaries.reduce((sum, item) => sum + item.totalOrders, 0),
        style: 8,
      },
      {
        value: summaries.reduce((sum, item) => sum + item.recordedOrders, 0),
        style: 8,
      },
      {
        value: summaries.reduce((sum, item) => sum + item.quantity, 0),
        style: 8,
      },
      {
        value: summaries.reduce((sum, item) => sum + item.revenue, 0),
        style: 9,
      },
    ],
    height: 21,
  });

  return rows;
}

function createDetailRows(
  orders: Order[],
  customers: Customer[],
  products: CatalogProduct[],
  generatedAt: string,
): ReportRow[] {
  const customerNames = new Map(customers.map((customer) => [customer.id, customer.fullName]));
  const productSkus = new Map(products.map((product) => [product.id, product.sku]));
  const rows: ReportRow[] = [
    {
      cells: [{ value: 'CHI TIẾT ĐƠN HÀNG BÁN', style: 1 }],
      height: 25,
    },
    {
      cells: [{ value: `Xuất lúc: ${generatedAt}`, style: 2 }],
    },
    { cells: [] },
    {
      cells: [
        { value: 'Mã đơn', style: 3 },
        { value: 'Ngày tạo', style: 3 },
        { value: 'Kênh bán', style: 3 },
        { value: 'Khách hàng', style: 3 },
        { value: 'Trạng thái', style: 3 },
        { value: 'Ghi nhận doanh số', style: 3 },
        { value: 'SKU', style: 3 },
        { value: 'Sản phẩm', style: 3 },
        { value: 'Số lượng', style: 3 },
        { value: 'Đơn giá (VND)', style: 3 },
        { value: 'Thành tiền (VND)', style: 3 },
      ],
      height: 28,
    },
  ];

  const detailRows = orders.flatMap((order) =>
    order.items.map((item) => {
      const createdAt = toExcelSerial(order.createdAt);

      return {
        cells: [
          { value: order.code },
          createdAt === undefined
            ? { value: order.createdAt }
            : { value: createdAt, style: 6 },
          { value: channelLabels[order.channel] },
          { value: customerNames.get(order.customerId ?? -1) ?? 'Khách lẻ' },
          { value: statusLabels[order.status] },
          { value: recordedStatuses.has(order.status) ? 'Có' : 'Không', style: 10 },
          { value: productSkus.get(item.productId) ?? String(item.productId) },
          { value: item.productName },
          { value: item.quantity, style: 4 },
          { value: item.unitPrice, style: 5 },
          { value: item.subtotal, style: 5 },
        ],
      } satisfies ReportRow;
    }),
  );

  if (detailRows.length === 0) {
    rows.push({ cells: [{ value: 'Chưa có dữ liệu đơn hàng.' }] });
  } else {
    rows.push(...detailRows);
  }

  return rows;
}

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <numFmts count="2">
    <numFmt numFmtId="164" formatCode="#,##0"/>
    <numFmt numFmtId="165" formatCode="dd/mm/yyyy hh:mm"/>
  </numFmts>
  <fonts count="4">
    <font><sz val="10"/><name val="Arial"/><family val="2"/></font>
    <font><b/><sz val="14"/><color rgb="FF1F2937"/><name val="Arial"/><family val="2"/></font>
    <font><i/><sz val="10"/><color rgb="FF6B7280"/><name val="Arial"/><family val="2"/></font>
    <font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Arial"/><family val="2"/></font>
  </fonts>
  <fills count="4">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1F4E78"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFDCE6F1"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFD9E2F3"/></left>
      <right style="thin"><color rgb="FFD9E2F3"/></right>
      <top style="thin"><color rgb="FFD9E2F3"/></top>
      <bottom style="thin"><color rgb="FFD9E2F3"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="11">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"><alignment vertical="center"/></xf>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"><alignment vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"><alignment vertical="center"/></xf>
    <xf numFmtId="0" fontId="3" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment vertical="center"/></xf>
    <xf numFmtId="164" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyNumberFormat="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="164" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyNumberFormat="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"><alignment horizontal="center" vertical="center"/></xf>
  </cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

export function createSalesReportWorkbook({
  orders,
  customers,
  products,
}: SalesReportSource): Uint8Array {
  const generatedAt = new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date());
  const summaryRows = createSummaryRows(orders, generatedAt);
  const detailRows = createDetailRows(orders, customers, products, generatedAt);
  const summarySheet = createWorksheetXml({
    rows: summaryRows,
    widths: [22, 16, 18, 16, 22],
    merges: ['A1:E1', 'A2:E2'],
    autoFilter: 'A4:E7',
    freezeRows: 4,
  });
  const detailLastRow = Math.max(4, detailRows.length);
  const detailSheet = createWorksheetXml({
    rows: detailRows,
    widths: [20, 20, 14, 28, 19, 20, 18, 38, 12, 18, 20],
    merges: ['A1:K1', 'A2:K2'],
    autoFilter: `A4:K${detailLastRow}`,
    freezeRows: 4,
  });

  return zipSync(
    {
      '[Content_Types].xml': strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`),
      '_rels/.rels': strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`),
      'xl/workbook.xml': strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Tổng hợp" sheetId="1" r:id="rId1"/>
    <sheet name="Chi tiết" sheetId="2" r:id="rId2"/>
  </sheets>
  <calcPr calcId="0" fullCalcOnLoad="1"/>
</workbook>`),
      'xl/_rels/workbook.xml.rels': strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`),
      'xl/styles.xml': strToU8(stylesXml),
      'xl/worksheets/sheet1.xml': strToU8(summarySheet),
      'xl/worksheets/sheet2.xml': strToU8(detailSheet),
    },
    { level: 6 },
  );
}

export function downloadSalesReportXlsx(source: SalesReportSource): string {
  const workbook = createSalesReportWorkbook(source);
  const now = new Date();
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  const fileName = `bao-cao-ban-hang-${datePart}.xlsx`;
  const blob = new Blob([workbook], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);

  return fileName;
}
