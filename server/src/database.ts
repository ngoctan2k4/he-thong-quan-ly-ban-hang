import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';
import type { CatalogStore } from './store.js';

export interface DatabasePool {
  query<R extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]): Promise<QueryResult<R>>;
  connect(): Promise<Pick<PoolClient, 'query' | 'release'>>;
  end(): Promise<void>;
}

let database: DatabasePool | undefined;

const schema = `
  CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY, code TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
    parent_id INTEGER REFERENCES categories(id), description TEXT, is_active BOOLEAN NOT NULL,
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS categories_code_ci ON categories (LOWER(code));
  CREATE TABLE IF NOT EXISTS units (id INTEGER PRIMARY KEY, code TEXT NOT NULL UNIQUE, name TEXT NOT NULL, is_active BOOLEAN NOT NULL);
  CREATE UNIQUE INDEX IF NOT EXISTS units_code_ci ON units (LOWER(code));
  CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY, code TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
    tax_code TEXT, phone TEXT, email TEXT, address TEXT,
    avg_lead_time_days INTEGER NOT NULL CHECK (avg_lead_time_days >= 0),
    max_lead_time_days INTEGER NOT NULL CHECK (max_lead_time_days >= avg_lead_time_days),
    is_active BOOLEAN NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS suppliers_code_ci ON suppliers (LOWER(code));
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY, code TEXT NOT NULL UNIQUE, sku TEXT NOT NULL UNIQUE, barcode TEXT UNIQUE,
    name TEXT NOT NULL, category_id INTEGER NOT NULL REFERENCES categories(id), brand TEXT,
    base_unit_id INTEGER NOT NULL REFERENCES units(id),
    retail_price DOUBLE PRECISION NOT NULL CHECK (retail_price >= 0),
    wholesale_price DOUBLE PRECISION NOT NULL CHECK (wholesale_price >= 0),
    wholesale_moq INTEGER NOT NULL CHECK (wholesale_moq > 0),
    min_stock INTEGER NOT NULL CHECK (min_stock >= 0),
    max_stock INTEGER CHECK (max_stock IS NULL OR max_stock >= min_stock),
    safety_stock INTEGER NOT NULL CHECK (safety_stock >= 0), reorder_point INTEGER NOT NULL CHECK (reorder_point >= 0),
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'DISCONTINUED', 'HIDDEN')),
    is_active BOOLEAN NOT NULL, default_supplier_id INTEGER REFERENCES suppliers(id),
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS products_code_ci ON products (LOWER(code));
  CREATE UNIQUE INDEX IF NOT EXISTS products_sku_ci ON products (LOWER(sku));
  CREATE UNIQUE INDEX IF NOT EXISTS products_barcode_ci ON products (LOWER(barcode)) WHERE barcode IS NOT NULL;
  CREATE TABLE IF NOT EXISTS product_conversions (
    id INTEGER PRIMARY KEY, product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    unit_id INTEGER NOT NULL REFERENCES units(id), factor DOUBLE PRECISION NOT NULL CHECK (factor > 0), UNIQUE(product_id, unit_id)
  );
  CREATE TABLE IF NOT EXISTS price_lists (
    id INTEGER PRIMARY KEY, code TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
    customer_type TEXT NOT NULL CHECK (customer_type IN ('RETAIL', 'WHOLESALE', 'VIP')),
    valid_from TEXT NOT NULL, valid_to TEXT, is_active BOOLEAN NOT NULL, created_at TEXT NOT NULL,
    CHECK (valid_to IS NULL OR valid_to >= valid_from)
  );
  CREATE UNIQUE INDEX IF NOT EXISTS price_lists_code_ci ON price_lists (LOWER(code));
  CREATE TABLE IF NOT EXISTS price_tiers (
    id INTEGER PRIMARY KEY, price_list_id INTEGER NOT NULL REFERENCES price_lists(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    min_qty INTEGER NOT NULL CHECK (min_qty > 0), max_qty INTEGER,
    unit_price DOUBLE PRECISION NOT NULL CHECK (unit_price >= 0), CHECK (max_qty IS NULL OR max_qty >= min_qty)
  );
  CREATE TABLE IF NOT EXISTS supplier_products (
    id INTEGER PRIMARY KEY, supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    last_purchase_price DOUBLE PRECISION NOT NULL CHECK (last_purchase_price >= 0),
    lead_time_days INTEGER NOT NULL CHECK (lead_time_days >= 0), UNIQUE(supplier_id, product_id)
  );
  CREATE TABLE IF NOT EXISTS inventory_balances (
    id INTEGER PRIMARY KEY, product_id INTEGER NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
    on_hand DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (on_hand >= 0),
    reserved DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (reserved >= 0 AND reserved <= on_hand), updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS stock_issues (
    id INTEGER PRIMARY KEY, code TEXT NOT NULL UNIQUE, reference TEXT NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id), quantity DOUBLE PRECISION NOT NULL CHECK (quantity > 0), created_at TEXT NOT NULL
  );
`;

function db(): DatabasePool {
  if (!database) throw new Error('Database chưa được khởi tạo.');
  return database;
}

export async function openDatabase(databaseUrl: string, pool?: DatabasePool): Promise<void> {
  await closeDatabase();
  database = pool ?? new Pool({ connectionString: databaseUrl, max: 10 });
  await database.query(schema);
  await database.query('INSERT INTO schema_migrations(version, applied_at) VALUES ($1, $2) ON CONFLICT (version) DO NOTHING', [1, new Date().toISOString()]);
}

export async function loadStore(target: CatalogStore): Promise<void> {
  const connection = db();
  const results = await Promise.all([
    connection.query('SELECT id, code, name, parent_id AS "parentId", description, is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt" FROM categories ORDER BY id'),
    connection.query('SELECT id, code, name, is_active AS "isActive" FROM units ORDER BY id'),
    connection.query('SELECT id, code, sku, barcode, name, category_id AS "categoryId", brand, base_unit_id AS "baseUnitId", retail_price AS "retailPrice", wholesale_price AS "wholesalePrice", wholesale_moq AS moq, min_stock AS "minStock", max_stock AS "maxStock", safety_stock AS "safetyStock", reorder_point AS "reorderPoint", status, is_active AS "isActive", default_supplier_id AS "defaultSupplierId", created_at AS "createdAt", updated_at AS "updatedAt" FROM products ORDER BY id'),
    connection.query('SELECT id, product_id AS "productId", unit_id AS "unitId", factor FROM product_conversions ORDER BY id'),
    connection.query('SELECT id, code, name, customer_type AS "customerType", valid_from AS "validFrom", valid_to AS "validTo", is_active AS "isActive", created_at AS "createdAt" FROM price_lists ORDER BY id'),
    connection.query('SELECT id, price_list_id AS "priceListId", product_id AS "productId", min_qty AS "minQty", max_qty AS "maxQty", unit_price AS "unitPrice" FROM price_tiers ORDER BY id'),
    connection.query('SELECT id, code, name, tax_code AS "taxCode", phone, email, address, avg_lead_time_days AS "avgLeadTimeDays", max_lead_time_days AS "maxLeadTimeDays", is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt" FROM suppliers ORDER BY id'),
    connection.query('SELECT id, supplier_id AS "supplierId", product_id AS "productId", last_purchase_price AS "lastPurchasePrice", lead_time_days AS "leadTimeDays" FROM supplier_products ORDER BY id'),
    connection.query('SELECT id, product_id AS "productId", on_hand AS "onHand", reserved, updated_at AS "updatedAt" FROM inventory_balances ORDER BY id'),
    connection.query('SELECT id, code, reference, product_id AS "productId", quantity, created_at AS "createdAt" FROM stock_issues ORDER BY id DESC'),
  ]);
  [target.categories, target.units, target.products, target.conversions, target.priceLists, target.priceTiers, target.suppliers, target.supplierProducts, target.inventoryBalances, target.stockIssues] = [
    results[0].rows as CatalogStore['categories'], results[1].rows as CatalogStore['units'], results[2].rows as CatalogStore['products'],
    results[3].rows as CatalogStore['conversions'], results[4].rows as CatalogStore['priceLists'], results[5].rows as CatalogStore['priceTiers'],
    results[6].rows as CatalogStore['suppliers'], results[7].rows as CatalogStore['supplierProducts'], results[8].rows as CatalogStore['inventoryBalances'], results[9].rows as CatalogStore['stockIssues'],
  ];
}

export async function saveStore(source: CatalogStore): Promise<void> {
  const client = await db().connect();
  try {
    await client.query('BEGIN');
    for (const table of ['stock_issues', 'inventory_balances', 'supplier_products', 'price_tiers', 'product_conversions', 'products', 'price_lists', 'suppliers', 'categories', 'units']) await client.query(`DELETE FROM ${table}`);
    const pendingCategories = [...source.categories];
    const insertedCategoryIds = new Set<number>();
    while (pendingCategories.length) {
      const index = pendingCategories.findIndex((item) => item.parentId === undefined || insertedCategoryIds.has(item.parentId));
      if (index < 0) throw new Error('Cây nhóm hàng chứa quan hệ cha không hợp lệ.');
      const [x] = pendingCategories.splice(index, 1);
      await client.query('INSERT INTO categories VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [x!.id,x!.code,x!.name,x!.parentId??null,x!.description??null,x!.isActive,x!.createdAt,x!.updatedAt]);
      insertedCategoryIds.add(x!.id);
    }
    for (const x of source.units) await client.query('INSERT INTO units VALUES ($1,$2,$3,$4)', [x.id,x.code,x.name,x.isActive]);
    for (const x of source.suppliers) await client.query('INSERT INTO suppliers VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)', [x.id,x.code,x.name,x.taxCode??null,x.phone??null,x.email??null,x.address??null,x.avgLeadTimeDays,x.maxLeadTimeDays,x.isActive,x.createdAt,x.updatedAt]);
    for (const x of source.products) await client.query('INSERT INTO products VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)', [x.id,x.code,x.sku,x.barcode??null,x.name,x.categoryId,x.brand??null,x.baseUnitId,x.retailPrice,x.wholesalePrice,x.moq,x.minStock,x.maxStock??null,x.safetyStock,x.reorderPoint,x.status,x.isActive,x.defaultSupplierId??null,x.createdAt,x.updatedAt]);
    for (const x of source.conversions) await client.query('INSERT INTO product_conversions VALUES ($1,$2,$3,$4)', [x.id,x.productId,x.unitId,x.factor]);
    for (const x of source.priceLists) await client.query('INSERT INTO price_lists VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [x.id,x.code,x.name,x.customerType,x.validFrom,x.validTo??null,x.isActive,x.createdAt]);
    for (const x of source.priceTiers) await client.query('INSERT INTO price_tiers VALUES ($1,$2,$3,$4,$5,$6)', [x.id,x.priceListId,x.productId,x.minQty,x.maxQty??null,x.unitPrice]);
    for (const x of source.supplierProducts) await client.query('INSERT INTO supplier_products VALUES ($1,$2,$3,$4,$5)', [x.id,x.supplierId,x.productId,x.lastPurchasePrice,x.leadTimeDays]);
    for (const x of source.inventoryBalances) await client.query('INSERT INTO inventory_balances VALUES ($1,$2,$3,$4,$5)', [x.id,x.productId,x.onHand,x.reserved,x.updatedAt]);
    for (const x of source.stockIssues) await client.query('INSERT INTO stock_issues VALUES ($1,$2,$3,$4,$5,$6)', [x.id,x.code,x.reference,x.productId,x.quantity,x.createdAt]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function closeDatabase(): Promise<void> {
  const current = database;
  database = undefined;
  if (current) await current.end();
}

export async function isDatabaseReady(): Promise<boolean> {
  try { return (await db().query('SELECT 1 AS ready')).rowCount === 1; }
  catch { return false; }
}
