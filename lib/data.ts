import { setupScores, instruments, marketSummary, tradeHistory } from './mock-data';

export async function getMarketSnapshot() {
  return {
    instruments,
    setups: setupScores,
    summary: marketSummary,
    trades: tradeHistory,
  };
}
