import { SetupScore, TradeOutcome } from '@/lib/types';

export interface LearningSummary {
  timestamp: string;
  bySetupType: Record<string, { winRate: number; averageRr: number; sampleSize: number; scoreAdjustment: number }>;
  recommendations: string[];
  updatedScores: SetupScore[];
}

export function runDailyLearningLoop(setups: SetupScore[], trades: TradeOutcome[]): LearningSummary {
  const byType: Record<string, { wins: number; total: number; rrSum: number; rrCount: number }> = {};

  for (const trade of trades) {
    const bucket = byType[trade.setupType] ?? { wins: 0, total: 0, rrSum: 0, rrCount: 0 };
    bucket.total += 1;
    if (trade.result === 'win') bucket.wins += 1;
    bucket.rrSum += trade.pnl > 0 ? Math.max(1, Math.abs(trade.pnl)) : 0.5;
    bucket.rrCount += 1;
    byType[trade.setupType] = bucket;
  }

  const bySetupType = Object.fromEntries(
    Object.entries(byType).map(([setupType, stats]) => {
      const winRate = stats.total ? stats.wins / stats.total : 0;
      const averageRr = stats.rrCount ? stats.rrSum / stats.rrCount : 1.4;
      const scoreAdjustment = winRate > 0.6 ? 5 : winRate < 0.35 ? -6 : 0;

      return [
        setupType,
        {
          winRate,
          averageRr,
          sampleSize: stats.total,
          scoreAdjustment,
        },
      ];
    })
  );

  const recommendations = [
    'Prioritize higher confidence breakouts with clean price structure and above-average liquidity.',
    'Reduce exposure in weak range environments with poor liquidation support and thin volume.',
    'Upweight momentum-oriented setups when market breadth remains strong.',
  ];

  const updatedScores = setups.map((setup) => {
    const stats = bySetupType[setup.setupType] ?? { winRate: 0.46, averageRr: 1.9, sampleSize: 0, scoreAdjustment: 0 };
    const adjustment = stats.scoreAdjustment + (setup.assetClass === 'crypto' ? 2 : 0) + (setup.confidence > 85 ? 2 : 0);
    const nextScore = Math.min(99, Math.max(40, setup.score + adjustment));

    return {
      ...setup,
      score: nextScore,
      confidence: Math.min(98, Math.max(45, Math.round(setup.confidence + adjustment * 0.7))),
    };
  });

  return {
    timestamp: new Date().toISOString(),
    bySetupType,
    recommendations,
    updatedScores,
  };
}
