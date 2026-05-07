type AppRole = 'customer' | 'driver' | 'vendor' | 'pos' | 'admin' | 'superadmin';
type UserRole = {
    role: AppRole;
    is_active: boolean;
};
type Profile = {
    id: string;
    email: string | null;
    full_name: string | null;
    phone_number: string | null;
    avatar_url: string | null;
    billing_name: string | null;
    billing_address: string | null;
    billing_tax_id: string | null;
    roles: UserRole[];
    created_at: string;
    updated_at: string;
};
type UpdateProfilePayload = {
    full_name?: string;
    phone_number?: string;
    email?: string;
    avatar_url?: string;
    billing_name?: string;
    billing_address?: string;
    billing_tax_id?: string;
};
type AddressPayload = {
    label: string;
    address: string;
    recipient_name?: string;
    phone?: string;
    subdistrict?: string;
    district?: string;
    province?: string;
    postal_code?: string;
    lat?: number;
    lng?: number;
    is_default?: boolean;
    delivery_notes?: string;
};
type Address = {
    id: string;
    label: string;
    address: string;
    recipient_name: string | null;
    phone: string | null;
    subdistrict: string | null;
    district: string | null;
    province: string | null;
    postal_code: string | null;
    lat: number | null;
    lng: number | null;
    is_default: boolean;
    delivery_notes: string | null;
};
interface ExportedData {
    exported_at: string;
    profile: {
        id: string;
        full_name: string | null;
        email: string | null;
        phone_number: string | null;
        avatar_url: string | null;
        account_status: string;
        created_at: string;
    } | null;
    addresses: {
        label: string;
        recipient_name: string | null;
        recipient_phone: string | null;
        address_line: string;
        district: string | null;
        province: string | null;
        postal_code: string | null;
    }[];
    orders: {
        id: string;
        order_number: string;
        status: string;
        total_amount: number;
        created_at: string;
    }[];
    consent_history: {
        accepted_at: string;
        ip_address: string | null;
        consent_version: string;
        consent_type: string;
        consent_title: string;
    }[];
}

type CustomerGroup = 'general' | 'university' | 'wholesale' | 'vip';
type ProductPrice = {
    id: string;
    customer_group: CustomerGroup;
    price: number;
    unit: string;
};
type Product = {
    id: string;
    name: string;
    sku: string | null;
    category: string | null;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
    stock_qty: number;
    low_stock_threshold: number | null;
    price: number | null;
    deposit_price: number | null;
    pos_stock_exempt?: boolean;
    prices: ProductPrice[];
    created_at: string;
    updated_at: string;
};
type CreateProductPayload = {
    name: string;
    description?: string;
    image_url?: string;
    is_active?: boolean;
    prices?: Omit<ProductPrice, 'id'>[];
};
type UpdateProductPayload = Partial<CreateProductPayload>;

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled' | 'overdue';
type PaymentMethod = 'cash' | 'qr_promptpay' | 'payroll_deduction' | 'invoice_billing';
type DeliveryType = 'delivery' | 'pickup';
type OrderItem = {
    id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
};
type Order = {
    id: string;
    order_number: string;
    customer_id: string;
    status: OrderStatus;
    payment_method: PaymentMethod;
    address_id: string;
    items: OrderItem[];
    total_amount: number;
    note: string | null;
    delivery_type: DeliveryType;
    created_at: string;
    updated_at: string;
};
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
    source?: 'online' | 'pos_walkin' | 'pos_delivery' | 'phone' | 'agent';
    purchase_right_id?: string;
    scheduled_date?: string;
    scheduled_time_slot?: string;
    delivery_notes?: string;
    discount_amount?: number;
    delivery_type?: DeliveryType;
};
type CancelOrderPayload = {
    reason: string;
};
type ReturnBottlesPayload = {
    bottles_returned: number;
};

type DeliveryStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

type DeliveryItem = {
    product_id: string;
    product_name: string;
    quantity: number;
};
type Delivery = {
    id: string;
    order_id: string;
    driver_id: string | null;
    route_plan_stop_id: string | null;
    status: DeliveryStatus;
    items: DeliveryItem[];
    address: string;
    lat: number | null;
    lng: number | null;
    note: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
};
/** GET /deliveries/:id — expanded response with order info + product flags (v1.20.0) */
type DeliveryDetail = Delivery & {
    orders: {
        order_number: string;
        payment_method: PaymentMethod;
        order_type: string;
        delivery_address: string;
        delivery_recipient_name: string | null;
        delivery_phone: string | null;
        delivery_notes: string | null;
        delivery_lat: number | null;
        delivery_lng: number | null;
    } | null;
    delivery_items: Array<{
        quantity: number;
        order_items: {
            products: {
                name: string;
                is_returnable: boolean;
            };
        } | null;
    }>;
    payment_method: PaymentMethod | null;
    has_returnable_items: boolean;
};
type AssignDeliveryPayload = {
    driver_id: string;
    route_plan_stop_id?: string;
};
type CompleteDeliveryPayload = {
    bottles_collected: number;
    note?: string;
};
type UpdateDeliveryStatusPayload = {
    status: DeliveryStatus;
};

type RouteStatus = 'draft' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
type RoutePlanStop = {
    id: string;
    route_plan_id: string;
    sequence: number;
    delivery_id: string;
    address: string;
    lat: number | null;
    lng: number | null;
    estimated_arrival: string | null;
    completed_at: string | null;
};
type RoutePlan = {
    id: string;
    driver_id: string;
    date: string;
    status: RouteStatus;
    stops: RoutePlanStop[];
    created_at: string;
    updated_at: string;
};
type GenerateRoutePayload = {
    date: string;
    driver_ids?: string[];
};
type ConfirmRoutePayload = {
    driver_id?: string;
};
type ReorderStopsPayload = {
    stop_ids: string[];
};
type MoveStopPayload = {
    stop_id: string;
    target_route_plan_id: string;
};

type DocumentType = 'invoice' | 'receipt' | 'voucher' | 'delivery_note' | 'sticker';
type DocumentStatus = 'draft' | 'issued' | 'void';
type Document = {
    id: string;
    document_number: string;
    type: DocumentType;
    status: DocumentStatus;
    amount: number;
    issued_to_name: string;
    issued_to_address: string | null;
    tax_id: string | null;
    agency_id: string | null;
    profile_id: string | null;
    order_id: string | null;
    delivery_id: string | null;
    template_id: string | null;
    issued_at: string | null;
    issued_by: string | null;
    pdf_url: string | null;
    void_reason: string | null;
    voided_document_id: string | null;
    reissue_reason: string | null;
    created_at: string;
};
type Transaction = {
    id: string;
    document_id: string;
    amount: number;
    payment_method: string;
    reference: string | null;
    created_at: string;
};
type VoidRequest = {
    id: string;
    document_id: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    requested_by: string;
    reviewed_by: string | null;
    created_at: string;
};
type ApproveVoidPayload = {
    void_request_id: string;
    reissue: boolean;
};
type RejectVoidPayload = {
    void_request_id: string;
    reason: string;
};
type SettleDebtPayload = {
    customer_id: string;
    amount: number;
    payment_method: string;
    reference?: string;
};

type NotificationChannel = 'push' | 'email' | 'in_app';
type NotificationType = 'order_update' | 'delivery_update' | 'payment_reminder' | 'subscription_reminder' | 'route_plan_ready' | 'system';
type Notification = {
    id: string;
    user_id: string;
    type: NotificationType;
    title: string;
    body: string;
    data: Record<string, unknown> | null;
    read_at: string | null;
    created_at: string;
};
type SendNotificationPayload = {
    user_id: string;
    type: NotificationType;
    title: string;
    body: string;
    channels?: NotificationChannel[];
    data?: Record<string, unknown>;
};
type MarkReadPayload = {
    notification_id: string;
};
type PushSubscriptionPayload = {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
};
type SendToAgencyPayload = {
    agency_id: string;
    type: string;
    title: string;
    body: string;
    channels?: ('push' | 'in_app')[];
    data?: Record<string, unknown>;
};
type SendToAgencyResult = {
    sent_count: number;
    skipped_count: number;
    agency_id: string;
    warning?: string;
};

interface ServerStatusBucket {
    name: string;
    size_bytes: number;
    size_human: string;
    file_count: number;
}
interface ServerStatusTable {
    name: string;
    size_bytes: number;
    size_human: string;
    row_estimate: number;
}
interface ServerStatus {
    database: {
        size_bytes: number;
        size_human: string;
        active_connections: number;
        max_connections: number;
        uptime_since: string;
        cache_hit_ratio: number;
    };
    storage: {
        total_bytes: number;
        total_human: string;
        buckets: ServerStatusBucket[];
    };
    tables: ServerStatusTable[];
    timestamp: string;
}

declare const DEFAULT_PAGE_SIZE = 20;
declare const MAX_PAGE_SIZE = 100;
declare const PAGE_SIZE_OPTIONS: readonly [20, 50, 100];
type PageSize = typeof PAGE_SIZE_OPTIONS[number];
type PaginationParams = {
    page?: number;
    pageSize?: number;
};
type SearchParams = {
    q?: string;
};
type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};
declare function clampPageSize(n: number | undefined): number;
declare function todayISO(): string;

type AgencyKind = 'faculty' | 'office' | 'external';
type DisbursementKind = 'faculty' | 'office';
type DisbursementStatus = 'draft' | 'submitted' | 'faculty_approved' | 'office_head_approved' | 'office_director_approved' | 'treasury_review' | 'exported' | 'treasury_approved' | 'rejected_to_preparer' | 'treasury_rejected';
type DisbursementEventType = 'created' | 'submitted' | 'approved' | 'rejected' | 'exported' | 'treasury_approved' | 'treasury_rejected' | 'debtor_cleared' | 'unlocked_to_draft' | 'creditor_code_changed';
/** Backend `app_role` enum (DB-side) — distinct from frontend AppRole in `./user` */
type DbAppRole = 'guest' | 'member_email' | 'member_cmu' | 'org_cmu' | 'staff_property' | 'admin_property' | 'executive' | 'admin_vendor' | 'delivery' | 'super_admin';
/** 7-segment 3D accounting code per office disbursement item */
type AccountingCode7Seg = {
    fund_code?: string | null;
    organization_code?: string | null;
    work_plan_code?: string | null;
    account_code?: string | null;
    curriculum_code?: string | null;
    budget_code?: string | null;
    funding_source_code?: string | null;
};
type EligibleReceivable = {
    document_id: string;
    document_number: string;
    document_type: 'invoice' | 'receipt' | 'voucher';
    document_status: 'draft' | 'issued' | 'void';
    amount: number;
    issued_at: string;
    order_id: string;
    order_number: string;
    agency_id: string;
    agency_name: string;
    agency_kind: AgencyKind;
};
type DisbursementItem = AccountingCode7Seg & {
    id: string;
    group_id: string;
    order_id: string;
    document_id: string | null;
    amount: number;
    accounting_code_combined: string | null;
    description: string | null;
    position: number;
    created_at: string;
    order?: {
        id: string;
        order_number: string;
        total_amount: number;
    } | null;
};
type DisbursementGroup = {
    id: string;
    group_number: string;
    kind: DisbursementKind;
    status: DisbursementStatus;
    agency_id: string;
    prepared_by: string;
    prepared_at: string;
    faculty_creditor_account_id: string | null;
    faculty_creditor_snapshot: string | null;
    treasury_export_batch_id: string | null;
    cleared_at: string | null;
    external_edoc_id: string | null;
    total_amount: number;
    item_count: number;
    current_assignee_role: DbAppRole | null;
    last_reject_reason: string | null;
    rejected_from_group_id: string | null;
    created_at: string;
    updated_at: string;
    agency?: {
        id: string;
        name: string;
        kind: AgencyKind;
    } | null;
    creditor?: {
        id: string;
        creditor_code: string;
        label: string | null;
    } | null;
    items?: DisbursementItem[];
};
type DisbursementTimelineEvent = {
    id: string;
    event_type: DisbursementEventType;
    actor_user_id: string | null;
    actor_name: string | null;
    actor_role: DbAppRole | null;
    from_status: DisbursementStatus | null;
    to_status: DisbursementStatus | null;
    item_count: number | null;
    comment: string | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
};
type DisbursementExportBatch = {
    id: string;
    batch_number: string;
    exported_by: string;
    exported_at: string;
    kind: DisbursementKind;
    group_count: number;
    total_amount: number;
    file_path: string | null;
    filter_snapshot: Record<string, unknown> | null;
    created_at: string;
    exported_by_profile?: {
        id: string;
        full_name: string;
    } | null;
};
type FacultyCreditorAccount = {
    id: string;
    agency_id: string;
    creditor_code: string;
    label: string | null;
    is_active: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    agency?: {
        id: string;
        name: string;
        kind: AgencyKind;
    } | null;
};
type CreateDisbursementGroupItem = AccountingCode7Seg & {
    order_id: string;
    document_id?: string | null;
    amount: number;
    description?: string | null;
};
type CreateDisbursementGroupPayload = {
    kind: DisbursementKind;
    agency_id: string;
    external_edoc_id?: string | null;
    items: CreateDisbursementGroupItem[];
};
type ApproveDisbursementPayload = {
    comment?: string | null;
};
type RejectDisbursementPayload = {
    reason: string;
};
type TreasuryExportPayload = {
    group_ids: string[];
    filter?: Record<string, unknown> | null;
};
type TreasuryExportResult = {
    batch: DisbursementExportBatch;
    file_base64: string | null;
};
type FacultyCreditorUpsertPayload = {
    id?: string | null;
    agency_id: string;
    creditor_code: string;
    label?: string | null;
    is_active?: boolean;
};
type DisbursementGroupListFilters = {
    status?: DisbursementStatus;
    kind?: DisbursementKind;
    agency_id?: string;
};
type EligibleReceivablesFilters = {
    kind?: DisbursementKind;
    agency_id?: string;
    date_from?: string;
    date_to?: string;
};

export { type AccountingCode7Seg, type Address, type AddressPayload, type AgencyKind, type AppRole, type ApproveDisbursementPayload, type ApproveVoidPayload, type AssignDeliveryPayload, type CancelOrderPayload, type CompleteDeliveryPayload, type ConfirmRoutePayload, type CreateDisbursementGroupItem, type CreateDisbursementGroupPayload, type CreateOrderPayload, type CreateProductPayload, type CustomerGroup, DEFAULT_PAGE_SIZE, type DbAppRole, type Delivery, type DeliveryDetail, type DeliveryItem, type DeliveryStatus, type DeliveryType, type DisbursementEventType, type DisbursementExportBatch, type DisbursementGroup, type DisbursementGroupListFilters, type DisbursementItem, type DisbursementKind, type DisbursementStatus, type DisbursementTimelineEvent, type Document, type DocumentStatus, type DocumentType, type EligibleReceivable, type EligibleReceivablesFilters, type ExportedData, type FacultyCreditorAccount, type FacultyCreditorUpsertPayload, type GenerateRoutePayload, MAX_PAGE_SIZE, type MarkReadPayload, type MoveStopPayload, type Notification, type NotificationChannel, type NotificationType, type Order, type OrderItem, type OrderStatus, PAGE_SIZE_OPTIONS, type PageSize, type PaginatedResponse, type PaginationParams, type PaymentMethod, type Product, type ProductPrice, type Profile, type PushSubscriptionPayload, type RejectDisbursementPayload, type RejectVoidPayload, type ReorderStopsPayload, type ReturnBottlesPayload, type RoutePlan, type RoutePlanStop, type RouteStatus, type SearchParams, type SendNotificationPayload, type SendToAgencyPayload, type SendToAgencyResult, type ServerStatus, type ServerStatusBucket, type ServerStatusTable, type SettleDebtPayload, type Transaction, type TreasuryExportPayload, type TreasuryExportResult, type UpdateDeliveryStatusPayload, type UpdateProductPayload, type UpdateProfilePayload, type UserRole, type VoidRequest, clampPageSize, todayISO };
