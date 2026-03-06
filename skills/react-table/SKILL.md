---
name: react-table
description: Implements data tables using @tanstack/react-table v8 with project UI primitives. Use when adding or modifying tables, column configs, sorting, filtering, row selection, or virtualized table bodies.
---

# React Table Implementation

This project uses **@tanstack/react-table** v8 and renders with the project’s Table primitives in `@/modules/common/components/ui/table` (shadcn-based).

## Architecture overview

| Layer | Location | Responsibility |
|------|------|------|
| Column config | `constants/*TableConfig.tsx` | `ColumnDef<T>[]`: header, accessor, cell, filterFn, size, etc. |
| Container | `containers/*Container.tsx` | `useReactTable`, data source, optional virtual/selection/filter |
| Common component | `common/components/ui/data-table.tsx` | Simple tables can use `<DataTable columns={} data={} />` |
| Table UI | `common/components/ui/table` | `Table`, `TableHeader`, `TableBody`, `TableRow` / `SelectableTableRow`, `TableHead`, `TableCell` |

## 1. Column configuration

- Type: `ColumnDef<TData>[]` from `@tanstack/react-table`.
- Common properties:
  - `id`: unique identifier (optional; otherwise derived from accessor)
  - `header`: string or `() => ReactNode` (use a function when composing UI like sort buttons)
  - `accessorKey` or `accessorFn`: value accessor
  - `cell`: `({ row }) => ReactNode`, typically via `row.getValue<T>(key)` or `row.original`
  - `size`: number (px). Used for fixed widths and virtualized layouts
  - `filterFn`: custom filter function (see below)
  - `enableSorting`, `sortingFn`: sorting controls

**Example (simplified):**

```tsx
// constants/exampleTableConfig.tsx
import type { ColumnDef } from '@tanstack/react-table';

export const exampleTableColumns: ColumnDef<ExampleRow>[] = [
  { header: 'Name', accessorKey: 'name', cell: ({ row }) => row.getValue('name') },
  {
    id: 'amount',
    header: 'Amount',
    accessorFn: (row) => row.amount,
    cell: ({ row }) => <span>{row.original.amount}</span>,
    size: 120,
  },
];
```

## 2. Creating a table instance

In a container, call `useReactTable` with at least `data`, `columns`, and `getCoreRowModel: getCoreRowModel()`.

```tsx
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
});
```

Add advanced features only when needed:

- **Sorting**: `getSortedRowModel: getSortedRowModel()`
- **Filtering**: `getFilteredRowModel: getFilteredRowModel()`, optionally `filterFns: {}` (or a map from filter name to fn)
- **Row selection**: `enableRowSelection: true`, `enableMultiRowSelection: true/false`, using `row.toggleSelected()` and `table.getSelectedRowModel().rows`

## 3. Rendering

Render headers and cells using the project Table primitives and `flexRender`.

**Header:**

```tsx
<TableHeader>
  {table.getHeaderGroups().map((headerGroup) => (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <TableHead key={header.id} style={{ width: header.getSize() }}>
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </TableHead>
      ))}
    </TableRow>
  ))}
</TableHeader>
```

**Body:**

```tsx
<TableBody>
  {table.getRowModel().rows.map((row) => (
    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  ))}
</TableBody>
```

For empty states, render a single `<TableRow>` with `<TableCell colSpan={columns.length}>No results.</TableCell>`.

## 4. Optional patterns

### Simple tables: use `DataTable`

If you don’t need row selection, virtualization, or custom filters:

```tsx
import { DataTable } from '@/modules/common/components/ui/data-table';

<DataTable columns={columns} data={data} />
```

### Row selection

- Enable selection with `enableRowSelection: true` and set `enableMultiRowSelection` to `false` (single) or `true` (multi).
- Use `SelectableTableRow`; call `row.toggleSelected()` on click; style selected state via `data-state={row.getIsSelected() && 'selected'}`.
- “Select all”: render a checkbox in the header using `table.getIsAllRowsSelected()` and `table.getToggleAllRowsSelectedHandler()`.
- Get selected rows via `table.getSelectedRowModel().rows.map((row) => row.original)`.

### Virtualized body

- Use the project `useStableVirtualizer` (built on `@tanstack/react-virtual`), providing `count: rows.length`, a stable `getScrollElement` (outer scroll container ref), `estimateSize`, optional `measureElement`, and `overscan`.
- Use the same scroll container ref for `getScrollElement`.
- Only render `rowVirtualizer.getVirtualItems()`. Position rows with `transform: translateY(${virtualRow.start}px)` and set the body container height to `rowVirtualizer.getTotalSize()`.
- When data (or `rows.length`) changes, a `key` or state bump may be used to force recalculation (see `DiscoverTableContainer` / `PublicChannelContainer`).

### Custom filtering (`filterFn`)

- Filter function signature: `(row, columnId, filterValue, addMeta) => boolean` (see `Row` from `@tanstack/react-table`).
- Set `filterFn: customizedXxxFilter` on the column definition (e.g. `customizedTimeFilter`, `customizedAddressFilter`).
- Update filters from the container via `table.getColumn(columnId)?.setFilterValue(value)` (often driven by filter UI such as time/address dialogs).
- Keep reusable filter implementations in `utils/tableFilters.ts`, then import them into column configs.

### Sorting

- Add `getSortedRowModel: getSortedRowModel()`.
- When a header needs sorting UI, use the project `SortButton` with `onSort={() => column.toggleSorting()}` and `sortDirection={column.getIsSorted()}`.
- Columns can set `enableSorting: true`, `sortingFn: 'auto'`, or a custom `sortingFn`.

## 5. File & type conventions

- **Column configs**: live under `constants/<feature>TableConfig.tsx`. Export `ColumnDef<T>[]` or a factory like `createXxxTableConfig(...)`. Export row types as `XxxRow` / `XxxItem`.
- **Containers**: fetch/derive data (react-query, atoms, etc.), build `data` + `columns`, call `useReactTable`, then render with Table primitives + `flexRender`. Use `useRef` to hold the table instance or scroll container for virtualization/filter wiring.
- **Table primitives**: use `SelectableTableRow` for selectable rows; otherwise `TableRow`. For virtualization, `TableBody` often uses `display: grid` and `position: relative`, while rows use `position: absolute` + `translateY`.

## 6. Checklist (when adding/modifying a table)

- [ ] Column configs live in `constants/*TableConfig.tsx` and are typed as `ColumnDef<T>[]`
- [ ] The container calls `useReactTable` with at least `data`, `columns`, and `getCoreRowModel()`
- [ ] Rendering uses `Table` / `TableHeader` / `TableBody` / `TableRow` (or `SelectableTableRow`) and `TableHead` / `TableCell` with `flexRender`
- [ ] Sorting: add `getSortedRowModel()` and header UI (project `SortButton`) where needed
- [ ] Filtering: add `getFilteredRowModel()`, set `filterFn` on columns, and update values via `getColumn(id)?.setFilterValue(...)`
- [ ] Large datasets: consider virtualization (`useStableVirtualizer` + a stable scroll container)
- [ ] Selection: use `SelectableTableRow` + `row.toggleSelected()` and read selection via `getSelectedRowModel()`

## How to Use

Read individual reference files for detailed code and patterns:

```
references/README.md
references/minimal-data-table.md
references/row-selection.md
references/sorting-virtualized.md
references/filtering.md
references/table-filters.md
references/multi-select-header.md
references/table-primitives.md
```

Each reference file contains focused documentation and code examples for that topic. When implementing or modifying tables, load these as needed instead of main-project paths.
