/**
 * Shared currency formatter. Previously this same function was copy-pasted
 * (with slightly different signatures) in 7 different files, and none of
 * them actually used the `currency_symbol` application setting added in
 * Week 6 — every price in the app was silently unformatted or hardcoded
 * to "$". This single implementation is used everywhere instead, and
 * accepts the symbol from useCurrencySymbol() so it stays in sync with
 * Settings.
 */
export function formatCurrency(value, symbol = "$") {
  const number = Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${symbol}${number}`;
}
