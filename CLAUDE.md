# Shared Library (`@cmu-dw/shared`)

TypeScript library consumed by all 5 frontend apps.

## Role in Architecture

`@cmu-dw/shared` เป็น **สะพานเดียว** ระหว่าง Frontend กับ Backend:

```
Frontend hooks  →  @cmu-dw/shared api-client  →  Edge Functions  →  DB
```

- `src/api-client/` — HTTP client ที่เรียก Edge Functions (Bearer JWT)
- `src/types/` — Shared TypeScript types (order, product, delivery, etc.)
- Frontend **ห้าม** เรียก DB ตรง → ต้องผ่าน api-client เสมอ

## Build
- tsup (see `tsup.config.ts`)
- `npm run build` → `dist/`

## Structure
- `src/index.ts` — main exports
- `src/types/` — shared TypeScript types
- `src/api-client/fetch.ts` — base HTTP client (configure baseUrl + getToken)
- `src/api-client/index.ts` — re-export all domain clients
- `src/api-client/[domain].ts` — domain-specific API methods (10 domains)

### Existing API Client Domains (10)
`orders`, `deliveries`, `routes`, `products`, `users`, `finance`, `notifications`, `documents`, `containers`

### Adding a New API Method
1. เพิ่ม method ใน `src/api-client/[domain].ts` (ถ้า domain มีอยู่แล้ว)
2. หรือสร้างไฟล์ใหม่ `src/api-client/[new-domain].ts` + export จาก `index.ts`
3. `npm run build` → rebuild dist/
4. Frontend apps จะเห็น method ใหม่ทันที (ถ้า link ด้วย workspace)

### API Client Pattern
```typescript
// src/api-client/holidays.ts (ตัวอย่าง)
import { get, post, patch, del } from './fetch'

export const holidaysApi = {
  list: (params?: { year?: number }) =>
    get<Holiday[]>('/admin', { action: 'holidays', ...params }),

  create: (payload: CreateHolidayPayload) =>
    post<Holiday>('/admin', { action: 'holiday-create', ...payload }),

  toggleActive: (id: string, is_active: boolean) =>
    patch<Holiday>(`/admin`, { action: 'holiday-toggle', id, is_active }),

  remove: (id: string) =>
    del<void>(`/admin?action=holiday-delete&id=${id}`),

  syncGoogle: (year: number) =>
    post<SyncResult>('/holidays-sync', { year }),
}
```

## Rules
- Changes here affect ALL 5 frontend apps — test across apps before committing
- Always rebuild after changes: `npm run build`
- Keep exports minimal and well-typed
- Types should match Edge Function response contracts
