---
name: web3-format-number
description: "Use when displaying token balances or token values in UI, converting user input to bigint for contract writes, or doing math with wei/token amounts in viem or wagmi apps. Web3 number formatting with formatUnits, parseUnits, BigNumber, bigint naming (`Raw`, `Formatted`, `Bn`), decimals handling, and reusable display helpers. Triggers on token balance, formatUnits, parseUnits, wei, decimals, bigint, BigNumber, number formatting, or web3 display math."
---

# Web3 Format Number

Format web3 values for UI and contract writes without losing precision.

## Require These Tools

- `viem` or `wagmi` / `wagmi/actions`
- `bignumber.js`

## Name Values by Representation

- **primitive number value**: `{variableName}`
- **bigint from chain / before `formatUnits`**: `{variableName}Raw`
- **formatted string after `formatUnits`**: `{variableName}Formatted`
- **BigNumber instance**: `{variableName}Bn`

Keep the representation obvious in the variable name. This prevents mixing display values, math values, and contract-write values.

## Before Formatting or Converting, Ask

1. Is this value for **display only**, **math**, or a **contract write**?
2. Do I have the **correct token decimals** from the token config or contract?
3. Should this value stay `bigint`, become a formatted string, or become `BigNumber` for math?

## Choose the Representation

| Situation | Use | Why |
|-----------|-----|-----|
| Read from contract | `bigint` + `formatUnits` | Keep onchain precision, format only for UI/math |
| User input before write | `parseUnits` to `bigint` | Convert display input back to raw contract value |
| Math on token values | `BigNumber` | Avoid JS float precision loss |
| General UI display | formatted string or display helper | Keep formatting decisions out of components |

## Follow These Flows

### Read From Contract

Use `bigint` as the source of truth. Keep the raw value as `*Raw`, then derive a formatted value.

```ts
function useTokenBalance() {
  const { data } = useReadContract(/** read user token balance */)

  const userTokenBalanceRaw = data

  return {
    userTokenBalanceRaw,
    userTokenBalanceFormatted: formatUnits(data ?? 0n, /** token decimals */ 18),
  }
}
```

### Convert Input for Contract Writes

Parse user-entered display values to raw `bigint` right before the write.

```ts
import type BigNumber from 'bignumber.js'
import { parseUnits } from 'viem'

function useSendToken(inputAmount: BigNumber.Value) {
  const { mutateAsync } = useWriteContract()

  function sendToken() {
    const inputAmountRaw = parseUnits(String(inputAmount), /** token decimals */ 18)

    return mutateAsync({
      /** erc20 send token */
    })
  }
}
```

### Do Math Safely

Align decimals first, then do math in `BigNumber`, then convert back to raw for contract writes.

```ts
const inputTokenRaw = 20000000000000000000n
const rewardRate = 1.5

const inputTokenFormatted = formatUnits(inputTokenRaw, 18)
const rewardTokenBn = BigNumber(inputTokenFormatted).mul(rewardRate)

const shouldMintTokenRaw = parseUnits(rewardTokenBn.toString(), 18)
```

### Display Values in UI

Use one display helper so components do not re-implement decimal or tiny-value rules.

```tsx
import { formatValueToStandardDisplay } from 'xxx/formatValueToStandardDisplay'

function DisplayTokenBalance({ tokenAmount }: { tokenAmount: BigNumber.Value }) {
  return <div>{formatValueToStandardDisplay(tokenAmount)}</div>
}
```

## Read Templates Only When Needed

- For a standard token/value display helper with large-number suffixes and tiny-value formatting, read `templates/formatValueToStandardDisplay.ts`.
- For comma separators, shared decimal rules, USD formatting, or percentages, read `templates/formatCommonNumbers.ts`.
- For `BigNumber` parsing, shared formatting, suffixes (`K`, `M`, `B`, `T`), or conversion helpers, read `templates/bignumber.ts`.
- For very small values that should render with Unicode subscript zero positions, read `templates/unicodeSubscriptionFormat.ts`.

**Do NOT read templates** when you only need the core viem flow (`formatUnits`, `parseUnits`, `bigint`) and are not implementing reusable display helpers.

## Anti-Patterns

- **Do not use JS `number` or float math** for token or wei values. Precision loss will corrupt display values and contract-write amounts.
- **Do not mix `Raw`, formatted strings, and `BigNumber` under the same variable meaning**. Convert deliberately and rename by representation.
- **Do not skip or guess token decimals** when calling `formatUnits` or `parseUnits`. Wrong decimals make both UI and writes wrong.
- **Do not send formatted display strings directly to contracts**. Convert them back to raw `bigint` with `parseUnits`.

## Notes

- Prefer `BigNumber` for math and `bigint` for onchain raw values.
- Keep `Raw` as `bigint` only.
- Keep reusable formatting logic in helpers, not scattered across components.