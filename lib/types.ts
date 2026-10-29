export type AssetClass = 'crypto' | 'tradfi' | 'forex' | 'index' | 'commodity';

export type Direction = 'long' | 'short';

export type SetupType =
  | 'breakout'
  | 'pullback'
  | 'range-break'
  | 'momentum'
  | 'reversal'
  | 'trend-follow';

export interface MarketInstrument {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  exchange: string;
  price: number;
  changePct: number;
  volume: number;
  liquidityScore: number;
  favorite?: boolean;
}

export interface SetupScore {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  direction: Direction;
  setupType: SetupType;
  score: number;
  confidence: number;
  entry: number;
  stop: number;
  target: number;
  rr: number;
  riskPct: number;
  rationale: string;
  heatmapContext: string;
}

export interface TradeOutcome {
  id: string;
  symbol: string;
  direction: Direction;
  pnl: number;
  result: 'win' | 'loss';
  setupType: SetupType;
  date: string;
}
