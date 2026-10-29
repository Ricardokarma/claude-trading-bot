export type FreeTierProvider = 'coingecko' | 'binance' | 'yahoo' | 'finnhub' | 'alphavantage';

export const FREE_TIER_PROVIDERS: FreeTierProvider[] = [
  'coingecko',
  'binance',
  'yahoo',
  'finnhub',
  'alphavantage',
];

export const PROVIDER_PRIORITY: Record<FreeTierProvider, number> = {
  coingecko: 1,
  binance: 2,
  yahoo: 3,
  finnhub: 4,
  alphavantage: 5,
};

export function getPublicDataProviders() {
  return FREE_TIER_PROVIDERS.map((provider) => ({
    provider,
    enabled: true,
    priority: PROVIDER_PRIORITY[provider],
  }));
}
