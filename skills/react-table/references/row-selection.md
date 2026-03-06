# Row selection

Single-row selection: enable `enableRowSelection`, set `enableMultiRowSelection: false`, use `SelectableTableRow` and handle clicks with `row.toggleSelected()`. Read selection via `getSelectedRowModel()`.

**Container: enable selection**

```tsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  enableRowSelection: true,
  enableMultiRowSelection: false,
});
```

**Row: use SelectableTableRow and toggle selection on click**

```tsx
<SelectableTableRow
  key={row.id}
  data-state={row.getIsSelected() && 'selected'}
  onClick={() => row.toggleSelected()}
>
  {row.getVisibleCells().map((cell) => (
    <TableCell key={cell.id}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  ))}
</SelectableTableRow>
```

Get selected rows: `table.getSelectedRowModel().rows` (or `.map((row) => row.original)` for data).
