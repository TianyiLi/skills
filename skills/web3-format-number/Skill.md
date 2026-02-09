---
name: web3-format-number
description: |
  Web3 number formatting guidance for display and math.
---

## Requirements

- viem or wagmi (wagmi/actions)
- bignumber.js

## Variable Naming Conventions

- **primitive number value**: `{variableName}`
- **bigint (not `formatUnits` yet)**: `{variableName}Raw`
- **formatted string (after `formatUnits`)**: `{variableName}Formatted`
- **BigNumber**: `{variableName}Bn`

## When to use

- Display token balances or values in UI
- Convert user input to `bigint` for contract writes
- Do math in `BigNumber` to avoid precision loss

## Usage scenarios

### Data from read contract

```ts
function useTokenBalance() {
  /**
   * data: bigint
   */
  const { data } = useReadContract(/** read user token balance */)
  
  const userTokenBalanceRaw = data;

  return {
    userTokenBalanceRaw,
    userTokenBalanceFormatted: formatUnits(data, /** token decimals */ 18)
  }
}
```

### useState and write contract

```ts
import type BigNumber from 'bignumber.js';
import { parseUnits } from 'viem';

function useSendToken(inputAmount: BigNumber.Value) {
  const { mutateAsync } = useWriteContract()
  function sendToken() {
    const inputAmountRaw = parseUnits(String(inputAmount), /** token decimals */ 18)
    mutateAsync({
      /** erc20 send token */
    })
  }
}
```

### Calculating

```ts
/** data from contract */
const inputTokenRaw = 20000000000000000000n // 20 ** 1e18
const REWARD_RATE = 1.5

// Align decimals
const inputTokenFormatted = formatUnits(inputTokenRaw, 18)
const rewardTokenBn = BigNumber(inputTokenFormatted).mul(REWARD_RATE)

// send to contract transform to raw
const shouldMintTokenRaw = parseUnits(rewardTokenBn.toString(), 18)
```

### Display value

```tsx
import { formatValueToStandardDisplay } from 'xxx/formatValueToStandardDisplay.ts'

function DisplayTokenBalance({tokenAmount}: {tokenAmount: BigNumber.Value}) {
  return <div>
    {formatValueToStandardDisplay(tokenAmount)}
  </div>
}
```

## Notes

- Prefer `BigNumber` (or `bigint` + `formatUnits`) for math; avoid JS float math.
- Keep `Raw` as `bigint` only; do not mix with `BigNumber`.
- Always pass correct token decimals to `formatUnits` / `parseUnits`.

**[templates](templates)**