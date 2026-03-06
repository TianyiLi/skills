# Multi-select + header checkbox

Multi-select rows with a “select all” header: use `table.getIsAllRowsSelected()` and `table.getToggleAllRowsSelectedHandler()` in the header for the checkbox; use `row.getIsSelected()` and `row.getToggleSelectedHandler()` in each cell.

**Header select-all**

```tsx
<TableHead>
  <input
    type="checkbox"
    checked={table.getIsAllRowsSelected()}
    ref={table.getToggleAllRowsSelectedHandler()}
  />
</TableHead>
```

**Cell checkbox**

```tsx
<TableCell>
  <input
    type="checkbox"
    checked={row.getIsSelected()}
    onChange={row.getToggleSelectedHandler()}
  />
</TableCell>
```

Set `enableRowSelection: true` and `enableMultiRowSelection: true` in `useReactTable`.
