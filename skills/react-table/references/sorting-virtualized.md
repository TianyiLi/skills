# Sorting + virtualization

Enable sorting, filtering, and virtualization together: add `getSortedRowModel` and `getFilteredRowModel` to `useReactTable`, then use the project’s `useStableVirtualizer` to render only visible rows.

**Table setup**

```tsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
});
```

**Virtualization**

```tsx
const rowVirtualizer = useStableVirtualizer({
  count: table.getRowModel().rows.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: () => 52,
  overscan: 5,
});
```

- `TableBody` only renders `rowVirtualizer.getVirtualItems()`.
- Row position: `transform: translateY(${virtualRow.start}px)`.
- Outer container height: `rowVirtualizer.getTotalSize()`.
- `getScrollElement` must point to the same stable scroll container ref as the outer scroll element. When data or `rows.length` changes, use a `key` or state to force recalculation.
