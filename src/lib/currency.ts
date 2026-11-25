import { CurrencyCode } from '../types/estimator';

export const USD_TO_INR_RATE = 84;

export function formatCurrency(
  amountUsd: number | null | undefined,
  currency: CurrencyCode,
  compact = false
): string {
  if (amountUsd === null || amountUsd === undefined || isNaN(amountUsd)) {
    return '—';
  }

  const isINR = currency === 'INR';
  const val = isINR ? amountUsd * USD_TO_INR_RATE : amountUsd;
  const symbol = isINR ? '₹' : '$';

  if (compact) {
    if (isINR) {
      if (Math.abs(val) >= 10000000) {
        return `${symbol}${(val / 10000000).toFixed(2)} Cr`;
      }
      if (Math.abs(val) >= 100000) {
        return `${symbol}${(val / 100000).toFixed(1)} L`;
      }
      if (Math.abs(val) >= 1000) {
        return `${symbol}${(val / 1000).toFixed(1)}k`;
      }
      return `${symbol}${Math.round(val)}`;
    } else {
      if (Math.abs(val) >= 1000000) {
        return `${symbol}${(val / 1000000).toFixed(1)}M`;
      }
      if (Math.abs(val) >= 1000) {
        return `${symbol}${(val / 1000).toFixed(1)}k`;
      }
      return `${symbol}${Math.round(val)}`;
    }
  }

  // Full formatted with commas
  const rounded = Math.round(val);
  const formatted = rounded.toLocaleString(isINR ? 'en-IN' : 'en-US');
  return `${symbol}${formatted}`;
}

export function formatNumber(num: number | null | undefined, compact = false): string {
  if (num === null || num === undefined || isNaN(num)) return '—';
  if (compact) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return `${num}`;
  }
  return num.toLocaleString();
}
