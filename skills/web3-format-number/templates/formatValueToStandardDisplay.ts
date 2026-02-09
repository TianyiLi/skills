import type BigNumber from 'bignumber.js';
import { formatBigNumber, parseToBigNumber } from './bignumber';
import { formatCommonNumber } from './formatCommonNumbers';
import { unicodeSubscriptionFormat } from './unicodeSubscriptionFormat';
export default function formatValueToStandardDisplay(value: BigNumber.Value) {
	const isSmallAmount = parseToBigNumber(value).lte(1000);
	const isUnderOne = parseToBigNumber(value).lt(0.01);
	if (!isSmallAmount) return formatBigNumber(value);
	if (!isUnderOne) return formatCommonNumber(value.toString());
	return unicodeSubscriptionFormat(value.toString());
}
