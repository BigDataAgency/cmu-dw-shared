// src/types/pagination.ts
var DEFAULT_PAGE_SIZE = 20;
var MAX_PAGE_SIZE = 100;
var PAGE_SIZE_OPTIONS = [20, 50, 100];
function clampPageSize(n) {
  if (!n || n < 1) return DEFAULT_PAGE_SIZE;
  return Math.min(n, MAX_PAGE_SIZE);
}
function todayISO() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}

export {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  clampPageSize,
  todayISO
};
//# sourceMappingURL=chunk-2BCCXDAV.js.map