# Claude Trading Bot

AI-assisted trading workflow for market scanning, favorites, setup ranking, heatmaps, and self-improving analysis.

## Product vision
Claude Trading Bot is designed to help a trader analyze the market, rank the best setups, review liquidity and liquidation zones, and improve the decision process over time without forcing full automation from day one.

The app focuses on:
- market watchlists and favorites
- crypto and TradFi market coverage
- best setup ranking by probability
- liquidation and liquidity heatmap context
- daily learning loop that recalibrates scoring based on real trade outcomes
- human-in-the-loop manual execution

## Core goals
- reduce market decision friction
- centralize trading context in one place
- improve trade quality through ranking and scoring
- learn what setup types work best over time
- provide explanations and risk context before execution

## MVP workflows
1. Market overview
   - all assets view
   - favorites-only view
   - market mood summary

2. Setup ranking
   - probability-based scoring
   - support/resistance and liquidity context
   - entry / stop / target recommendations

3. Heatmap monitoring
   - liquidation map
   - liquidity density
   - support and resistance zones

4. Trade journal
   - record trades and outcomes
   - track win/loss, P&L, setup type
   - review performance by setup

5. Learning loop
   - analyze performance every 24h
   - improve score weights and setup filtering
   - refine ranking continuously

## Stack
- Frontend: Next.js, TypeScript, TailwindCSS
- Backend: Next.js API routes / Node.js services
- Database: PostgreSQL + Prisma
- Cache: Redis (optional for future scaling)
- Public data sources: CoinGecko, Binance public endpoints, Yahoo Finance fallback, Finnhub / Alpha Vantage free tier when keys are available
- AI layer: OpenAI or Anthropic (optional for trade explanation and summarization)

## Free/public data sources
For crypto, use:
- CoinGecko
- Binance public endpoints
- Bybit public endpoints
- OKX public endpoints

For TradFi, use:
- Finnhub free tier
- Alpha Vantage free tier
- Yahoo Finance public fallback endpoints

The architecture is designed so the app degrades gracefully to mock data if free-tier providers are unavailable.

## Environment variables
Create a local `.env.local` file with values similar to:

```env
NEXT_PUBLIC_APP_NAME=Claude Trading Bot
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/claude_trading_bot?schema=public"

FINNHUB_API_KEY=
ALPHA_VANTAGE_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

BINANCE_API_KEY=
BINANCE_SECRET_KEY=
OKX_API_KEY=
OKX_SECRET_KEY=
OKX_PASSPHRASE=
```

## Run locally
```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

## Project status
This repo currently contains:
- product scaffold
- market dashboard
- favorites view
- heatmap view
- trade journal
- setup scoring engine
- daily learning loop
- live-data abstraction layer

This is the MVP foundation for the operational trading decision app.
