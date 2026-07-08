import { createClient } from '@supabase/supabase-js';
import productsFallback from './products.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rcsqcbrdfqgxqhnyqtoa.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjc3FjYnJkZnFneHFobnlxdG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NTgxNTYsImV4cCI6MjA5OTAzNDE1Nn0.8J3-Sb6e-aF1cv6Lll-y7KNR-oIQ6mFzllndgxrVKHM';

// 1. Setup in-memory seed database
const memoryDb: Record<string, any[]> = {
  products: productsFallback,
  categories: [
    { id: '015f8560-3f0d-4bfd-8177-38898998743b', name: 'Home', slug: 'home', is_active: true },
    { id: '6752bb38-eb79-4238-a21e-0f78d082c33e', name: 'Appliances', slug: 'appliances', is_active: true }
  ],
  banners: [
    { id: '1', title: 'Sale 1', image_url: '/banners/banner1.jpg', is_active: true },
    { id: '2', title: 'Sale 2', image_url: '/banners/banner2.jpg', is_active: true },
    { id: '3', title: 'Sale 3', image_url: '/banners/banner3.jpg', is_active: true },
    { id: '4', title: 'Sale 4', image_url: '/banners/banner4.jpg', is_active: true }
  ],
  settings: [
    { key: 'merchant_upi', value: { upi_id: 'paytm.s29ckmp@pty', merchant_name: 'Gohil Vikrambhai Kanabhai', merchant_code: '0000', mode: 'manual' } }
  ],
  addresses: [],
  orders: [],
  order_items: [],
  payments: [],
  coupons: []
};

// Flatten any initial product images from products into product_images table if needed
const initialProductImages: any[] = [];
productsFallback.forEach((p: any) => {
  if (p.product_images && Array.isArray(p.product_images)) {
    p.product_images.forEach((img: any, index: number) => {
      initialProductImages.push({
        id: `img-${p.id}-${index}`,
        product_id: p.id,
        image_url: img.image_url,
        is_featured: img.is_featured,
        order_index: index
      });
    });
  }
});
memoryDb['product_images'] = initialProductImages;

function getLocalTableData(tableName: string): any[] {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(`mock_db_${tableName}`);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error(`Failed to parse cached table ${tableName}`, e);
      }
    }
  }
  return memoryDb[tableName] || [];
}

function saveLocalTableData(tableName: string, data: any[]) {
  memoryDb[tableName] = data;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`mock_db_${tableName}`, JSON.stringify(data));
    } catch (e) {
      console.error(`Failed to save table ${tableName} to localStorage`, e);
    }
  }
}

// 2. Mock Query Builder following Supabase Client design patterns
class MockSupabaseQuery {
  private tableName: string;
  private actions: Array<{ type: string; args: any[] }> = [];

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(...args: any[]) {
    this.actions.push({ type: 'select', args });
    return this;
  }

  eq(...args: any[]) {
    this.actions.push({ type: 'eq', args });
    return this;
  }

  neq(...args: any[]) {
    this.actions.push({ type: 'neq', args });
    return this;
  }

  ilike(...args: any[]) {
    this.actions.push({ type: 'ilike', args });
    return this;
  }

  order(...args: any[]) {
    this.actions.push({ type: 'order', args });
    return this;
  }

  limit(...args: any[]) {
    this.actions.push({ type: 'limit', args });
    return this;
  }

  single(...args: any[]) {
    this.actions.push({ type: 'single', args });
    return this;
  }

  insert(...args: any[]) {
    this.actions.push({ type: 'insert', args });
    return this;
  }

  update(...args: any[]) {
    this.actions.push({ type: 'update', args });
    return this;
  }

  delete(...args: any[]) {
    this.actions.push({ type: 'delete', args });
    return this;
  }

  // Promise thenable support
  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      const res = await this.execute();
      if (onfulfilled) return onfulfilled(res);
      return res;
    } catch (err: any) {
      const errorRes = { data: null, error: err };
      if (onfulfilled) return onfulfilled(errorRes);
      return errorRes;
    }
  }

  private async execute() {
    const tableData = getLocalTableData(this.tableName);
    let isSingle = false;
    let isInsert = false;
    let isUpdate = false;
    let isDelete = false;

    let insertPayload: any[] = [];
    let updatePayload: any = null;

    let filteredData = [...tableData];

    for (const action of this.actions) {
      if (action.type === 'select') {
        // Keeps structured fields intact. For products, it already has subcategories/product_images nested.
      } else if (action.type === 'single') {
        isSingle = true;
      } else if (action.type === 'limit') {
        const [num] = action.args;
        filteredData = filteredData.slice(0, num);
      } else if (action.type === 'eq') {
        const [column, value] = action.args;
        filteredData = filteredData.filter(row => {
          if (value === null || value === undefined) {
            return row[column] === null || row[column] === undefined;
          }
          // Support searching nested objects or exact key matching
          if (column === 'key') {
            return String(row.key) === String(value);
          }
          return String(row[column] || '') === String(value);
        });
      } else if (action.type === 'neq') {
        const [column, value] = action.args;
        filteredData = filteredData.filter(row => String(row[column] || '') !== String(value));
      } else if (action.type === 'ilike') {
        const [column, pattern] = action.args;
        const clean = String(pattern).replace(/%/g, '').toLowerCase();
        filteredData = filteredData.filter(row => String(row[column] || '').toLowerCase().includes(clean));
      } else if (action.type === 'order') {
        const [column, opts] = action.args;
        const ascending = opts?.ascending !== false;
        filteredData.sort((a, b) => {
          const aVal = a[column];
          const bVal = b[column];
          if (aVal === bVal) return 0;
          if (aVal === null || aVal === undefined) return 1;
          if (bVal === null || bVal === undefined) return -1;
          if (typeof aVal === 'string') {
            return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
          }
          return ascending ? aVal - bVal : bVal - aVal;
        });
      } else if (action.type === 'insert') {
        isInsert = true;
        insertPayload = Array.isArray(action.args[0]) ? action.args[0] : [action.args[0]];
      } else if (action.type === 'update') {
        isUpdate = true;
        updatePayload = action.args[0];
      } else if (action.type === 'delete') {
        isDelete = true;
      }
    }

    if (isInsert) {
      const newRecords = insertPayload.map(r => ({
        id: r.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2)),
        created_at: new Date().toISOString(),
        ...r
      }));
      const updatedTable = [...tableData, ...newRecords];
      saveLocalTableData(this.tableName, updatedTable);
      return { data: isSingle ? newRecords[0] : newRecords, error: null };
    }

    if (isUpdate) {
      const targetIds = new Set(filteredData.map(r => r.id || r.key));
      const updatedTable = tableData.map(row => {
        const keyVal = row.id || row.key;
        if (targetIds.has(keyVal)) {
          return { ...row, ...updatePayload };
        }
        return row;
      });
      saveLocalTableData(this.tableName, updatedTable);
      const updatedRows = updatedTable.filter(row => targetIds.has(row.id || row.key));
      return { data: isSingle ? updatedRows[0] : updatedRows, error: null };
    }

    if (isDelete) {
      const targetIds = new Set(filteredData.map(r => r.id || r.key));
      const updatedTable = tableData.filter(row => !targetIds.has(row.id || row.key));
      saveLocalTableData(this.tableName, updatedTable);
      return { data: filteredData, error: null };
    }

    return {
      data: isSingle ? (filteredData[0] || null) : filteredData,
      error: null
    };
  }
}

// Mock Realtime Channel Setup
class MockChannel {
  on(event: string, filter: any, callback: () => void) {
    return this;
  }
  subscribe() {
    return this;
  }
}

// 3. Create real Supabase client as fallback
const realSupabase = createClient(supabaseUrl, supabaseAnonKey);

// 4. Wrap with proxy to transparently intercept .from() calls
export const supabase = new Proxy(realSupabase, {
  get(target, prop, receiver) {
    if (prop === 'from') {
      return (tableName: string) => {
        return new MockSupabaseQuery(tableName);
      };
    }
    if (prop === 'channel') {
      return (name: string) => {
        return new MockChannel();
      };
    }
    if (prop === 'removeChannel') {
      return () => {};
    }
    return Reflect.get(target, prop, receiver);
  }
});
