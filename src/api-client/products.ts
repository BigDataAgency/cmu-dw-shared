import { get, post, patch } from "./fetch";
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
} from "../types/product";
import type {
  PaginationParams,
  SearchParams,
  PaginatedResponse,
} from "../types/pagination";

export type ProductFilters = PaginationParams &
  SearchParams & {
    category?: string;
    is_active?: boolean;
    pos_stock_exempt?: boolean;
    pos_sellable?: boolean;
  };

export type UpdateStockPayload = {
  qty: number;
  type:
    | "stock_in"
    | "stock_out"
    | "adjust"
    | "return"
    | "internal_use"
    | "pickup_out";
  notes?: string;
};

export type AdjustStockPayload = {
  qty: number;
  notes: string;
};

export type EmptyTankAdjustResult = {
  product_id: string;
  name: string;
  before: number;
  after: number;
};

export type InternalUsePayload = {
  qty: number;
  reason: string;
};

export type InternalUseResult = {
  success: boolean;
  product: Pick<Product, "id" | "sku" | "name" | "stock_qty">;
};

/** 047 — GET /products/stock-transactions: ประวัติสต็อกสำนักงานล่าสุด (admin_property, staff_property, super_admin) */
export type StockTransactionRow = {
  id: string;
  type: string;
  quantity: number;
  notes: string | null;
  created_at: string;
  product_id: string;
  product_name: string | null;
  /** office_delivery_receipt = รับเข้าจากใบส่งของ · office_delivery_reversal = คืนสต็อกจากการยกเลิก */
  reference_type: string | null;
  delivery_note_number: string | null;
};

export const productsApi = {
  /** 047 — limit 1–200 (ค่าเริ่มต้น 20) */
  listStockTransactions: (limit = 20): Promise<StockTransactionRow[]> =>
    get("/products/stock-transactions", { limit }),

  list: (filters?: ProductFilters): Promise<PaginatedResponse<Product>> =>
    get("/products", filters as Record<string, unknown>),

  getById: (id: string): Promise<Product> => get(`/products/${id}`),

  create: (payload: CreateProductPayload): Promise<Product> =>
    post("/products", payload),

  update: (id: string, payload: UpdateProductPayload): Promise<Product> =>
    patch(`/products/${id}`, payload),

  updateStock: (id: string, payload: UpdateStockPayload): Promise<void> =>
    patch(`/products/${id}/stock`, payload),

  adjustStock: (id: string, payload: AdjustStockPayload): Promise<void> =>
    patch(`/products/${id}/stock`, {
      qty: payload.qty,
      type: "adjust",
      notes: payload.notes,
    }),

  adjustEmptyTanks: (
    id: string,
    payload: AdjustStockPayload
  ): Promise<EmptyTankAdjustResult> =>
    patch(`/products/${id}/empty-tanks`, payload),

  internalUse: (
    id: string,
    payload: InternalUsePayload
  ): Promise<InternalUseResult> =>
    post(`/products/${id}/internal-use`, payload),
};
