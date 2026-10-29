import {
  fetchAlphaVantageQuotes,
  fetchBinanceTickerPrices,
  fetchCoinGeckoPrices,
  fetchFinnhubQuotes,
  fetchYahooQuotes,
} from '@/services/market-data/free-tier';
import { instruments as mockInstruments, setupScores as mockSetups, tradeHistory as mockTrades, marketSummary as defaultSummary } from '@/lib/mock-data';

const cryptoIds = ['bitcoin', 'ethereum', 'solana', 'ripple', 'cardano', 'dogecoin'];
const cryptoSymbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT'];
const tradFiSymbols = ['NVDA', 'AAPL', 'NASDAQ', 'EURUSD'];

export async function getMarketSnapshot() {
  const geckoPrices = await fetchCoinGeckoPrices(cryptoIds);
  const binancePrices = await fetchBinanceTickerPrices(cryptoSymbols);
  const yahooPrices = await fetchYahooQuotes(tradFiSymbols);
  const finnhubPrices = await fetchFinnhubQuotes(['NVDA', 'AAPL']);
  const alphaPrices = await fetchAlphaVantageQuotes(['NASDAQ', 'EURUSD']);

  const instruments = mockInstruments.map((instrument) => {
    const isCrypto = instrument.assetClass === 'crypto';
    const isTradFi = instrument.assetClass === 'tradfi' || instrument.assetClass === 'index' || instrument.assetClass === 'forex';

    let livePrice = instrument.price;
    let liveChange = instrument.changePct;

    if (isCrypto) {
      const key = cryptoIds[cryptoSymbols.indexOf(instrument.symbol)] ?? instrument.symbol.toLowerCase();
      const coin = geckoPrices[key];
      if (coin) {
        livePrice = coin.usd ?? livePrice;
        liveChange = coin.usd_24h_change ?? liveChange;
      }

      const binancePrice = binancePrices[instrument.symbol];
      if (binancePrice) livePrice = binancePrice;
    }

    if (isTradFi) {
      const yahooQuote = yahooPrices[instrument.symbol];
      const finnhubQuote = finnhubPrices[instrument.symbol];
      const alphaQuote = alphaPrices[instrument.symbol];

      if (yahooQuote) {
        livePrice = yahooQuote.price;
        liveChange = yahooQuote.changePct;
      }

      if (finnhubQuote) {
        livePrice = finnhubQuote.price;
        liveChange = finnhubQuote.changePct;
      }

      if (alphaQuote) {
        livePrice = alphaQuote.price;
        liveChange = alphaQuote.changePct;
      }
    }

    return {
      ...instrument,
      price: livePrice,
      changePct: liveChange,
    };
  });

  const setupScores = mockSetups.map((setup) => ({
    ...setup,
    score: Math.max(45, Math.min(99, setup.score + (setup.assetClass === 'crypto' ? 3 : 0))),
  }));

  return {
    instruments,
    setups: setupScores,
    trades: mockTrades,
    summary: {
      ...defaultSummary,
      avgSetupScore: Math.round(setupScores.reduce((sum, item) => sum + item.score, 0) / setupScores.length),
    },
  };
}
