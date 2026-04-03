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

export type { Address, AddressPayload, AppRole, ApproveVoidPayload, AssignDeliveryPayload, CancelOrderPayload, CompleteDeliveryPayload, ConfirmRoutePayload, CreateOrderPayload, CreateProductPayload, CustomerGroup, Delivery, DeliveryDetail, DeliveryItem, DeliveryStatus, Document, DocumentStatus, DocumentType, GenerateRoutePayload, MarkReadPayload, MoveStopPayload, Notification, NotificationChannel, NotificationType, Order, OrderItem, OrderStatus, PaymentMethod, Product, ProductPrice, Profile, PushSubscriptionPayload, RejectVoidPayload, ReorderStopsPayload, ReturnBottlesPayload, RoutePlan, RoutePlanStop, RouteStatus, SendNotificationPayload, SendToAgencyPayload, SendToAgencyResult, SettleDebtPayload, Transaction, UpdateDeliveryStatusPayload, UpdateProductPayload, UpdateProfilePayload, UserRole, VoidRequest };
