# React Best Practices

**Version 1.0.0**  
Vercel Engineering  
January 2026

> **Note:**  
> This document is mainly for agents and LLMs to follow when maintaining,  
> generating, or refactoring React codebases. Humans  
> may also find it useful, but guidance here is optimized for automation  
> and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive performance optimization guide for React applications, designed for AI agents and LLMs. Contains rules across 7 categories, prioritized by impact from critical (eliminating waterfalls, reducing bundle size) to incremental (advanced patterns). Each rule includes detailed explanations, real-world examples comparing incorrect vs. correct implementations, and specific impact metrics to guide automated refactoring and code generation.

---

## Table of Contents

1. [Eliminating Waterfalls](#1-eliminating-waterfalls) — **CRITICAL**
   - 1.1 [Defer Await Until Needed](#11-defer-await-until-needed)
   - 1.2 [Dependency-Based Parallelization](#12-dependency-based-parallelization)
   - 1.3 [Promise.all() for Independent Operations](#13-promiseall-for-independent-operations)
   - 1.4 [Strategic Suspense Boundaries](#14-strategic-suspense-boundaries)
2. [Bundle Size Optimization](#2-bundle-size-optimization) — **CRITICAL**
   - 2.1 [Avoid Barrel File Imports](#21-avoid-barrel-file-imports)
   - 2.2 [Conditional Module Loading](#22-conditional-module-loading)
   - 2.3 [Preload Based on User Intent](#23-preload-based-on-user-intent)
3. [Client-Side Data Fetching](#3-client-side-data-fetching) — **MEDIUM-HIGH**
   - 3.1 [Deduplicate Global Event Listeners](#31-deduplicate-global-event-listeners)
   - 3.2 [Use Passive Event Listeners for Scrolling Performance](#32-use-passive-event-listeners-for-scrolling-performance)
   - 3.3 [Use SWR for Automatic Deduplication](#33-use-swr-for-automatic-deduplication)
   - 3.4 [Version and Minimize localStorage Data](#34-version-and-minimize-localstorage-data)
4. [Re-render Optimization](#4-re-render-optimization) — **MEDIUM**
   - 4.1 [Calculate Derived State During Rendering](#41-calculate-derived-state-during-rendering)
   - 4.2 [Defer State Reads to Usage Point](#42-defer-state-reads-to-usage-point)
   - 4.3 [Do not wrap a simple expression with a primitive result type in useMemo](#43-do-not-wrap-a-simple-expression-with-a-primitive-result-type-in-usememo)
   - 4.4 [Extract Default Non-primitive Parameter Value from Memoized Component to Constant](#44-extract-default-non-primitive-parameter-value-from-memoized-component-to-constant)
   - 4.5 [Extract to Memoized Components](#45-extract-to-memoized-components)
   - 4.6 [Narrow Effect Dependencies](#46-narrow-effect-dependencies)
   - 4.7 [Put Interaction Logic in Event Handlers](#47-put-interaction-logic-in-event-handlers)
   - 4.8 [Subscribe to Derived State](#48-subscribe-to-derived-state)
   - 4.9 [Use Functional setState Updates](#49-use-functional-setstate-updates)
   - 4.10 [Use Lazy State Initialization](#410-use-lazy-state-initialization)
   - 4.11 [Use Transitions for Non-Urgent Updates](#411-use-transitions-for-non-urgent-updates)
   - 4.12 [Use useRef for Transient Values](#412-use-useref-for-transient-values)
5. [Rendering Performance](#5-rendering-performance) — **MEDIUM**
   - 5.1 [Animate SVG Wrapper Instead of SVG Element](#51-animate-svg-wrapper-instead-of-svg-element)
   - 5.2 [CSS content-visibility for Long Lists](#52-css-content-visibility-for-long-lists)
   - 5.3 [Hoist Static JSX Elements](#53-hoist-static-jsx-elements)
   - 5.4 [Optimize SVG Precision](#54-optimize-svg-precision)
   - 5.5 [Prevent Hydration Mismatch Without Flickering](#55-prevent-hydration-mismatch-without-flickering)
   - 5.6 [Suppress Expected Hydration Mismatches](#56-suppress-expected-hydration-mismatches)
   - 5.7 [Use Activity Component for Show/Hide](#57-use-activity-component-for-showhide)
   - 5.8 [Use Explicit Conditional Rendering](#58-use-explicit-conditional-rendering)
   - 5.9 [Use useTransition Over Manual Loading States](#59-use-usetransition-over-manual-loading-states)
6. [JavaScript Performance](#6-javascript-performance) — **LOW-MEDIUM**
   - 6.1 [Avoid Layout Thrashing](#61-avoid-layout-thrashing)
   - 6.2 [Build Index Maps for Repeated Lookups](#62-build-index-maps-for-repeated-lookups)
   - 6.3 [Cache Property Access in Loops](#63-cache-property-access-in-loops)
   - 6.4 [Cache Repeated Function Calls](#64-cache-repeated-function-calls)
   - 6.5 [Cache Storage API Calls](#65-cache-storage-api-calls)
   - 6.6 [Combine Multiple Array Iterations](#66-combine-multiple-array-iterations)
   - 6.7 [Early Length Check for Array Comparisons](#67-early-length-check-for-array-comparisons)
   - 6.8 [Early Return from Functions](#68-early-return-from-functions)
   - 6.9 [Hoist RegExp Creation](#69-hoist-regexp-creation)
   - 6.10 [Use Loop for Min/Max Instead of Sort](#610-use-loop-for-minmax-instead-of-sort)
   - 6.11 [Use Set/Map for O(1) Lookups](#611-use-setmap-for-o1-lookups)
   - 6.12 [Use toSorted() Instead of sort() for Immutability](#612-use-tosorted-instead-of-sort-for-immutability)
7. [Advanced Patterns](#7-advanced-patterns) — **LOW**
   - 7.1 [Initialize App Once, Not Per Mount](#71-initialize-app-once-not-per-mount)
   - 7.2 [Store Event Handlers in Refs](#72-store-event-handlers-in-refs)
   - 7.3 [useEffectEvent for Stable Callback Refs](#73-useeffectevent-for-stable-callback-refs)

---

## 1. Eliminating Waterfalls

**Impact: CRITICAL**

Waterfalls are the #1 performance killer. Each sequential await adds full network latency. Eliminating them yields the largest gains.

### 1.1 Defer Await Until Needed

**Impact: HIGH (avoids blocking unused code paths)**

Move `await` operations into the branches where they're actually used to avoid blocking code paths that don't need them.

**Incorrect: blocks both branches**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)
  
  if (skipProcessing) {
    // Returns immediately but still waited for userData
    return { skipped: true }
  }
  
  // Only this branch uses userData
  return processUserData(userData)
}
```

**Correct: only blocks when needed**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    // Returns immediately without waiting
    return { skipped: true }
  }
  
  // Fetch only when needed
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

### 1.2 Dependency-Based Parallelization

**Impact: CRITICAL (2-10× improvement)**

For operations with partial dependencies, use `better-all` to maximize parallelism. It automatically starts each task at the earliest possible moment.

**Incorrect: profile waits for config unnecessarily**

```typescript
const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig()
])
const profile = await fetchProfile(user.id)
```

**Correct: config and profile run in parallel**

```typescript
import { all } from 'better-all'

const { user, config, profile } = await all({
  async user() { return fetchUser() },
  async config() { return fetchConfig() },
  async profile() {
    return fetchProfile((await this.$.user).id)
  }
})
```

### 1.3 Promise.all() for Independent Operations

**Impact: CRITICAL (2-10× improvement)**

When async operations have no interdependencies, execute them concurrently using `Promise.all()`.

**Incorrect: sequential execution, 3 round trips**

```typescript
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

**Correct: parallel execution, 1 round trip**

```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

### 1.4 Strategic Suspense Boundaries

**Impact: HIGH (faster initial paint)**

Instead of awaiting data in async components before returning JSX, use Suspense boundaries to show the wrapper UI faster while data loads.

**Incorrect: wrapper blocked by data fetching**

```tsx
async function Page() {
  const data = await fetchData() // Blocks entire page
  
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <DataDisplay data={data} />
      </div>
      <div>Footer</div>
    </div>
  )
}
```

The entire layout waits for data even though only the middle section needs it.

**Correct: wrapper shows immediately, data streams in**

```tsx
function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <Suspense fallback={<Skeleton />}>
          <DataDisplay />
        </Suspense>
      </div>
      <div>Footer</div>
    </div>
  )
}

async function DataDisplay() {
  const data = await fetchData() // Only blocks this component
  return <div>{data.content}</div>
}
```

---

## 2. Bundle Size Optimization

**Impact: CRITICAL**

Reducing initial bundle size improves Time to Interactive and Largest Contentful Paint.

### 2.1 Avoid Barrel File Imports

**Impact: CRITICAL (200-800ms import cost, slow builds)**

Import directly from source files instead of barrel files to avoid loading thousands of unused modules.

**Incorrect: imports entire library**

```tsx
import { Check, X, Menu } from 'lucide-react'
import { Button, TextField } from '@mui/material'
```

**Correct: imports only what you need**

```tsx
import Check from 'lucide-react/dist/esm/icons/check'
import X from 'lucide-react/dist/esm/icons/x'
import Menu from 'lucide-react/dist/esm/icons/menu'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
```

### 2.2 Conditional Module Loading

**Impact: HIGH (loads large data only when needed)**

Load large data or modules only when a feature is activated.

**Example: lazy-load animation frames**

```tsx
function AnimationPlayer({ enabled, setEnabled }: { enabled: boolean; setEnabled: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [frames, setFrames] = useState<Frame[] | null>(null)

  useEffect(() => {
    if (enabled && !frames && typeof window !== 'undefined') {
      import('./animation-frames.js')
        .then(mod => setFrames(mod.frames))
        .catch(() => setEnabled(false))
    }
  }, [enabled, frames, setEnabled])

  if (!frames) return <Skeleton />
  return <Canvas frames={frames} />
}
```

### 2.3 Preload Based on User Intent

**Impact: MEDIUM (reduces perceived latency)**

Preload heavy bundles before they're needed to reduce perceived latency.

**Example: preload on hover/focus**

```tsx
function EditorButton({ onClick }: { onClick: () => void }) {
  const preload = () => {
    if (typeof window !== 'undefined') {
      void import('./monaco-editor')
    }
  }

  return (
    <button
      onMouseEnter={preload}
      onFocus={preload}
      onClick={onClick}
    >
      Open Editor
    </button>
  )
}
```

---

## 3. Client-Side Data Fetching

**Impact: MEDIUM-HIGH**

Automatic deduplication and efficient data fetching patterns reduce redundant network requests.

### 3.1 Deduplicate Global Event Listeners

**Impact: LOW (single listener for N components)**

Use `useSWRSubscription()` to share global event listeners across component instances.

### 3.2 Use Passive Event Listeners for Scrolling Performance

**Impact: MEDIUM (eliminates scroll delay caused by event listeners)**

Add `{ passive: true }` to touch and wheel event listeners to enable immediate scrolling.

### 3.3 Use SWR for Automatic Deduplication

**Impact: MEDIUM-HIGH (automatic deduplication)**

SWR enables request deduplication, caching, and revalidation across component instances.

**Incorrect: no deduplication, each instance fetches**

```tsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])
}
```

**Correct: multiple instances share one request**

```tsx
import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

### 3.4 Version and Minimize localStorage Data

**Impact: MEDIUM (prevents schema conflicts, reduces storage size)**

Add version prefix to keys and store only needed fields.

---

## 4. Re-render Optimization

**Impact: MEDIUM**

Reducing unnecessary re-renders minimizes wasted computation and improves UI responsiveness.

### 4.1 Calculate Derived State During Rendering

**Impact: MEDIUM (avoids redundant renders and state drift)**

If a value can be computed from current props/state, do not store it in state or update it in an effect. Derive it during render.

### 4.2 Defer State Reads to Usage Point

**Impact: MEDIUM (avoids unnecessary subscriptions)**

Don't subscribe to dynamic state (searchParams, localStorage) if you only read it inside callbacks.

### 4.3 Do not wrap a simple expression with a primitive result type in useMemo

**Impact: LOW-MEDIUM (wasted computation on every render)**

When an expression is simple (few logical or arithmetical operators) and has a primitive result type (boolean, number, string), do not wrap it in `useMemo`.

### 4.4 Extract Default Non-primitive Parameter Value from Memoized Component to Constant

**Impact: MEDIUM (restores memoization by using a constant for default value)**

Extract default non-primitive parameter values to constants to preserve reference equality.

### 4.5 Extract to Memoized Components

**Impact: MEDIUM (enables early returns)**

Extract expensive work into memoized components to enable early returns before computation.

### 4.6 Narrow Effect Dependencies

**Impact: LOW (minimizes effect re-runs)**

Specify primitive dependencies instead of objects to minimize effect re-runs.

### 4.7 Put Interaction Logic in Event Handlers

**Impact: MEDIUM (avoids effect re-runs and duplicate side effects)**

If a side effect is triggered by a specific user action (submit, click, drag), run it in that event handler.

### 4.8 Subscribe to Derived State

**Impact: MEDIUM (reduces re-render frequency)**

Subscribe to derived boolean state instead of continuous values to reduce re-render frequency.

### 4.9 Use Functional setState Updates

**Impact: MEDIUM (prevents stale closures and unnecessary callback recreations)**

When updating state based on the current state value, use the functional update form of setState.

### 4.10 Use Lazy State Initialization

**Impact: MEDIUM (wasted computation on every render)**

Pass a function to `useState` for expensive initial values.

### 4.11 Use Transitions for Non-Urgent Updates

**Impact: MEDIUM (maintains UI responsiveness)**

Mark frequent, non-urgent state updates as transitions to maintain UI responsiveness.

### 4.12 Use useRef for Transient Values

**Impact: MEDIUM (avoids unnecessary re-renders on frequent updates)**

When a value changes frequently and you don't want a re-render on every update, store it in `useRef`.

---

## 5. Rendering Performance

**Impact: MEDIUM**

Optimizing the rendering process reduces the work the browser needs to do.

### 5.1 Animate SVG Wrapper Instead of SVG Element

**Impact: LOW (enables hardware acceleration)**

Wrap SVG in a `<div>` and animate the wrapper instead to enable hardware acceleration.

### 5.2 CSS content-visibility for Long Lists

**Impact: HIGH (faster initial render)**

Apply `content-visibility: auto` to defer off-screen rendering.

### 5.3 Hoist Static JSX Elements

**Impact: LOW (avoids re-creation)**

Extract static JSX outside components to avoid re-creation.

### 5.4 Optimize SVG Precision

**Impact: LOW (reduces file size)**

Reduce SVG coordinate precision to decrease file size.

### 5.5 Prevent Hydration Mismatch Without Flickering

**Impact: MEDIUM (avoids visual flicker and hydration errors)**

Inject a synchronous script that updates the DOM before React hydrates to prevent flickering for client-only data like themes.

### 5.6 Suppress Expected Hydration Mismatches

**Impact: LOW-MEDIUM (avoids noisy hydration warnings for known differences)**

For expected mismatches (timestamps, random IDs), wrap the dynamic text in an element with `suppressHydrationWarning`.

### 5.7 Use Activity Component for Show/Hide

**Impact: MEDIUM (preserves state/DOM)**

Use React's `<Activity>` to preserve state/DOM for expensive components that frequently toggle visibility.

### 5.8 Use Explicit Conditional Rendering

**Impact: LOW (prevents rendering 0 or NaN)**

Use explicit ternary operators (`? :`) instead of `&&` for conditional rendering.

### 5.9 Use useTransition Over Manual Loading States

**Impact: LOW (reduces re-renders and improves code clarity)**

Use `useTransition` instead of manual `useState` for loading states.

---

## 6. JavaScript Performance

**Impact: LOW-MEDIUM**

Micro-optimizations for hot paths can add up to meaningful improvements.

### 6.1 Avoid Layout Thrashing
### 6.2 Build Index Maps for Repeated Lookups
### 6.3 Cache Property Access in Loops
### 6.4 Cache Repeated Function Calls
### 6.5 Cache Storage API Calls
### 6.6 Combine Multiple Array Iterations
### 6.7 Early Length Check for Array Comparisons
### 6.8 Early Return from Functions
### 6.9 Hoist RegExp Creation
### 6.10 Use Loop for Min/Max Instead of Sort
### 6.11 Use Set/Map for O(1) Lookups
### 6.12 Use toSorted() Instead of sort() for Immutability

---

## 7. Advanced Patterns

**Impact: LOW**

Advanced patterns for specific cases that require careful implementation.

### 7.1 Initialize App Once, Not Per Mount
### 7.2 Store Event Handlers in Refs
### 7.3 useEffectEvent for Stable Callback Refs