import BigNumber from 'bignumber.js';
import { getCommonDecimal } from './formatCommonNumbers';

export { BigNumber };

export function configureBigNumber() {
  BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
}

const TEN = new BigNumber(10);

export function powerOf10(n: number) {
  return TEN.pow(n);
}

const BIGNUMBER_ZERO = new BigNumber(0);

/**
 * Safely parse a value to a BigNumber instance. If the value
 * cannot be parsed (throws or NaN), return the fallback value.
 */
export function parseToBigNumber(
  value: BigNumber.Value,
  fallback: BigNumber = BIGNUMBER_ZERO,
): BigNumber {
  try {
    // fix has more than 15 significant digits
    const ret = new BigNumber(`${value}`);
    if (!ret.isNaN()) return ret;
  } catch (_e) {
    /* fallthrough */
  }
  return fallback;
}

export function bigNumberToBigInt(bn: BigNumber) {
  return BigInt(bn.integerValue().toFixed());
}

/**
 * Formats a BigNumber to a human-readable string with suffixes (K, M, B, T)
 * @param value - The value to format
 * @param decimals - Number of decimal places to show (default: 1)
 * @returns Formatted string (e.g., "1.15M", "1K", "1.23B")
 */
export function formatBigNumber(value: BigNumber.Value, decimals = 2): string {
  const bn = value instanceof BigNumber ? value : parseToBigNumber(`${value}`);
  const decimalsToUse = bn.abs().lt(1) ? getCommonDecimal(bn) : decimals;

  if (bn.isZero()) return '0';

  const suffixes = [
    { value: 1e12, suffix: 'T' },
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' },
  ];

  for (const { value: threshold, suffix } of suffixes) {
    if (bn.abs().gte(threshold)) {
      const formatted = bn.div(threshold).toFixed(decimalsToUse);
      // Remove trailing zeros and unnecessary decimal point
      const clean = formatted.replace(/\.?0+$/, '');
      return clean + suffix;
    }
  }

  return bn.toFixed(decimalsToUse);
}

/**
 * Formats a BigNumber with currency prefix and optional suffix
 * @param value - The value to format
 * @param options - Formatting options
 * @returns Formatted string (e.g., "$1.5M", "1M SOL")
 */
export function formatBigNumberWithCurrency(
  value: BigNumber.Value,
  options: {
    prefix?: string;
    suffix?: string;
    decimals?: number;
  } = {},
): string {
  const { prefix = '', suffix = '', decimals = 2 } = options;
  const formatted = formatBigNumber(value, decimals);
  return `${prefix}${formatted}${suffix}`;
}
