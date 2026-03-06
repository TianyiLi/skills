# Minimal DataTable

For simple tables that only need the core row model—no selection, virtualization, or custom filters.

Use the project’s built-in `DataTable` with `columns` and `data`. It uses `getCoreRowModel: getCoreRowModel()` internally.

```tsx
import { DataTable } from '@/modules/common/components/ui/data-table';

<DataTable columns={columns} data={data} />
```
