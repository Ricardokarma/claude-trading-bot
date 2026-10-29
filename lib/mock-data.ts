import { SetupScore, TradeOutcome } from './types';

const baseInstruments = [
  { symbol: 'BTCUSDT', name: 'Bitcoin', assetClass: 'crypto', exchange: 'OKX', price: 62450.12, changePct: 2.8, volume: 2600000000, liquidityScore: 98, favorite: true },
  { symbol: 'ETHUSDT', name: 'Ethereum', assetClass: 'crypto', exchange: 'OKX', price: 3420.4, changePct: 1.7, volume: 1900000000, liquidityScore: 95, favorite: true },
  { symbol: 'SOLUSDT', name: 'Solana', assetClass: 'crypto', exchange: 'OKX', price: 148.05, changePct: 3.3, volume: 980000000, liquidityScore: 92, favorite: true },
  { symbol: 'XRPUSDT', name: 'XRP', assetClass: 'crypto', exchange: 'OKX', price: 0.58, changePct: -0.6, volume: 730000000, liquidityScore: 88 },
  { symbol: 'ADAUSDT', name: 'Cardano', assetClass: 'crypto', exchange: 'OKX', price: 0.72, changePct: 1.2, volume: 540000000, liquidityScore: 84 },
  { symbol: 'DOGEUSDT', name: 'Dogecoin', assetClass: 'crypto', exchange: 'OKX', price: 0.15, changePct: 4.9, volume: 930000000, liquidityScore: 90 },
  { symbol: 'NVDA', name: 'NVIDIA', assetClass: 'tradfi', exchange: 'NASDAQ', price: 138.2, changePct: 1.8, volume: 38000000, liquidityScore: 93, favorite: true },
  { symbol: 'AAPL', name: 'Apple', assetClass: 'tradfi', exchange: 'NASDAQ', price: 214.12, changePct: 0.9, volume: 24000000, liquidityScore: 91 },
  { symbol: 'NASDAQ', name: 'Nasdaq 100', assetClass: 'index', exchange: 'NASDAQ', price: 20240.0, changePct: 1.1, volume: 16000000, liquidityScore: 90 },
  { symbol: 'EURUSD', name: 'Euro / US Dollar', assetClass: 'forex', exchange: 'FX', price: 1.0834, changePct: 0.5, volume: 120000000, liquidityScore: 94 },
];

export const instruments = baseInstruments;

export const setupScores: SetupScore[] = [
  {
    symbol: 'BTCUSDT',
    name: 'Bitcoin',
    assetClass: 'crypto',
    direction: 'long',
    setupType: 'breakout',
    score: 91,
    confidence: 88,
    entry: 62340,
    stop: 61780,
    target: 63450,
    rr: 3.2,
    riskPct: 0.9,
    rationale: 'Trend breakout above prior high with strong volume confirmation and healthy liquidation pockets below support.',
    heatmapContext: 'Bid pressure is stacked near recent highs with heavy absorption below the breakout zone.'
  },
  {
    symbol: 'ETHUSDT',
    name: 'Ethereum',
    assetClass: 'crypto',
    direction: 'long',
    setupType: 'pullback',
    score: 87,
    confidence: 84,
    entry: 3388,
    stop: 3330,
    target: 3475,
    rr: 2.8,
    riskPct: 0.9,
    rationale: 'Healthy retracement into dynamic support while momentum remains positive and the broader trend stays intact.',
    heatmapContext: 'Liquidity is concentrated above prior swing highs with support absorbing the pullback.'
  },
  {
    symbol: 'SOLUSDT',
    name: 'Solana',
    assetClass: 'crypto',
    direction: 'long',
    setupType: 'momentum',
    score: 82,
    confidence: 79,
    entry: 146.4,
    stop: 141.8,
    target: 152.8,
    rr: 2.4,
    riskPct: 1.1,
    rationale: 'Momentum remains strong with higher highs and a clean relative volume expansion.',
    heatmapContext: 'Order book density remains supportive, with short liquidations clustered below recent structure.'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA',
    assetClass: 'tradfi',
    direction: 'long',
    setupType: 'trend-follow',
    score: 80,
    confidence: 76,
    entry: 136.4,
    stop: 133.3,
    target: 142.6,
    rr: 2.6,
    riskPct: 0.8,
    rationale: 'Trend remains structurally healthy with solid sector participation and a stable risk environment.',
    heatmapContext: 'Major liquidity remains above the current price area, reducing sharp volatility shocks.'
  },
];

export const tradeHistory: TradeOutcome[] = [
  { id: 't-1001', symbol: 'BTCUSDT', direction: 'long', pnl: 1.8, result: 'win', setupType: 'breakout', date: '2026-10-28' },
  { id: 't-1002', symbol: 'ETHUSDT', direction: 'short', pnl: -0.4, result: 'loss', setupType: 'range-break', date: '2026-10-27' },
  { id: 't-1003', symbol: 'SOLUSDT', direction: 'long', pnl: 1.1, result: 'win', setupType: 'momentum', date: '2026-10-26' },
  { id: 't-1004', symbol: 'NVDA', direction: 'long', pnl: 0.9, result: 'win', setupType: 'trend-follow', date: '2026-10-25' },
];

export const marketSummary = {
  marketMood: 'bullish',
  liquidations: 96,
  longShortRatio: 1.18,
  avgSetupScore: 85,
};
