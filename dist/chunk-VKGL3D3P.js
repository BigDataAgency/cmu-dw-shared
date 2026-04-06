// src/api-client/fetch.ts
var _baseUrl = "";
var _getToken = null;
var _anonKey = "";
function configure(options) {
  _baseUrl = options.baseUrl;
  _getToken = options.getToken;
  _anonKey = options.anonKey ?? "";
}
async function buildHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (_anonKey) headers["apikey"] = _anonKey;
  const token = _getToken ? await _getToken() : null;
  headers["Authorization"] = `Bearer ${token ?? _anonKey}`;
  return headers;
}
async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, error.message ?? res.statusText);
  }
  if (res.status === 204) return void 0;
  return res.json();
}
var ApiError = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
};
async function get(path, params) {
  const url = new URL(`${_baseUrl}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== void 0 && v !== null) url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString(), { headers: await buildHeaders() });
  return handleResponse(res);
}
async function post(path, body) {
  const res = await fetch(`${_baseUrl}${path}`, {
    method: "POST",
    headers: await buildHeaders(),
    body: body !== void 0 ? JSON.stringify(body) : void 0
  });
  return handleResponse(res);
}
async function patch(path, body) {
  const res = await fetch(`${_baseUrl}${path}`, {
    method: "PATCH",
    headers: await buildHeaders(),
    body: body !== void 0 ? JSON.stringify(body) : void 0
  });
  return handleResponse(res);
}
async function del(path, body) {
  const res = await fetch(`${_baseUrl}${path}`, {
    method: "DELETE",
    headers: await buildHeaders(),
    body: body !== void 0 ? JSON.stringify(body) : void 0
  });
  return handleResponse(res);
}

// src/api-client/orders.ts
var ordersApi = {
  list: (filters) => get("/orders", filters),
  getById: (id) => get(`/orders/${id}`),
  create: (payload) => post("/orders", payload),
  cancel: (id, payload) => patch(`/orders/${id}/cancel`, payload),
  updateStatus: (id, payload) => patch(`/orders/${id}/status`, payload),
  returnBottles: (id, payload) => post(`/orders/${id}/return-bottles`, payload)
};

// src/api-client/deliveries.ts
var deliveriesApi = {
  list: (filters) => get("/deliveries", filters),
  getById: (id) => get(`/deliveries/${id}`),
  assign: (payload) => post("/deliveries", payload),
  updateStatus: (id, payload) => patch(`/deliveries/${id}/status`, payload),
  complete: (id, payload) => patch(`/deliveries/${id}/complete`, payload ?? {}),
  cancel: (id, payload) => patch(`/deliveries/${id}/cancel`, payload),
  updateItemQty: (itemId, payload) => patch(`/deliveries/items/${itemId}/qty`, payload),
  assignDriver: (id, payload) => patch(`/deliveries/${id}/assign`, payload),
  completeBatch: (payload) => post("/deliveries/batch-complete", payload)
};

// src/api-client/routes.ts
var routesApi = {
  list: (filters) => get("/routes", filters),
  getById: (id) => get(`/routes/${id}`),
  getUnassignedOrders: (date) => get("/routes/unassigned-orders", date ? { date } : void 0),
  generate: (payload) => post("/routes/generate", payload),
  confirm: (id, payload) => post(`/routes/${id}/confirm`, payload),
  reorderStops: (id, payload) => patch(`/routes/${id}/stops/reorder`, payload),
  moveStop: (id, payload) => post(`/routes/${id}/stops/move`, payload),
  addStop: (id, payload) => post(`/routes/${id}/stops`, payload),
  removeStop: (stopId) => del(`/routes/stops/${stopId}`)
};

// src/api-client/products.ts
var productsApi = {
  list: (filters) => get("/products", filters),
  getById: (id) => get(`/products/${id}`),
  create: (payload) => post("/products", payload),
  update: (id, payload) => patch(`/products/${id}`, payload),
  updateStock: (id, payload) => patch(`/products/${id}/stock`, payload)
};

// src/api-client/users.ts
var usersApi = {
  getMe: () => get("/users/me"),
  updateMe: (payload) => patch("/users/me", payload),
  getPurchaseRights: () => get("/users/me/purchase-rights"),
  getMyOrders: () => get("/users/me/orders"),
  getAddresses: () => get("/users/me/addresses"),
  addAddress: (payload) => post("/users/me/addresses", payload),
  updateAddress: (id, payload) => patch(`/users/me/addresses/${id}`, payload),
  deleteAddress: (id) => del(`/users/me/addresses/${id}`),
  setDefaultAddress: (id) => patch(`/users/me/addresses/${id}/set-default`, {})
};

// src/api-client/finance.ts
var financeApi = {
  listInvoices: (filters) => get("/finance/invoices", filters),
  listReceipts: (filters) => get("/finance/receipts", filters),
  approveVoidReissue: (payload) => post("/finance/void-reissue/approve", payload),
  rejectVoidReissue: (payload) => post("/finance/void-reissue/reject", payload),
  settleDebt: (payload) => post("/finance/settle-debt", payload),
  getSupportFees: (filters) => get("/finance/support-fees", filters)
};

// src/api-client/notifications.ts
var notificationsApi = {
  send: (payload) => post("/notifications/send", payload),
  list: () => get("/notifications"),
  markRead: (id) => patch(`/notifications/${id}/read`),
  subscribe: (payload) => post("/notifications/subscribe", payload),
  unsubscribe: (endpoint) => del("/notifications/subscribe", { endpoint }),
  sendToAgency: (payload) => post("/notifications/send-to-agency", payload)
};

// src/api-client/documents.ts
var documentsApi = {
  generatePdf: (payload) => post("/documents/pdf", payload),
  getById: (id) => get(`/documents/${id}`),
  batchPrint: (deliveryIds) => post("/documents/batch-print", { delivery_ids: deliveryIds })
};

// src/api-client/containers.ts
var CONTAINER_QR_PATTERN = /^TK-\d{5}$/;
var isValidContainerQR = (qr) => CONTAINER_QR_PATTERN.test(qr);
var containersApi = {
  list: () => get("/containers"),
  getSummary: () => get("/containers/summary"),
  getScanHistory: (id) => get(`/containers/${id}/scan-history`),
  scan: (payload) => post("/containers/scan", payload),
  updateStatus: (id, payload) => patch(`/containers/${id}/status`, payload),
  // v1.15.0 req-02: Vendor Gen QR batch
  genQr: (payload) => post("/containers/gen-qr", payload),
  // v1.15.0 req-03: Driver collect — รายชื่อลูกค้าที่มีถัง with_customer
  getCollectCustomers: () => get("/containers/collect-customers"),
  // v1.15.0 req-04: Unload at depot (auto-detect ON_TRUCK/RETURNED_EMPTY → AT_DEPOT)
  unload: (payload) => post("/containers/unload", payload),
  // v1.15.0: ดึงข้อมูล QR ต่อถัง (render QR label)
  getQrData: (id) => get(`/containers/${id}/qr-data`)
};

// src/api-client/holidays.ts
var holidaysApi = {
  // Settings
  getSettings: () => get("/admin/holidays/settings"),
  updateSettings: (settings) => patch("/admin/holidays/settings", settings),
  // CRUD
  list: (params) => get("/admin/holidays", params),
  create: (payload) => post("/admin/holidays", payload),
  update: (id, payload) => patch(`/admin/holidays/${id}`, payload),
  toggleActive: (id, is_active) => patch(`/admin/holidays/${id}/toggle`, { is_active }),
  remove: (id) => del(`/admin/holidays/${id}`),
  addSundays: (year) => post("/admin/holidays/add-sundays", { year }),
  syncGoogle: (year) => post("/holidays-sync", { year })
};

// src/api-client/settings.ts
var settingsApi = {
  /** Admin: อ่าน settings ทั้งหมด (requires admin_property / executive / staff_property) */
  getAdmin: () => get("/admin/settings"),
  /** Admin: อัปเดต setting key เดียว */
  patchAdmin: (key, value) => patch("/admin/settings", { key, value }),
  /** Vendor: อ่าน settings เฉพาะ vendor keys */
  getVendor: () => get("/routes/settings"),
  /** Vendor: อัปเดต vendor setting key เดียว */
  patchVendor: (key, value) => patch("/routes/settings", { key, value })
};

// src/api-client/payment-methods.ts
var paymentMethodsApi = {
  /** Customer: ดูว่าตัวเองใช้วิธีชำระอะไรได้ */
  getMyMethods: () => get("/users/me/payment-methods"),
  /** Admin: ดู config + resolved methods ของ user */
  getForUser: (userId) => get(`/admin/users/${userId}/payment-methods`),
  /** Admin: set user payment method overrides */
  setForUser: (userId, methods) => patch(`/admin/users/${userId}/payment-methods`, { methods }),
  /** Admin: clear user overrides (fallback to agency/default) */
  clearForUser: (userId) => del(`/admin/users/${userId}/payment-methods`),
  /** Admin: ดู agency payment config */
  getForAgency: (agencyId) => get(`/admin/agencies/${agencyId}/payment-methods`),
  /** Admin: set agency payment method config */
  setForAgency: (agencyId, methods) => patch(`/admin/agencies/${agencyId}/payment-methods`, { methods })
};

// src/api-client/notification-configs.ts
var notificationConfigsApi = {
  /** List all notification configs */
  list: () => get("/notification-configs"),
  /** Get single notification config by ID */
  getById: (id) => get(`/notification-configs/${id}`),
  /** Update notification config */
  update: (id, payload) => patch(`/notification-configs/${id}`, payload)
};

export {
  configure,
  ApiError,
  ordersApi,
  deliveriesApi,
  routesApi,
  productsApi,
  usersApi,
  financeApi,
  notificationsApi,
  documentsApi,
  CONTAINER_QR_PATTERN,
  isValidContainerQR,
  containersApi,
  holidaysApi,
  settingsApi,
  paymentMethodsApi,
  notificationConfigsApi
};
//# sourceMappingURL=chunk-VKGL3D3P.js.map