---
name: zustand
description: Use and structure Zustand stores for React and vanilla JS state management. Use when the user mentions Zustand, needs a store pattern, global state, persist state, or migrating from Redux/Context.
---

# Zustand

Guidance for using [Zustand](https://github.com/pmndrs/zustand) (create, stores, middleware, and scaling patterns). No provider required.

## Cursor rule

A file-scoped rule is provided at [rules/zustand-stores.mdc](rules/zustand-stores.mdc). Copy it to your project’s `.cursor/rules/` to get automatic reminders when editing store files.

## When to Apply

- Adding or refactoring Zustand stores
- Persisting state (e.g. localStorage)
- Splitting a large store into slices
- User asks about Zustand, global state, or store structure

## Store Basics

```ts
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}))
```

- **set(state | fn)**: Replace state or use updater `set((s) => ({ ... }))`.
- **get()**: Read current state inside actions (e.g. `get().count`).
- Prefer updater form for derived updates: `set((s) => ({ count: s.count + 1 }))`.

## Selectors and Re-renders

Select only what the component needs to avoid unnecessary re-renders.

```ts
// Bad – re-renders on any store change
const state = useStore()

// Good – re-renders only when count changes
const count = useStore((s) => s.count)
const inc = useStore((s) => s.inc)
```

Use **shallow** when selecting multiple fields:

```ts
import { useShallow } from 'zustand/react/shallow'

const { count, inc } = useStore(useShallow((s) => ({ count: s.count, inc: s.inc })))
```

## Middleware

### Persist (e.g. localStorage)

```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      token: null,
      setToken: (t) => set({ token: t }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ token: s.token }), // optional: persist only part
    },
  ),
)
```

For async storage (e.g. React Native), use a storage adapter that returns Promises; the store will rehydrate when the promise resolves.

### Devtools

```ts
import { devtools } from 'zustand/middleware'

const useStore = create(
  devtools(
    (set) => ({ ... }),
    { name: 'MyStore' },
  ),
)
```

### Combining Middleware

Order: store creator innermost, then devtools, then persist (so persist wraps the devtools-wrapped store).

```ts
create(
  persist(
    devtools((set) => ({ ... }), { name: 'AppStore' }),
    { name: 'app-storage' },
  ),
)
```

## Slices Pattern (Scaling)

Split one store into slice creators; compose them in a single `create` call.

```ts
const createAuthSlice = (set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
})

const createUiSlice = (set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
})

const useStore = create((...a) => ({
  ...createAuthSlice(...a),
  ...createUiSlice(...a),
}))
```

Each slice receives `(set, get, store)` and returns a plain object; avoid naming collisions between slices.

## Immer (Mutable-style Updates)

Use **immer** middleware when updaters are complex or nested.

```ts
import { immer } from 'zustand/middleware/immer'

const useStore = create(
  immer((set) => ({
    nested: { a: 1, b: { c: 2 } },
    updateC: (v) => set((s) => {
      s.nested.b.c = v
    }),
  })),
)
```

## TypeScript

Type the store state and actions; infer hook types from `create`.

```ts
interface BearState {
  bears: number
  addBear: () => void
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  addBear: () => set((s) => ({ bears: s.bears + 1 })),
}))
```

Use `create<State>()(...)` so middlewares keep correct typing.

## Vanilla (Outside React)

Same store can be used without React: `useStore.getState()`, `useStore.setState(...)`, `useStore.subscribe((state) => { ... })`.

## Anti-patterns

- **Don’t** put everything in one giant store; prefer slices or multiple stores by domain.
- **Don’t** select the whole store in components; use selectors or `useShallow` for multiple fields.
- **Don’t** forget `partialize` with persist when the store has non-serializable values (e.g. functions, class instances).

## Summary

| Need              | Use                          |
|-------------------|------------------------------|
| Basic store       | `create((set) => ({ ... }))` |
| Persist           | `persist(..., { name, storage })` |
| DevTools          | `devtools(...)`              |
| Nested updates    | `immer`                      |
| Scale store       | Slice functions + spread in `create` |
| Fewer re-renders  | Selectors or `useShallow`    |
