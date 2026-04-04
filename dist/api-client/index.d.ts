import { Order, Delivery, DeliveryDetail, RoutePlan, GenerateRoutePayload, ConfirmRoutePayload, ReorderStopsPayload, MoveStopPayload, Product, CreateProductPayload, UpdateProductPayload, Profile, UpdateProfilePayload, Address, AddressPayload, Document, SendNotificationPayload, Notification, PushSubscriptionPayload, SendToAgencyPayload, SendToAgencyResult, NotificationChannel } from '../types/index.js';

declare function configure(options: {
    baseUrl: string;
    getToken: () => Promise<string | null>;
    anonKey?: string;
}): void;
declare class ApiError extends Error {
    status: number;
    constructor(status: number, message: string);
}

type OrderSource = 'pos_walkin' | 'pos_delivery' | 'online' | 'phone' | 'agent';
type PaymentMethod = 'cash' | 'qr_promptpay' | 'payroll_deduction' | 'invoice_billing';
type CreateOrderPayload = {
    items: {
        product_id: string;
        quantity: number;
    }[];
    address: {
        address_id?: string;
        address?: string;
        lat?: number;
        lng?: number;
    };
    payment: PaymentMethod;
    source?: OrderSource;
    purchase_right_id?: string;
    scheduled_date?: string;
    scheduled_time_slot?: string;
    delivery_notes?: string;
    discount_amount?: number;
};
type CancelOrderPayload = {
    reason: string;
};
type ReturnBottlesPayload = {
    return_items: {
        order_item_id: string;
        return_qty: number;
    }[];
    customer_id?: string;
};
type OrderFilters = {
    status?: string;
    source?: string;
    date_from?: string;
    date_to?: string;
};
type UpdateOrderStatusPayload = {
    status: string;
    note?: string;
};
declare const ordersApi: {
    list: (filters?: OrderFilters) => Promise<Order[]>;
    getById: (id: string) => Promise<Order>;
    create: (payload: CreateOrderPayload) => Promise<Order>;
    cancel: (id: string, payload: CancelOrderPayload) => Promise<void>;
    updateStatus: (id: string, payload: UpdateOrderStatusPayload) => Promise<unknown>;
    returnBottles: (id: string, payload: ReturnBottlesPayload) => Promise<unknown>;
};

type AssignDeliveryPayload = {
    order_id: string;
    driver_id?: string | null;
    vehicle_id?: string | null;
    items?: {
        order_item_id: string;
        quantity: number;
    }[];
    scheduled_date?: string;
};
type AssignDriverPayload = {
    driver_id: string | null;
    vehicle_id: string | null;
};
type UpdateDeliveredQtyPayload = {
    delivered_qty: number;
};
type CompleteDeliveryPayload = {
    photos?: string[];
    signature?: string;
    qr_data?: Record<string, unknown>;
};
type CancelDeliveryPayload = {
    reason: string;
};
type UpdateDeliveryStatusPayload = {
    status: 'pending_assign' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed' | 'rejected' | 'force_delivered' | 'cancelled';
    metadata?: Record<string, unknown>;
};
type DeliveryFilters = {
    driver_id?: string;
    status?: string;
    date?: string;
};
declare const deliveriesApi: {
    list: (filters?: DeliveryFilters) => Promise<Delivery[]>;
    getById: (id: string) => Promise<DeliveryDetail>;
    assign: (payload: AssignDeliveryPayload) => Promise<string>;
    updateStatus: (id: string, payload: UpdateDeliveryStatusPayload) => Promise<void>;
    complete: (id: string, payload?: CompleteDeliveryPayload) => Promise<void>;
    cancel: (id: string, payload: CancelDeliveryPayload) => Promise<void>;
    updateItemQty: (itemId: string, payload: UpdateDeliveredQtyPayload) => Promise<void>;
    assignDriver: (id: string, payload: AssignDriverPayload) => Promise<void>;
};

type RouteFilters = {
    driver_id?: string;
    date?: string;
    status?: string;
};
type AddStopPayload = {
    order_id: string;
    sequence?: number;
};
declare const routesApi: {
    list: (filters?: RouteFilters) => Promise<RoutePlan[]>;
    getById: (id: string) => Promise<RoutePlan>;
    getUnassignedOrders: (date?: string) => Promise<unknown[]>;
    generate: (payload: GenerateRoutePayload) => Promise<RoutePlan[]>;
    confirm: (id: string, payload?: ConfirmRoutePayload) => Promise<void>;
    reorderStops: (id: string, payload: ReorderStopsPayload) => Promise<void>;
    moveStop: (id: string, payload: MoveStopPayload) => Promise<void>;
    addStop: (id: string, payload: AddStopPayload) => Promise<string>;
    removeStop: (stopId: string) => Promise<void>;
};

type ProductFilters = {
    category?: string;
    is_active?: boolean;
};
type UpdateStockPayload = {
    qty: number;
    type: 'stock_in' | 'stock_out' | 'adjust' | 'return';
    notes?: string;
};
declare const productsApi: {
    list: (filters?: ProductFilters) => Promise<Product[]>;
    getById: (id: string) => Promise<Product>;
    create: (payload: CreateProductPayload) => Promise<Product>;
    update: (id: string, payload: UpdateProductPayload) => Promise<Product>;
    updateStock: (id: string, payload: UpdateStockPayload) => Promise<void>;
};

declare const usersApi: {
    getMe: () => Promise<Profile>;
    updateMe: (payload: UpdateProfilePayload) => Promise<Profile>;
    getPurchaseRights: () => Promise<{
        can_purchase: boolean;
        reason?: string;
    }>;
    getMyOrders: () => Promise<Order[]>;
    getAddresses: () => Promise<Address[]>;
    addAddress: (payload: AddressPayload) => Promise<Address>;
    updateAddress: (id: string, payload: Partial<AddressPayload>) => Promise<Address>;
    deleteAddress: (id: string) => Promise<void>;
    setDefaultAddress: (id: string) => Promise<void>;
};

type DocumentFilters = {
    customer_id?: string;
    status?: string;
};
type ApproveVoidPayload = {
    void_request_id: string;
    corrections?: Record<string, unknown>;
};
type RejectVoidPayload = {
    void_request_id: string;
    rejection_reason: string;
};
type SettleDebtPayload = {
    agency_id: string;
    amount: number;
    reference?: string;
};
declare const financeApi: {
    listInvoices: (filters?: DocumentFilters) => Promise<Document[]>;
    listReceipts: (filters?: DocumentFilters) => Promise<Document[]>;
    approveVoidReissue: (payload: ApproveVoidPayload) => Promise<unknown>;
    rejectVoidReissue: (payload: RejectVoidPayload) => Promise<void>;
    settleDebt: (payload: SettleDebtPayload) => Promise<unknown>;
};

declare const notificationsApi: {
    send: (payload: SendNotificationPayload) => Promise<void>;
    list: () => Promise<Notification[]>;
    markRead: (id: string) => Promise<void>;
    subscribe: (payload: PushSubscriptionPayload) => Promise<void>;
    unsubscribe: (endpoint: string) => Promise<void>;
    sendToAgency: (payload: SendToAgencyPayload) => Promise<SendToAgencyResult>;
};

type GeneratePdfPayload = {
    document_id: string;
    type: 'invoice' | 'receipt';
};
declare const documentsApi: {
    generatePdf: (payload: GeneratePdfPayload) => Promise<{
        url: string;
    }>;
    getById: (id: string) => Promise<Document>;
};

type ContainerScanType = 'load_truck' | 'deliver' | 'collect_return' | 'pos_return' | 'receive_depot' | 'audit' | 'unload_truck';
type BatchScanPayload = {
    qr_codes: string[];
    scan_type: ContainerScanType;
    vehicle_id?: string | null;
    delivery_id?: string | null;
};
type UpdateContainerStatusPayload = {
    new_status: string;
    notes?: string | null;
};
type DriverCollectCustomer = {
    customer_id: string;
    customer_name: string;
    agency_name: string | null;
    container_count: number;
};
type UnloadPayload = {
    qr_codes: string[];
    vehicle_id?: string | null;
};
type UnloadResult = {
    container_id: string;
    qr_code: string;
    status_before: string;
    status_after: string;
    scan_type_used: string;
    result_flag: string;
};
type CreateContainersBatchPayload = {
    count: number;
    product_id?: string | null;
    notes?: string | null;
};
type ContainerBatchResult = {
    container_id: string;
    qr_code: string;
    product_id: string | null;
    status: string;
    created_at: string;
};
type ContainerQrData = {
    container_id: string;
    qr_code: string;
    product_name: string | null;
    product_sku: string | null;
    status: string;
    registered_at: string;
};
declare const CONTAINER_QR_PATTERN: RegExp;
declare const isValidContainerQR: (qr: string) => boolean;
declare const containersApi: {
    list: () => Promise<unknown[]>;
    getSummary: () => Promise<unknown[]>;
    getScanHistory: (id: string) => Promise<unknown[]>;
    scan: (payload: BatchScanPayload) => Promise<unknown[]>;
    updateStatus: (id: string, payload: UpdateContainerStatusPayload) => Promise<void>;
    genQr: (payload: CreateContainersBatchPayload) => Promise<ContainerBatchResult[]>;
    getCollectCustomers: () => Promise<DriverCollectCustomer[]>;
    unload: (payload: UnloadPayload) => Promise<UnloadResult[]>;
    getQrData: (id: string) => Promise<ContainerQrData>;
};

type Holiday = {
    id: string;
    date: string;
    end_date: string | null;
    name: string;
    is_recurring: boolean;
    is_active: boolean;
    source: string;
    created_by: string | null;
    created_at: string;
};
type CreateHolidayPayload = {
    date: string;
    end_date?: string | null;
    name: string;
    is_recurring?: boolean;
    is_active?: boolean;
};
type UpdateHolidayPayload = Partial<CreateHolidayPayload>;
type SyncGoogleResult = {
    imported: number;
    skipped: number;
    total: number;
};
type AddSundaysResult = {
    inserted: number;
    skipped: number;
    total: number;
};
type HolidaySettings = {
    delivery_sunday_off?: boolean;
};
declare const holidaysApi: {
    getSettings: () => Promise<HolidaySettings>;
    updateSettings: (settings: HolidaySettings) => Promise<{
        updated: boolean;
    }>;
    list: (params?: {
        year?: number;
    }) => Promise<Holiday[]>;
    create: (payload: CreateHolidayPayload) => Promise<Holiday>;
    update: (id: string, payload: UpdateHolidayPayload) => Promise<Holiday>;
    toggleActive: (id: string, is_active: boolean) => Promise<Holiday>;
    remove: (id: string) => Promise<void>;
    addSundays: (year: number) => Promise<AddSundaysResult>;
    syncGoogle: (year: number) => Promise<SyncGoogleResult>;
};

interface SettingsMap {
    [key: string]: unknown;
    daily_order_limits?: Record<string, number>;
    delivery_sunday_off?: boolean;
    order_cutoff_time?: string;
    min_order_quantity?: number;
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
}
interface UpdateSettingPayload {
    key: string;
    value: unknown;
}
declare const settingsApi: {
    /** Admin: อ่าน settings ทั้งหมด (requires admin_property / executive / staff_property) */
    getAdmin: () => Promise<SettingsMap>;
    /** Admin: อัปเดต setting key เดียว */
    patchAdmin: (key: string, value: unknown) => Promise<{
        updated: boolean;
    }>;
    /** Vendor: อ่าน settings เฉพาะ vendor keys */
    getVendor: () => Promise<SettingsMap>;
    /** Vendor: อัปเดต vendor setting key เดียว */
    patchVendor: (key: string, value: unknown) => Promise<{
        updated: boolean;
    }>;
};

type RecipientStrategy = 'trigger_user' | 'role_based' | 'agency_members';
interface NotificationConfig {
    id: string;
    event_key: string;
    notification_type: string;
    enabled: boolean;
    channels: NotificationChannel[];
    recipient_strategy: RecipientStrategy;
    recipient_roles: string[];
    title_template: string;
    body_template: string;
    description: string | null;
    is_system: boolean;
    created_at: string;
    updated_at: string;
}
interface UpdateNotificationConfigPayload {
    enabled?: boolean;
    channels?: NotificationChannel[];
    recipient_strategy?: RecipientStrategy;
    recipient_roles?: string[];
    title_template?: string;
    body_template?: string;
}
declare const notificationConfigsApi: {
    /** List all notification configs */
    list: () => Promise<NotificationConfig[]>;
    /** Get single notification config by ID */
    getById: (id: string) => Promise<NotificationConfig>;
    /** Update notification config */
    update: (id: string, payload: UpdateNotificationConfigPayload) => Promise<NotificationConfig>;
};

export { type AddSundaysResult, ApiError, type BatchScanPayload, CONTAINER_QR_PATTERN, type ContainerBatchResult, type ContainerQrData, type ContainerScanType, type CreateContainersBatchPayload, type CreateHolidayPayload, type DriverCollectCustomer, type Holiday, type HolidaySettings, type NotificationConfig, type RecipientStrategy, type SettingsMap, type SyncGoogleResult, type UnloadPayload, type UnloadResult, type UpdateContainerStatusPayload, type UpdateHolidayPayload, type UpdateNotificationConfigPayload, type UpdateSettingPayload, configure, containersApi, deliveriesApi, documentsApi, financeApi, holidaysApi, isValidContainerQR, notificationConfigsApi, notificationsApi, ordersApi, productsApi, routesApi, settingsApi, usersApi };
