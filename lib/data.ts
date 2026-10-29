import { generateSetupScores } from '@/services/scoring/setup-engine';
import { instruments as defaultInstruments, tradeHistory as defaultTrades, marketSummary as defaultSummary } from '@/lib/mock-data';
import { runDailyLearningLoop } from '@/services/learning/daily-loop';

export async function getMarketSnapshot() {
  const instruments = defaultInstruments;
  const setups = generateSetupScores(instruments);
  const learning = runDailyLearningLoop(setups, defaultTrades);

  return {
    instruments,
    setups: learning.updatedScores,
    trades: defaultTrades,
    summary: {
      ...defaultSummary,
      avgSetupScore: Math.round(learning.updatedScores.reduce((sum, item) => sum + item.score, 0) / learning.updatedScores.length),
    },
    learning,
  };
}
