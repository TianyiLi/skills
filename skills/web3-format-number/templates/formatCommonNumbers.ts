import { BigNumber } from 'bignumber.js';
import { parseToBigNumber } from '@/modules/common/utils/bignumber';

export function getCommonDecimal(amount: BigNumber) {
  if (amount.lt(0.01)) return 8;
  if (amount.lt(1)) return 6;
  if (amount.lt(10)) return 5;
  if (amount.lt(100)) return 4;
  if (amount.lt(1000)) return 3;
  return 2;
}

function formatNumberWithCommas(n: string) {
  const parts = n.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.').replace(/\.?0+$/, ''); // trim zero
}

export function formatNumber(
  amount: BigNumber | string | undefined,
  toFixedValue?: number,
) {
  const processAmount = BigNumber.isBigNumber(amount)
    ? amount
    : parseToBigNumber(amount ?? '');
  if (processAmount == null || processAmount.isNaN()) {
    return '-';
  }
  return typeof toFixedValue === 'number'
    ? formatNumberWithCommas(processAmount.toFixed(toFixedValue))
    : formatNumberWithCommas(processAmount.toFixed());
}

export function formatCommonNumber(
  amount: BigNumber | string | number | undefined,
) {
  const processAmount = BigNumber.isBigNumber(amount)
    ? amount
    : parseToBigNumber(amount ?? '');
  if (processAmount.isNaN()) {
    return '-';
  }
  if (processAmount.isZero()) return '0';
  if (processAmount.lt(0.000001)) return '< 0.000001';
  return formatNumber(processAmount, getCommonDecimal(processAmount));
}

export function formatUsdValue(amount: BigNumber | string | undefined) {
  const processAmount = BigNumber.isBigNumber(amount)
    ? amount
    : parseToBigNumber(amount ?? '');
  if (processAmount.isNaN()) {
    return '-';
  }
  if (processAmount.isZero()) return '0';
  if (processAmount.lt(0.01)) return '< 0.01';
  return formatNumber(processAmount, 2);
}

const percentageFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPercentageNumber(amount: number | string | undefined) {
  const processAmount =
    typeof amount === 'string' ? Number.parseFloat(amount) : amount;
  if (processAmount == null || Number.isNaN(processAmount)) {
    return '-';
  }

  if (processAmount === 0) return '0';
  if (Math.abs(processAmount) < 0.01) {
    return processAmount < 0 ? '< -0.01' : '< 0.01';
  }
  if (processAmount < 0) return percentageFormatter.format(processAmount);
  if (processAmount > 1000000) return '> 1,000k';
  if (processAmount > 10000)
    return `${percentageFormatter.format(processAmount / 1000)}k`;

  return percentageFormatter.format(processAmount);
}

export function formatProtectedUsdValue(balance: BigNumber, isHidden: boolean) {
  return isHidden ? '***' : formatUsdValue(balance);
}
