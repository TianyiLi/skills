# React Table Reference Index

Reference materials for this skill live in this `references/` directory. Load them when implementing or modifying tables.

## Minimal setup (generic DataTable)

- [minimal-data-table.md](minimal-data-table.md) — data + columns + getCoreRowModel only; no selection / virtualization / custom filters.

## Row selection

- [row-selection.md](row-selection.md) — `enableMultiRowSelection: false`, `SelectableTableRow`, `row.toggleSelected()`, `getSelectedRowModel()`.

## Sorting + virtualization

- [sorting-virtualized.md](sorting-virtualized.md) — `getSortedRowModel`, `getFilteredRowModel`, `useStableVirtualizer`, virtualized `TableBody`.

## Filtering (filterFn)

- [filtering.md](filtering.md) — `getColumn('age')?.setFilterValue(value)`, custom `filterFn` (e.g. `customizedTimeFilter`).
- [table-filters.md](table-filters.md) — `(row, columnId, filterValue) => boolean` signature and shared filter implementations.

## Multi-select + header checkbox

- [multi-select-header.md](multi-select-header.md) — header uses `table.getIsAllRowsSelected()` + `getToggleAllRowsSelectedHandler()`; cells use `row.getIsSelected()` + `row.getToggleSelectedHandler()`.

## UI primitives

- [table-primitives.md](table-primitives.md) — usage summary for `Table`, `TableHeader`, `TableBody`, `TableRow`, `SelectableTableRow`, `TableHead`, `TableCell`.
