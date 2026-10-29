export type FreeTierProvider = 'coingecko' | 'binance' | 'finnhub' | 'alphavantage' | 'yahoo';

const DEFAULT_TIMEOUT = 7000;

async function fetchJson<T>(url: string, timeout = DEFAULT_TIMEOUT): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'ClaudeTradingBot/1.0',
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchCoinGeckoPrices(ids: string[]) {
  const idString = ids.join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${idString}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;
  return (await fetchJson<Record<string, { usd: number; usd_24h_change: number; usd_24h_vol: number }>>(url)) ?? {};
}

export async function fetchBinanceTickerPrices(symbols: string[]) {
  const prices: Record<string, number> = {};

  for (const symbol of symbols) {
    const data = await fetchJson<{ symbol: string; price: string }>(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
    if (data && data.symbol && data.price) {
      prices[data.symbol] = Number(data.price);
    }
  }

  return prices;
}

export async function fetchYahooQuotes(symbols: string[]) {
  const query = symbols.join(',');
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${query}`;
  const payload = await fetchJson<{ quoteResponse?: { result?: Array<{ symbol?: string; regularMarketPrice?: number; regularMarketChangePercent?: number; marketState?: string }> } }>(url, 8000);

  const result: Record<string, { price: number; changePct: number }> = {};
  for (const item of payload?.quoteResponse?.result ?? []) {
    if (!item.symbol) continue;
    result[item.symbol] = {
      price: item.regularMarketPrice ?? 0,
      changePct: item.regularMarketChangePercent ?? 0,
    };
  }

  return result;
}

export async function fetchFinnhubQuotes(symbols: string[]) {
  const token = process.env.FINNHUB_API_KEY;
  if (!token) return {};

  const results: Record<string, { price: number; changePct: number }> = {};

  for (const symbol of symbols) {
    const data = await fetchJson<{ c?: number; dp?: number }>(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${token}`, 8000);
    if (data && typeof data.c === 'number') {
      results[symbol] = {
        price: data.c,
        changePct: typeof data.dp === 'number' ? data.dp : 0,
      };
    }
  }

  return results;
}

export async function fetchAlphaVantageQuotes(symbols: string[]) {
  const token = process.env.ALPHA_VANTAGE_API_KEY;
  if (!token) return {};

  const results: Record<string, { price: number; changePct: number }> = {};

  for (const symbol of symbols) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${token}`;
    const data = await fetchJson<{ 'Global Quote'?: { '05. price'?: string; '10. change percent'?: string } }>(url, 8000);
    const quote = data?.['Global Quote'];

    if (quote && quote['05. price']) {
      results[symbol] = {
        price: Number(quote['05. price']),
        changePct: Number((quote['10. change percent'] ?? '0%').replace('%', '')) || 0,
      };
    }
  }

  return results;
}

export const FREE_TIER_PROVIDERS: FreeTierProvider[] = ['coingecko', 'binance', 'yahoo', 'finnhub', 'alphavantage'];
