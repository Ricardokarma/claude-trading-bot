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
    fallback: ['venice', 'gemini'],
  },
} as const;

export function getEnabledProviders() {
  const providers = {
    coingecko: true,
    binance: true,
    yahoo: true,
    kraken: true,
    finnhub: Boolean(process.env.FINNHUB_API_KEY),
    alphavantage: Boolean(process.env.ALPHA_VANTAGE_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    gemini: Boolean(process.env.GEMINI_API_KEY),
    venice: true,
    ollama: true,
    binanceExchange: Boolean(process.env.BINANCE_API_KEY && process.env.BINANCE_SECRET_KEY),
    okxExchange: Boolean(process.env.OKX_API_KEY && process.env.OKX_SECRET_KEY && process.env.OKX_PASSPHRASE),
  };

  const paidProvidersEnabled = [
    providers.finnhub,
    providers.alphavantage,
    providers.openai,
    providers.anthropic,
    providers.gemini,
    providers.binanceExchange,
    providers.okxExchange,
  ].some(Boolean);

  return {
    mode: paidProvidersEnabled ? 'paid' : 'free',
    providers,
    recommendation: paidProvidersEnabled
      ? 'premium providers enabled, free/public providers remain available as backup'
      : 'free/public mode active: CoinGecko, Binance public, Yahoo fallback, local Ollama, Venice, Gemini fallback',
  };
}
