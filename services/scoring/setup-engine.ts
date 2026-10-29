import { SetupScore, SetupType, Direction, AssetClass } from '@/lib/types';

const baseWeights = {
  trend: 0.22,
  momentum: 0.18,
  volume: 0.16,
  liquidity: 0.15,
  structure: 0.14,
  riskReward: 0.1,
  regime: 0.05,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function pickSetupType(index: number, changePct: number): SetupType {
  if (changePct > 2.5) return index % 2 === 0 ? 'breakout' : 'momentum';
  if (changePct > 0.5) return 'pullback';
  if (Math.abs(changePct) < 0.8) return 'range-break';
  return 'trend-follow';
}

function directionFromChange(changePct: number): Direction {
  return changePct >= 0 ? 'long' : 'short';
}

export function generateSetupScores(instruments: Array<{ symbol: string; name: string; assetClass: AssetClass; price: number; changePct: number; volume: number; liquidityScore: number }>): SetupScore[] {
  return instruments.map((instrument, index) => {
    const direction = directionFromChange(instrument.changePct);
    const setupType = pickSetupType(index, instrument.changePct);
    const trendComponent = clamp((instrument.changePct + 5) * 6, 0, 100);
    const liquidityComponent = instrument.liquidityScore;
    const volumeComponent = clamp((instrument.volume / 1500000000) * 100, 0, 100);
    const structureComponent = clamp(55 + (instrument.changePct * 12), 15, 95);

    const rawScore =
      trendComponent * baseWeights.trend +
      clamp((instrument.changePct + 5) * 8, 0, 100) * baseWeights.momentum +
      volumeComponent * baseWeights.volume +
      liquidityComponent * baseWeights.liquidity +
      structureComponent * baseWeights.structure +
      clamp((instrument.liquidityScore + 15) / 2, 0, 100) * baseWeights.riskReward +
      (instrument.assetClass === 'crypto' ? 48 : 36) * baseWeights.regime;

    const score = clamp(Math.round(rawScore), 48, 98);
    const confidence = clamp(Math.round(score * 0.92), 50, 96);
    const entry = instrument.price;
    const riskPct = instrument.assetClass === 'crypto' ? 0.85 : 0.7;
    const stopMultiplier = direction === 'long' ? 1 - riskPct / 100 : 1 + riskPct / 100;
    const targetMultiplier = direction === 'long' ? 1 + (2.5 + index * 0.2) * riskPct / 100 : 1 - (2.3 + index * 0.2) * riskPct / 100;
    const stop = Number((entry * stopMultiplier).toFixed(4));
    const target = Number((entry * targetMultiplier).toFixed(4));
    const rr = Number(((Math.abs(target - entry) / Math.abs(entry - stop)) || 2.2).toFixed(2));

    let rationale = 'Price action remains constructive with healthy support and decent liquidity around the current zone.';
    if (setupType === 'breakout') rationale = 'Breakout confirmation is present with strong momentum and high relative volume.';
    if (setupType === 'pullback') rationale = 'Momentum remains strong while price re-enters a valid support zone for continuation.';
    if (setupType === 'range-break') rationale = 'Range expansion is active and the market is breaking cleanly through prior congestion.';
    if (setupType === 'trend-follow') rationale = 'Trend structure remains intact and the setup has improving breadth across the market.';

    const heatmapContext =
      instrument.assetClass === 'crypto'
        ? 'Liquidity is stacking around the current zone with liquidation pressure below the active price structure.'
        : 'Liquidity remains stable around the active price area with support and resistance holding strongly.';

    return {
      symbol: instrument.symbol,
      name: instrument.name,
      assetClass: instrument.assetClass,
      direction,
      setupType,
      score,
      confidence,
      entry,
      stop,
      target,
      rr,
      riskPct,
      rationale,
      heatmapContext,
    };
  });
}
