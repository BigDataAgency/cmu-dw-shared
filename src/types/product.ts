export type CustomerGroup = "general" | "university" | "wholesale" | "vip";

export type ProductPrice = {
  id: string;
  customer_group: CustomerGroup;
  price: number;
  unit: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string | null;
  category: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  stock_qty: number;
  empty_tank_qty?: number;
  is_returnable?: boolean;
  low_stock_threshold: number | null;
  price: number | null;
  deposit_price: number | null;
  pos_stock_exempt?: boolean;
  is_pos_sellable?: boolean;
  size?: string | null; // ขนาดสินค้า (v1.50)
  unit?: string | null; // หน่วยนับ กล่อง/แพค/โหล/ลัง/ถัง (v1.50)
  vendor_id?: string | null; // บริษัทผู้ส่งเจ้าของสินค้า
  vendors?: { brand_name: string } | null; // ยี่ห้อที่แสดงให้ผู้ใช้เห็น
  prices: ProductPrice[];
  created_at: string;
  updated_at: string;
};

export type CreateProductPayload = {
  name: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  size?: string | null;
  unit?: string | null;
  is_pos_sellable?: boolean;
  prices?: Omit<ProductPrice, "id">[];
};

export type UpdateProductPayload = Partial<CreateProductPayload>;
