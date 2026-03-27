# Shared Library

TypeScript library consumed by all frontend apps.

## Build
- tsup (see `tsup.config.ts`)
- `npm run build` → `dist/`

## Structure
- `src/index.ts` — main exports
- `src/types/` — shared TypeScript types
- `src/api-client/` — shared API client utilities

## Rules
- Changes here affect ALL 5 frontend apps — test across apps before committing
- Always rebuild after changes: `npm run build`
- Keep exports minimal and well-typed
