import { PaginationParams, SearchParams, PaginatedResponse, Order, Delivery, DeliveryDetail, RoutePlan, GenerateRoutePayload, ConfirmRoutePayload, ReorderStopsPayload, MoveStopPayload, Product, CreateProductPayload, UpdateProductPayload, DbAppRole, Profile, UpdateProfilePayload, Address, AddressPayload, ExportedData, Document, SendNotificationPayload, Notification, PushSubscriptionPayload, SendToAgencyPayload, SendToAgencyResult, DocumentType, PaymentMethod as PaymentMethod$1, NotificationChannel, ServerStatus, EligibleReceivablesFilters, EligibleReceivable, DisbursementGroupListFilters, DisbursementGroup, DisbursementTimelineEvent, CreateDisbursementGroupPayload, ApproveDisbursementPayload, RejectDisbursementPayload, TreasuryExportPayload, TreasuryExportResult, DisbursementExportBatch, FacultyCreditorAccount, FacultyCreditorUpsertPayload, DisbursementApprovalConfig, DisbursementApprovalConfigUpsertPayload, EmailOutboxStatus, DisbursementEmailOutboxRow } from '../types/index.js';

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
type DeliveryType = 'delivery' | 'pickup';
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
    delivery_type?: DeliveryType;
    /** Admin proxy: when set, order is created on behalf of this user. Caller must have staff_property/admin_property/super_admin role. */
    target_user_id?: string;
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
type OrderFilters = PaginationParams & SearchParams & {
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
    list: (filters?: OrderFilters) => Promise<PaginatedResponse<Order>>;
    getById: (id: string) => Promise<Order>;
    create: (payload: CreateOrderPayload) => Promise<Order>;
    cancel: (id: string, payload: CancelOrderPayload) => Promise<void>;
    updateStatus: (id: string, payload: UpdateOrderStatusPayload) => Promise<unknown>;
    returnBottles: (id: string, payload: ReturnBottlesPayload) => Promise<unknown>;
    listCreditNotes: (id: string) => Promise<OrderCreditNote[]>;
    createCreditNote: (id: string, payload: CreateCreditNotePayload) => Promise<OrderCreditNote>;
};
type CreateCreditNotePayload = {
    reason: string;
    external_ref?: string | null;
    amount: number;
};
type OrderCreditNote = {
    id: string;
    order_id: string;
    disbursement_group_id: string | null;
    reason: string;
    external_ref: string | null;
    amount: number;
    created_by: string;
    created_at: string;
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
type BatchCompletePayload = {
    delivery_ids: string[];
    photos?: string[];
    recipient_name: string;
};
type BatchCompleteResult = {
    results: Array<{
        id: string;
        status: 'ok' | 'error';
        message?: string;
    }>;
    total: number;
    success: number;
    failed: number;
};
type DeliveryFilters = PaginationParams & SearchParams & {
    driver_id?: string;
    status?: string;
    date?: string;
    date_from?: string;
    date_to?: string;
    order_id?: string;
};
declare const deliveriesApi: {
    list: (filters?: DeliveryFilters) => Promise<PaginatedResponse<Delivery>>;
    getById: (id: string) => Promise<DeliveryDetail>;
    assign: (payload: AssignDeliveryPayload) => Promise<string>;
    updateStatus: (id: string, payload: UpdateDeliveryStatusPayload) => Promise<void>;
    complete: (id: string, payload?: CompleteDeliveryPayload) => Promise<void>;
    cancel: (id: string, payload: CancelDeliveryPayload) => Promise<void>;
    updateItemQty: (itemId: string, payload: UpdateDeliveredQtyPayload) => Promise<void>;
    assignDriver: (id: string, payload: AssignDriverPayload) => Promise<void>;
    completeBatch: (payload: BatchCompletePayload) => Promise<BatchCompleteResult>;
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

type ProductFilters = PaginationParams & SearchParams & {
    category?: string;
    is_active?: boolean;
    pos_stock_exempt?: boolean;
};
type UpdateStockPayload = {
    qty: number;
    type: 'stock_in' | 'stock_out' | 'adjust' | 'return' | 'internal_use' | 'pickup_out';
    notes?: string;
};
type AdjustStockPayload = {
    qty: number;
    notes: string;
};
type InternalUsePayload = {
    qty: number;
    reason: string;
};
type InternalUseResult = {
    success: boolean;
    product: Pick<Product, 'id' | 'sku' | 'name' | 'stock_qty'>;
};
declare const productsApi: {
    list: (filters?: ProductFilters) => Promise<PaginatedResponse<Product>>;
    getById: (id: string) => Promise<Product>;
    create: (payload: CreateProductPayload) => Promise<Product>;
    update: (id: string, payload: UpdateProductPayload) => Promise<Product>;
    updateStock: (id: string, payload: UpdateStockPayload) => Promise<void>;
    adjustStock: (id: string, payload: AdjustStockPayload) => Promise<void>;
    internalUse: (id: string, payload: InternalUsePayload) => Promise<InternalUseResult>;
};

type AdminAppRole = DbAppRole;
type AccountStatus = 'pending_approval' | 'active' | 'suspended';
interface UpdateStatusPayload {
    status: AccountStatus;
    reason?: string;
}
interface AssignPurchaseRightPayload {
    customer_group_id: string;
    billing_name?: string;
    billing_address?: string;
    billing_tax_id?: string;
    is_default?: boolean;
}
interface UserPurchaseRightRow {
    right_id: string;
    group_id: string;
    group_name: string;
    group_code: string;
    billing_name: string | null;
    billing_address: string | null;
    billing_tax_id: string | null;
    document_preference: string | null;
    is_default: boolean;
}
interface MapUserPayload {
    approve?: boolean;
    roles?: AdminAppRole[];
    rights?: AssignPurchaseRightPayload[];
    /**
     * v1.43.0 Option G — pick a customer_group whose agency_id will be copied to
     * profiles.agency_id (disbursement scope). Pass `null` to clear. Omit to leave
     * the existing primary employer untouched.
     */
    primary_employer_group_id?: string | null;
    /**
     * v1.50 — "เปิดการใช้งานสั่ง order ส่วนบุคคล". true → create/keep a per-user personal
     * customer_group (standalone, parent_id NULL) + assign right. false → revoke + deactivate.
     * Omit to leave personal ordering untouched. Faculty/agency rights are managed
     * separately via the `rights[]` cascade — personal vs agency are independent.
     */
    personal_order_enabled?: boolean;
}
interface MapUserResult {
    user_id: string;
    approved: boolean;
    roles: AdminAppRole[];
    rights: string[];
    agency_id?: string | null;
    personal_group_id?: string | null;
}
interface AdminUpdateProfilePayload {
    full_name?: string;
    phone_number?: string;
    email?: string;
    avatar_url?: string;
    billing_name?: string;
    billing_address?: string;
    billing_tax_id?: string;
}
declare const usersAdminApi: {
    updateProfile: (userId: string, payload: AdminUpdateProfilePayload) => Promise<{
        user_id: string;
    } & AdminUpdateProfilePayload>;
    updateStatus: (userId: string, payload: UpdateStatusPayload) => Promise<{
        user_id: string;
        account_status: AccountStatus;
    }>;
    listRoles: (userId: string) => Promise<{
        role: AdminAppRole;
        created_at: string;
    }[]>;
    assignRole: (userId: string, role: AdminAppRole) => Promise<{
        user_id: string;
        role: AdminAppRole;
    }>;
    revokeRole: (userId: string, role: AdminAppRole) => Promise<void>;
    listPurchaseRights: (userId: string) => Promise<UserPurchaseRightRow[]>;
    assignPurchaseRight: (userId: string, payload: AssignPurchaseRightPayload) => Promise<{
        id: string;
    }>;
    revokePurchaseRight: (userId: string, customerGroupId: string) => Promise<void>;
    mapUser: (userId: string, payload: MapUserPayload) => Promise<MapUserResult>;
};

interface BillingInfoRow {
    billing_name: string | null;
    billing_address: string | null;
    billing_tax_id: string | null;
    document_preference: 'receipt' | 'voucher';
}
type UserFilters = PaginationParams & SearchParams & {
    role?: string;
    status?: string;
};
declare const usersApi: {
    list: (filters?: UserFilters) => Promise<PaginatedResponse<Profile>>;
    getMe: () => Promise<Profile>;
    updateMe: (payload: UpdateProfilePayload) => Promise<Profile>;
    getPurchaseRights: () => Promise<{
        can_purchase: boolean;
        reason?: string;
    }>;
    getMyAccess: () => Promise<{
        can_access: boolean;
    }>;
    getMyPurchaseRightsList: () => Promise<UserPurchaseRightRow[]>;
    setDefaultPurchaseRight: (customerGroupId: string) => Promise<{
        right_id: string;
        customer_group_id: string;
    }>;
    getMyOrders: () => Promise<Order[]>;
    getAddresses: () => Promise<Address[]>;
    addAddress: (payload: AddressPayload) => Promise<Address>;
    updateAddress: (id: string, payload: Partial<AddressPayload>) => Promise<Address>;
    deleteAddress: (id: string) => Promise<void>;
    setDefaultAddress: (id: string) => Promise<void>;
    exportMyData: () => Promise<ExportedData>;
    getPurchaseRightsFor: (userId: string) => Promise<UserPurchaseRightRow[]>;
    resolveBillingFor: (userId: string, rightId: string) => Promise<BillingInfoRow | null>;
};

type DebtRow = {
    id: string;
    name: string;
    current_debt: number;
    contact_person?: string | null;
    phone?: string | null;
    tax_id?: string | null;
};
type DebtFilters = PaginationParams & SearchParams;
type DocumentFilters$1 = {
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
type SupportFeeFilters = {
    start_date?: string;
    end_date?: string;
    user_id?: string;
    customer_group_id?: string;
};
type SupportFeeRow = {
    user_id: string;
    user_name: string;
    customer_group_code: string;
    customer_group_name: string;
    month: string;
    order_count: number;
    total_support_fee: number;
    gross_sales: number;
    total_cost: number;
};
declare const financeApi: {
    listInvoices: (filters?: DocumentFilters$1) => Promise<Document[]>;
    listReceipts: (filters?: DocumentFilters$1) => Promise<Document[]>;
    approveVoidReissue: (payload: ApproveVoidPayload) => Promise<unknown>;
    rejectVoidReissue: (payload: RejectVoidPayload) => Promise<void>;
    settleDebt: (payload: SettleDebtPayload) => Promise<unknown>;
    getSupportFees: (filters?: SupportFeeFilters) => Promise<SupportFeeRow[]>;
    listDebt: (filters?: DebtFilters) => Promise<PaginatedResponse<DebtRow>>;
};

declare const notificationsApi: {
    send: (payload: SendNotificationPayload) => Promise<void>;
    list: () => Promise<Notification[]>;
    markRead: (id: string) => Promise<void>;
    subscribe: (payload: PushSubscriptionPayload) => Promise<void>;
    unsubscribe: (endpoint: string) => Promise<void>;
    sendToAgency: (payload: SendToAgencyPayload) => Promise<SendToAgencyResult>;
};

type DocumentFilters = PaginationParams & SearchParams & {
    type?: string;
    date_from?: string;
    date_to?: string;
};
type GeneratePdfPayload = {
    document_id: string;
    type: DocumentType;
    delivery_id?: string;
};
type BatchPrintResult = {
    urls: string[];
    errors: Array<{
        id: string;
        message: string;
    }>;
    total: number;
};
type BatchPrintDocType = 'delivery_note';
declare const documentsApi: {
    list: (filters?: DocumentFilters) => Promise<PaginatedResponse<Document>>;
    generatePdf: (payload: GeneratePdfPayload) => Promise<{
        url: string;
        encrypted: boolean;
    }>;
    getById: (id: string) => Promise<Document>;
    batchPrint: (deliveryIds: string[], docType?: BatchPrintDocType) => Promise<BatchPrintResult>;
    printContainerLabels: (containerIds: string[]) => Promise<BatchPrintResult>;
};

type ContainerFilters = PaginationParams & SearchParams & {
    status?: string;
    product_id?: string;
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
type OutstandingContainer = {
    container_id: string;
    qr_code: string;
    product_name: string | null;
    current_customer_id: string | null;
    customer_name: string | null;
    agency_name: string | null;
    current_driver_id: string | null;
    driver_name: string | null;
    last_scanned_at: string | null;
    days_outstanding: number;
};
declare const CONTAINER_QR_PATTERN: RegExp;
declare const isValidContainerQR: (qr: string) => boolean;
declare const containersApi: {
    list: (filters?: ContainerFilters) => Promise<PaginatedResponse<unknown>>;
    getSummary: () => Promise<unknown[]>;
    getScanHistory: (id: string) => Promise<unknown[]>;
    scan: (payload: BatchScanPayload) => Promise<unknown[]>;
    updateStatus: (id: string, payload: UpdateContainerStatusPayload) => Promise<void>;
    genQr: (payload: CreateContainersBatchPayload) => Promise<ContainerBatchResult[]>;
    getCollectCustomers: () => Promise<DriverCollectCustomer[]>;
    unload: (payload: UnloadPayload) => Promise<UnloadResult[]>;
    getQrData: (id: string) => Promise<ContainerQrData>;
    getOutstanding: (daysMin?: number) => Promise<OutstandingContainer[]>;
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

type HolidayOrderPolicy = "skip" | "shift_next" | "shift_prev";
interface SettingsMap {
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

interface PaymentMethodConfig {
    payment_method: PaymentMethod$1;
    is_enabled: boolean;
}
interface UserPaymentMethodsResponse {
    methods: PaymentMethod$1[];
}
interface AdminUserPaymentResponse {
    user_id: string;
    agency_id: string | null;
    cmu_employee_id: string | null;
    config: PaymentMethodConfig[];
    resolved: PaymentMethod$1[];
}
interface AgencyPaymentResponse {
    agency_id: string;
    config: PaymentMethodConfig[];
}
declare const paymentMethodsApi: {
    /** Customer: ดูว่าตัวเองใช้วิธีชำระอะไรได้ (v1.48: ตาม context/customer_group ที่เลือก) */
    getMyMethods: (customerGroupId?: string) => Promise<UserPaymentMethodsResponse>;
    /** Admin: ดู config + resolved methods ของ user */
    getForUser: (userId: string) => Promise<AdminUserPaymentResponse>;
    /** Admin: set user payment method overrides */
    setForUser: (userId: string, methods: PaymentMethodConfig[]) => Promise<{
        updated: boolean;
    }>;
    /** Admin: clear user overrides (fallback to agency/default) */
    clearForUser: (userId: string) => Promise<{
        cleared: boolean;
    }>;
    /** Admin: ดู agency payment config */
    getForAgency: (agencyId: string) => Promise<AgencyPaymentResponse>;
    /** Admin: set agency payment method config */
    setForAgency: (agencyId: string, methods: PaymentMethodConfig[]) => Promise<{
        updated: boolean;
    }>;
    /** v1.48 Admin: ดู payment config ของ customer_group (context-bound) */
    getForCustomerGroup: (groupId: string) => Promise<{
        customer_group_id: string;
        config: PaymentMethodConfig[];
    }>;
    /** v1.48 Admin: set payment config ของ customer_group (e.g. คณะ → invoice_billing only) */
    setForCustomerGroup: (groupId: string, methods: PaymentMethodConfig[]) => Promise<{
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

declare const serverStatusApi: {
    get: () => Promise<ServerStatus>;
};

declare const disbursementsApi: {
    listEligible: (filters?: EligibleReceivablesFilters) => Promise<EligibleReceivable[]>;
    listGroups: (filters?: DisbursementGroupListFilters & PaginationParams) => Promise<PaginatedResponse<DisbursementGroup>>;
    getGroup: (id: string) => Promise<DisbursementGroup>;
    getTimeline: (id: string) => Promise<DisbursementTimelineEvent[]>;
    createGroup: (payload: CreateDisbursementGroupPayload) => Promise<DisbursementGroup>;
    submit: (id: string) => Promise<DisbursementGroup>;
    approve: (id: string, payload?: ApproveDisbursementPayload) => Promise<DisbursementGroup>;
    reject: (id: string, payload: RejectDisbursementPayload) => Promise<DisbursementGroup>;
    unlock: (id: string) => Promise<DisbursementGroup>;
    treasuryExport: (payload: TreasuryExportPayload) => Promise<TreasuryExportResult>;
    finalApprove: (id: string) => Promise<DisbursementGroup>;
    finalReject: (id: string, payload: RejectDisbursementPayload) => Promise<DisbursementGroup>;
    treasuryHistory: (filters?: {
        kind?: "faculty" | "office";
    } & PaginationParams) => Promise<PaginatedResponse<DisbursementExportBatch>>;
    listFacultyCreditors: () => Promise<FacultyCreditorAccount[]>;
    upsertFacultyCreditor: (payload: FacultyCreditorUpsertPayload) => Promise<FacultyCreditorAccount>;
    deleteFacultyCreditor: (id: string) => Promise<{
        deleted: boolean;
    }>;
    listApprovalConfig: (agencyId?: string) => Promise<DisbursementApprovalConfig[]>;
    upsertApprovalConfig: (payload: DisbursementApprovalConfigUpsertPayload) => Promise<DisbursementApprovalConfig>;
    deleteApprovalConfig: (id: string) => Promise<{
        deleted: boolean;
    }>;
    listEmailOutbox: (filters?: {
        status?: EmailOutboxStatus;
        limit?: number;
    }) => Promise<DisbursementEmailOutboxRow[]>;
    listPendingDeliveries: (filters: {
        customer_group_id: string;
        agency_id?: string | null;
    }) => Promise<PendingDelivery[]>;
    createGroupV2: (payload: CreateDisbursementGroupV2Payload) => Promise<DisbursementGroup>;
    submitV2: (id: string) => Promise<DisbursementGroup>;
    delegateApprover: (id: string, payload: DelegateApproverPayload) => Promise<{
        new_approver_id: string;
    }>;
    previewPdf: (id: string) => Promise<{
        pdf_url: string;
        encrypted: boolean;
    }>;
};
type PendingDelivery = {
    delivery_id: string;
    delivery_note_number: string;
    delivered_at: string | null;
    order_id: string;
    order_number: string;
    order_total_amount: number;
    delivery_item_count: number;
};
type ApproverInput = {
    name: string;
    position: string;
    email: string;
};
type CreateDisbursementGroupV2Payload = {
    kind: 'faculty' | 'office';
    customer_group_id: string;
    agency_id: string;
    delivery_ids: string[];
    approvers: ApproverInput[];
    external_edoc_id?: string | null;
};
type DelegateApproverPayload = {
    step_number: number;
    new_name: string;
    new_position: string;
    new_email: string;
};
type DisbursementApproverRow = {
    id: string;
    group_id: string;
    step_number: number;
    approver_name: string;
    approver_position: string;
    approver_email: string;
    approver_user_id: string | null;
    delegated_from_id: string | null;
    status: 'pending' | 'sent' | 'opened' | 'approved' | 'rejected' | 'expired' | 'delegated';
    magic_token_expires_at: string | null;
    sent_at: string | null;
    opened_at: string | null;
    decided_at: string | null;
    decision_comment: string | null;
    created_at: string;
};

/**
 * Initialize the public approve client.
 * Call once at app startup. Anon key is sent in apikey header for Supabase Edge runtime.
 */
declare function configureApproveClient(options: {
    baseUrl: string;
    anonKey: string;
}): void;
type ApproveSummary = {
    group_number: string;
    group_kind: 'faculty' | 'office';
    total_amount: number;
    item_count: number;
    agency_name: string;
    customer_group_name: string | null;
    my_step: number;
    my_name: string;
    my_position: string;
    total_steps: number;
    all_approvers: Array<{
        step: number;
        name: string;
        position: string;
        status: string;
        decided_at: string | null;
    }>;
    expires_at: string;
};
type DecisionPayload = {
    decision: 'approve' | 'reject';
    comment?: string | null;
};
type DecisionResult = {
    result: 'advanced' | 'fully_approved' | 'rejected';
    next_step?: number;
    group_status?: string;
};
declare const approveApi: {
    /**
     * Fetch the approver-safe summary for a magic-link token.
     * Side effect: marks the approver row as 'opened' on first call.
     */
    getByToken: (token: string) => Promise<ApproveSummary>;
    /** Submit approve or reject decision. Single-use — server rejects replays with 410. */
    decide: (token: string, payload: DecisionPayload) => Promise<DecisionResult>;
};

type DocumentPreference = 'receipt' | 'voucher';
type ApprovalRule = 'auto_approve' | 'require_admin' | 'require_agency_admin';
interface CustomerGroupRow {
    id: string;
    name: string;
    code: string;
    description: string | null;
    is_default: boolean | null;
    is_active: boolean | null;
    sort_order: number | null;
    billing_name: string | null;
    billing_address: string | null;
    billing_tax_id: string | null;
    document_preference: DocumentPreference | null;
    parent_id: string | null;
    is_prepay: boolean | null;
    is_discount: boolean | null;
    sale_map_allowed: boolean | null;
    is_personal: boolean | null;
    owner_user_id: string | null;
    agency_id: string | null;
    approval_rule: ApprovalRule | null;
    created_at?: string;
    updated_at?: string;
}
interface CustomerGroupWithStats extends CustomerGroupRow {
    memberCount?: number;
    productCount?: number;
}
interface CustomerGroupLite {
    id: string;
    name: string;
    code: string;
    parent_id: string | null;
    is_active: boolean | null;
    is_personal: boolean | null;
    is_default: boolean | null;
    agency_id: string | null;
    sort_order: number | null;
}
type CustomerGroupListParams = PaginationParams & SearchParams & {
    parent_id?: string | 'null';
    only_mains?: boolean;
    include_personal?: boolean;
    active_only?: boolean;
    with_stats?: boolean;
};
type CustomerGroupLiteParams = {
    include_personal?: boolean;
    active_only?: boolean;
};
type CreateCustomerGroupPayload = {
    name: string;
    code: string;
    description?: string | null;
    is_default?: boolean;
    is_active?: boolean;
    sort_order?: number;
    parent_id?: string | null;
    is_prepay?: boolean;
    is_discount?: boolean;
    sale_map_allowed?: boolean;
    is_personal?: boolean;
    owner_user_id?: string | null;
    agency_id?: string | null;
    approval_rule?: ApprovalRule;
    billing_name?: string | null;
    billing_address?: string | null;
    billing_tax_id?: string | null;
    document_preference?: DocumentPreference;
};
type UpdateCustomerGroupPayload = Partial<CreateCustomerGroupPayload>;
interface CustomerGroupProductRow {
    product_id: string;
    name: string;
    price: number;
    default_price: number;
}
declare const customerGroupsApi: {
    list: (params?: CustomerGroupListParams) => Promise<PaginatedResponse<CustomerGroupWithStats>>;
    lite: (params?: CustomerGroupLiteParams) => Promise<{
        rows: CustomerGroupLite[];
        total: number;
    }>;
    getById: (id: string) => Promise<CustomerGroupRow>;
    getProducts: (id: string) => Promise<{
        rows: CustomerGroupProductRow[];
    }>;
    create: (payload: CreateCustomerGroupPayload) => Promise<CustomerGroupRow>;
    update: (id: string, payload: UpdateCustomerGroupPayload) => Promise<CustomerGroupRow>;
};

export { type AccountStatus, type AddSundaysResult, type AdminAppRole, type AdminUserPaymentResponse, type AgencyPaymentResponse, ApiError, type ApprovalRule, type ApproveSummary, type ApproverInput, type AssignPurchaseRightPayload, type BatchCompletePayload, type BatchCompleteResult, type BatchPrintResult, type BatchScanPayload, CONTAINER_QR_PATTERN, type ContainerBatchResult, type ContainerQrData, type ContainerScanType, type CreateContainersBatchPayload, type CreateCustomerGroupPayload, type CreateDisbursementGroupV2Payload, type CreateHolidayPayload, type CustomerGroupListParams, type CustomerGroupLite, type CustomerGroupLiteParams, type CustomerGroupProductRow, type CustomerGroupRow, type CustomerGroupWithStats, type DebtFilters, type DebtRow, type DecisionPayload, type DecisionResult, type DelegateApproverPayload, type DisbursementApproverRow, type DocumentPreference, type DriverCollectCustomer, type Holiday, type HolidayOrderPolicy, type HolidaySettings, type MapUserPayload, type MapUserResult, type NotificationConfig, type PaymentMethodConfig, type PendingDelivery, type RecipientStrategy, type SettingsMap, type SupportFeeFilters, type SupportFeeRow, type SyncGoogleResult, type UnloadPayload, type UnloadResult, type UpdateContainerStatusPayload, type UpdateCustomerGroupPayload, type UpdateHolidayPayload, type UpdateNotificationConfigPayload, type UpdateSettingPayload, type UpdateStatusPayload, type UserPaymentMethodsResponse, type UserPurchaseRightRow, approveApi, configure, configureApproveClient, containersApi, customerGroupsApi, deliveriesApi, disbursementsApi, documentsApi, financeApi, holidaysApi, isValidContainerQR, notificationConfigsApi, notificationsApi, ordersApi, paymentMethodsApi, productsApi, routesApi, serverStatusApi, settingsApi, usersAdminApi, usersApi };
