import { BigNumber } from 'bignumber.js';
import { parseToBigNumber } from '@/modules/common/utils/bignumber';

// Unicode subscript characters mapping
const SUBSCRIPT_MAP: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
};
const regex = /\.(0+)(.+)/;

export function unicodeSubscriptionFormat(value: string) {
  const bn = parseToBigNumber(value);
  if (bn.isNaN() || bn.isZero()) return value;
  if (bn.gte(0.01)) return bn.dp(4, BigNumber.ROUND_HALF_CEIL).toString();
  const match = regex.exec(value);

  if (match === null) return value;
  const [, zeros, nums] = match;
  if (zeros.length === 1) return bn.dp(4, BigNumber.ROUND_HALF_CEIL).toString();

  const tailNum = parseToBigNumber(nums.slice(0, 4))
    .dividedBy(10000)
    .dp(4, BigNumber.ROUND_HALF_CEIL)
    .multipliedBy(10000)
    .toString();

  const leadingZeros = zeros.length - 1;

  // Convert the position of first significant digit to subscript (1-based)
  const firstSignificantPosition = leadingZeros + 1;
  const subscriptPosition = firstSignificantPosition
    .toString()
    .split('')
    .map((digit) => SUBSCRIPT_MAP[digit])
    .join('');

  return `0.0${subscriptPosition}${tailNum}`;
}
