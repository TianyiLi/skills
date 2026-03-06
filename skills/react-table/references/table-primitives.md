# Table UI primitives

Usage summary for the project’s Table components (`common/components/ui/table`).

- **Normal row**: `TableRow`
- **Selectable row**: `SelectableTableRow`, with `row.toggleSelected()` and `data-state={row.getIsSelected() && 'selected'}` for selection state

**Structure example**

```tsx
<Table>
  <TableHeader>
    <TableRow>
      {headers.map((header) => (
        <TableHead key={header.id} style={{ width: header.getSize() }}>
          {flexRender(header.column.columnDef.header, header.getContext())}
        </TableHead>
      ))}
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.map((row) => (
      <TableRow key={row.id}>
        {/* Use SelectableTableRow when selection is enabled */}
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
</Table>
```

With virtualization, `TableBody` often uses `display: grid` and `position: relative`; rows use `position: absolute` and `translateY` for positioning.
