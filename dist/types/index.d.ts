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

type DocumentType = 'invoice' | 'receipt' | 'credit_note';
type DocumentStatus = 'active' | 'voided' | 'pending_void';
type Document = {
    id: string;
    document_number: string;
    type: DocumentType;
    status: DocumentStatus;
    order_id: string;
    customer_id: string;
    amount: number;
    issued_at: string;
    voided_at: string | null;
    pdf_url: string | null;
    pdf_encrypted: boolean;
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

export { type Address, type AddressPayload, type AppRole, type ApproveVoidPayload, type AssignDeliveryPayload, type CancelOrderPayload, type CompleteDeliveryPayload, type ConfirmRoutePayload, type CreateOrderPayload, type CreateProductPayload, type CustomerGroup, DEFAULT_PAGE_SIZE, type Delivery, type DeliveryDetail, type DeliveryItem, type DeliveryStatus, type DeliveryType, type Document, type DocumentStatus, type DocumentType, type ExportedData, type GenerateRoutePayload, MAX_PAGE_SIZE, type MarkReadPayload, type MoveStopPayload, type Notification, type NotificationChannel, type NotificationType, type Order, type OrderItem, type OrderStatus, PAGE_SIZE_OPTIONS, type PageSize, type PaginatedResponse, type PaginationParams, type PaymentMethod, type Product, type ProductPrice, type Profile, type PushSubscriptionPayload, type RejectVoidPayload, type ReorderStopsPayload, type ReturnBottlesPayload, type RoutePlan, type RoutePlanStop, type RouteStatus, type SearchParams, type SendNotificationPayload, type SendToAgencyPayload, type SendToAgencyResult, type ServerStatus, type ServerStatusBucket, type ServerStatusTable, type SettleDebtPayload, type Transaction, type UpdateDeliveryStatusPayload, type UpdateProductPayload, type UpdateProfilePayload, type UserRole, type VoidRequest, clampPageSize, todayISO };
