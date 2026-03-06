# Filtering (filterFn)

Column-level custom filtering: set `filterFn` on the column definition (e.g. `customizedTimeFilter`), and update the filter from the UI in the container with `table.getColumn(columnId)?.setFilterValue(value)`. Keep reusable filter logic in the project’s `utils/tableFilters.ts` and import it in column configs.

**Column config: custom filterFn**

```tsx
{
  id: 'age',
  header: 'Age',
  accessorFn: (row) => row.age,
  filterFn: customizedTimeFilter, // (row, columnId, filterValue) => boolean
}
```

**Container: update filter from UI**

```tsx
table.getColumn('age')?.setFilterValue(value);
```

Filter function signature: `(row, columnId, filterValue, addMeta) => boolean` (see `Row` / `FilterFn` in `@tanstack/react-table`). For shared implementations see this skill’s `references/table-filters.md`.
