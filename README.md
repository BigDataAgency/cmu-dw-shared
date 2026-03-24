# @cmu-dw/shared

Shared TypeScript types and API client for CMU Drinking Water apps.

## Install

```sh
npm install github:BigDataAgency/cmu-dw-shared
```

## Usage

```typescript
import { ordersApi, productsApi, configure } from '@cmu-dw/shared/api-client'
import type { Order, CreateOrderPayload } from '@cmu-dw/shared/types'

// Configure once at app startup
configure({
  baseUrl: import.meta.env.VITE_EDGE_FUNCTION_URL,
  getToken: async () => {
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  },
})

// Use in components
const orders = await ordersApi.list()
const order = await ordersApi.create({ items, paymentMethod, addressId })
```

## Structure

```
src/
├── types/          ← TypeScript interfaces (Order, Product, Delivery, ...)
├── api-client/     ← Typed fetch wrappers pointing to Edge Functions
└── index.ts        ← Re-exports everything
```

## Build

```sh
npm install
npm run build     # compile → dist/
npm run dev       # watch mode
```
