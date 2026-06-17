import { get, patch } from "./fetch";

export type HolidayOrderPolicy = "skip" | "shift_next" | "shift_prev";

export interface SettingsMap {
  [key: string]: unknown;
  daily_order_limits?: Record<string, number>;
  delivery_sunday_off?: boolean;
  order_cutoff_time?: string;
  min_order_quantity?: number;
  min_order_advance_days?: number;
  max_order_advance_days?: number;
  auto_approve_enabled?: boolean;
  admin_same_day_order?: boolean;
  holiday_order_policy?: HolidayOrderPolicy;
  holiday_notify_days_before?: number;
  route_plan_cutoff_time?: string;
  route_plan_auto_generate?: boolean;
  route_plan_target_days_ahead?: number;
  office_contact?: Record<string, string>;
  registration_contact?: Record<string, string>;
  receipt_config?: Record<string, unknown>;
  overdue_block_enabled?: boolean;
  overdue_block_threshold_days?: number;
  overdue_block_roles?: string[];
  overdue_block_customer_groups?: string[];
  pdf_encryption_enabled?: boolean;
  pickup_discount_pct?: number;
  // F4 — ส่วนลดชำระล่วงหน้า (QR): default 1฿/แพ็ค, override ต่อกลุ่มได้ที่ customer_groups
  qr_discount_config?: {
    enabled?: boolean;
    mode?: 'baht_per_pack' | 'percent';
    value?: number;
  };
  // v1.55 (meeting item 6 §3) — Global Settings
  /** เปิด/ปิดคิวอีเมลเบิกจ่ายรายขั้นตอน (submitted/approved/rejected/treasury_rejected) */
  disbursement_email_toggles?: Record<string, boolean>;
  /** หัวกระดาษใบส่งของ 80mm — render-pdf fallback ค่าเดิมถ้าไม่ตั้ง */
  delivery_note_config?: { header_lines?: string[] };
  /** ข้อความ org tag บนสติกเกอร์ถัง */
  sticker_config?: { org_tag?: string };
  /** เพดานรวมแพ็ค/วันส่ง (ทุกสินค้า) — 0 = ไม่จำกัด; คู่กับ daily_order_limits */
  daily_delivery_cap?: number;
  // v1.56 — กองคลัง
  /** อีเมลกองคลังรับแจ้งเตือนเอกสารเบิกจ่ายถึง (Phase 1) */
  treasury_notify_emails?: string[];
  // v1.56 Phase 2
  /** true = การเงินต้อง confirm สรุปยอด QR ก่อนข้ามให้บัญชี approve (false = ข้ามขั้น) */
  qr_summary_require_finance_confirm?: boolean;
  /** column mapping ของไฟล์ bank statement — {} จนกว่าได้ไฟล์จริง (engine BLOCKED) */
  bank_statement_column_mapping?: Record<string, unknown>;
  /** จำนวนวันเกินกำหนดถือเป็นค้างชำระ (receivables aging — documents ไม่มี due_date) */
  receivable_overdue_threshold_days?: number;
}

export interface UpdateSettingPayload {
  key: string;
  value: unknown;
}

export const settingsApi = {
  /** Admin: อ่าน settings ทั้งหมด (requires admin_property / executive / staff_property) */
  getAdmin: (): Promise<SettingsMap> => get("/admin/settings"),

  /** Admin: อัปเดต setting key เดียว */
  patchAdmin: (key: string, value: unknown): Promise<{ updated: boolean }> =>
    patch("/admin/settings", { key, value }),

  /** Vendor: อ่าน settings เฉพาะ vendor keys */
  getVendor: (): Promise<SettingsMap> => get("/routes/settings"),

  /** Vendor: อัปเดต vendor setting key เดียว */
  patchVendor: (key: string, value: unknown): Promise<{ updated: boolean }> =>
    patch("/routes/settings", { key, value }),
};
