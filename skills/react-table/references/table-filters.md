# Shared filter functions (tableFilters)

Filter function signature: `(row, columnId, filterValue) => boolean`. Attach the appropriate filter (e.g. `customizedTimeFilter`, `customizedAddressFilter`) to the column’s `filterFn`. Implement per project (e.g. compare row time with filterValue).

**Type and example**

```tsx
import type { FilterFn } from '@tanstack/react-table';

export const customizedTimeFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  // Implement per project, e.g. compare row time with filterValue
  return true;
};

export const customizedAddressFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  return true;
};
```

Keep these shared filters in the project’s `utils/tableFilters.ts` and import them in feature column configs (`constants/*TableConfig.tsx`).
