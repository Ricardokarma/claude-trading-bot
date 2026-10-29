import { generateSetupScores } from '@/services/scoring/setup-engine';
import { instruments as defaultInstruments, tradeHistory as defaultTrades, marketSummary as defaultSummary } from '@/lib/mock-data';
import { runDailyLearningLoop } from '@/services/learning/daily-loop';
import { getEnabledProviders } from '@/services/market-data/provider-mode';

export async function getMarketSnapshot(mode: 'all' | 'favorites' = 'all') {
  const providerStatus = getEnabledProviders();
  const instruments = defaultInstruments.filter((instrument) => {
    if (mode === 'favorites') return instrument.favorite === true;
    return true;
  });

  const setups = generateSetupScores(instruments);
  const learning = runDailyLearningLoop(setups, defaultTrades);

  return {
    instruments,
    setups: learning.updatedScores,
    trades: defaultTrades,
    providers: providerStatus,
    summary: {
      ...defaultSummary,
      avgSetupScore: Math.round(learning.updatedScores.reduce((sum, item) => sum + item.score, 0) / learning.updatedScores.length),
    },
    learning,
  };
}
