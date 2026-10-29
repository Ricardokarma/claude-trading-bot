export type ProviderMode = 'free' | 'paid';

export const FREE_PROVIDER_CONFIG = {
  crypto: {
    primary: 'coingecko',
    fallback: ['binance', 'yahoo'],
  },
  stocks: {
    primary: 'yahoo',
    fallback: ['alphavantage', 'finnhub'],
  },
  ai: {
    primary: 'ollama',
    fallback: ['openai', 'anthropic'],
  },
};

export function getEnabledProviders() {
  const providers = {
    coingecko: true,
    binance: true,
    yahoo: true,
    finnhub: Boolean(process.env.FINNHUB_API_KEY),
    alphavantage: Boolean(process.env.ALPHA_VANTAGE_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    ollama: true,
    binanceExchange: Boolean(process.env.BINANCE_API_KEY && process.env.BINANCE_SECRET_KEY),
    okxExchange: Boolean(process.env.OKX_API_KEY && process.env.OKX_SECRET_KEY && process.env.OKX_PASSPHRASE),
  };

  return {
    mode: 'free',
    providers,
  };
}
