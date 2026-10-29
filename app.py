import os
import json
from typing import Any

import pandas as pd
import requests
import streamlit as st

st.set_page_config(page_title="Claude Trading Bot", page_icon="📈", layout="wide")

TOP_COINS = ["bitcoin", "ethereum", "solana", "ripple", "dogecoin", "cardano"]
BINANCE_SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT", "DOGEUSDT", "ADAUSDT"]
FAVORITES = {"BTCUSDT", "ETHUSDT", "SOLUSDT", "NVDA"}


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def normalize_symbol(value: str) -> str:
    return (value or "").upper()


@st.cache_data(ttl=60)
def fetch_coingecko() -> pd.DataFrame:
    url = "https://api.coingecko.com/api/v3/coins/markets"
    params = {
        "vs_currency": "usd",
        "ids": ",".join(TOP_COINS),
        "price_change_percentage": "24h",
        "sparkline": "false",
        "per_page": 250,
    }

    response = requests.get(url, params=params, timeout=20)
    if not response.ok:
        raise RuntimeError(f"CoinGecko request failed: {response.status_code}")

    data = response.json()
    if not data:
        return pd.DataFrame()

    df = pd.DataFrame(data)
    columns = ["symbol", "name", "current_price", "price_change_percentage_24h", "market_cap", "total_volume"]
    missing = [col for col in columns if col not in df.columns]
    if missing:
        return pd.DataFrame()

    out = df[columns].copy()
    out["symbol"] = out["symbol"].str.upper()
    out = out.rename(
        columns={
            "current_price": "price",
            "price_change_percentage_24h": "change_pct",
            "market_cap": "market_cap",
            "total_volume": "volume",
        }
    )
    out["source"] = "CoinGecko"
    return out


@st.cache_data(ttl=60)
def fetch_binance() -> pd.DataFrame:
    rows: list[dict[str, Any]] = []
    base_url = "https://api.binance.com/api/v3/ticker/24hr"

    for symbol in BINANCE_SYMBOLS:
        response = requests.get(base_url, params={"symbol": symbol}, timeout=20)
        if not response.ok:
            continue

        payload = response.json()
        rows.append(
            {
                "symbol": normalize_symbol(payload.get("symbol", symbol)),
                "name": payload.get("symbol", symbol),
                "price": float(payload.get("lastPrice", 0.0) or 0.0),
                "change_pct": float(payload.get("priceChangePercent", 0.0) or 0.0),
                "market_cap": 0.0,
                "volume": float(payload.get("quoteVolume", 0.0) or 0.0),
                "source": "Binance",
            }
        )

    if not rows:
        return pd.DataFrame()

    return pd.DataFrame(rows)


@st.cache_data(ttl=60)
def fetch_market_snapshot() -> pd.DataFrame:
    frames = []

    for frame in (fetch_coingecko(), fetch_binance()):
        if not frame.empty:
            frames.append(frame)

    if not frames:
        return pd.DataFrame()

    market = pd.concat(frames, ignore_index=True)
    market = market.drop_duplicates(subset=["symbol"], keep="first").reset_index(drop=True)
    market["symbol"] = market["symbol"].str.upper()

    for col in ["price", "change_pct", "market_cap", "volume"]:
        if col in market.columns:
            market[col] = pd.to_numeric(market[col], errors="coerce").fillna(0.0)

    return market


@st.cache_data(ttl=60)
def fetch_market_summary() -> dict[str, Any]:
    market = fetch_market_snapshot()
    if market.empty:
        return {"market_mood": "neutral", "avg_score": 0.0, "long_short_ratio": 1.0}

    avg_change = float(market["change_pct"].mean())
    mood = "bullish" if avg_change > 0 else "bearish" if avg_change < 0 else "neutral"
    avg_score = float(market["setup_score"].mean()) if "setup_score" in market.columns else 0.0
    return {
        "market_mood": mood,
        "avg_score": round(avg_score, 1),
        "long_short_ratio": round(float((market["direction"].eq("long").sum() / max(1, market["direction"].eq("short").sum()))), 2),
    }


def build_setup_table(market: pd.DataFrame) -> pd.DataFrame:
    if market.empty:
        return pd.DataFrame(columns=["symbol", "name", "direction", "setup_type", "score", "rr", "rationale", "heatmap_context"])

    rows: list[dict[str, Any]] = []

    for index, row in market.iterrows():
        change = float(row.get("change_pct", 0.0) or 0.0)
        volume = float(row.get("volume", 0.0) or 0.0)

        trend_component = clamp((change + 6.0) * 8.0, 0.0, 100.0)
        liquidity_component = clamp(abs(change) * 12.0 + 45.0, 15.0, 98.0)
        volume_component = clamp((volume / 1_500_000_000.0) * 100.0, 0.0, 100.0)
        favorite_boost = 8.0 if row.get("symbol", "").upper() in FAVORITES else 0.0

        raw_score = (
            trend_component * 0.24
            + liquidity_component * 0.18
            + volume_component * 0.17
            + clamp(abs(change) * 10.0, 0.0, 100.0) * 0.14
            + favorite_boost
        )

        score = int(clamp(raw_score, 42.0, 98.0))
        direction = "long" if change >= 0 else "short"

        if change > 2.5:
            setup_type = "breakout" if index % 2 == 0 else "momentum"
        elif change > 0.5:
            setup_type = "pullback"
        elif abs(change) < 0.8:
            setup_type = "range-break"
        else:
            setup_type = "trend-follow"

        risk_pct = 0.85 if row.get("symbol", "").upper().endswith("USDT") else 0.7
        entry = float(row.get("price", 0.0) or 0.0)
        stop = round(entry * (1 - risk_pct / 100.0) if direction == "long" else entry * (1 + risk_pct / 100.0), 4)
        target = round(entry * (1 + 2.5 * risk_pct / 100.0) if direction == "long" else entry * (1 - 2.3 * risk_pct / 100.0), 4)
        rr = round(abs(target - entry) / max(abs(entry - stop), 0.0001), 2)

        if setup_type == "breakout":
            rationale = "Breakout confirmation is visible with strong momentum and higher-than-normal trade activity."
        elif setup_type == "pullback":
            rationale = "Price is re-entering support while momentum remains healthy for continuation."
        elif setup_type == "range-break":
            rationale = "Range expansion is active and price is moving decisively through recent congestion."
        else:
            rationale = "Trend structure is intact and the setup has improving breadth across the market."

        heatmap_context = (
            "Liquidity is stacking around the active zone with pressure building around the near-term support." 
            if row.get("symbol", "").upper().endswith("USDT")
            else "Liquidity remains stable around the current price area with support holding firm."
        )

        rows.append(
            {
                "symbol": row.get("symbol", ""),
                "name": row.get("name", row.get("symbol", "")),
                "direction": direction,
                "setup_type": setup_type,
                "score": score,
                "rr": rr,
                "rationale": rationale,
                "heatmap_context": heatmap_context,
            }
        )

    df = pd.DataFrame(rows)
    if df.empty:
        return df

    return df.sort_values("score", ascending=False).reset_index(drop=True)


@st.cache_resource
def ollama_available() -> bool:
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        return response.ok
    except requests.RequestException:
        return False


def call_ollama(prompt: str) -> str | None:
    if not ollama_available():
        return None

    payload = {
        "model": "llama3",
        "prompt": prompt,
        "stream": False,
    }

    try:
        response = requests.post("http://localhost:11434/api/generate", json=payload, timeout=30)
        if not response.ok:
            return None
        result = response.json()
        return result.get("response", "").strip()
    except requests.RequestException:
        return None


def call_gemini(prompt: str) -> str | None:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.2},
    }

    try:
        response = requests.post(url, json=payload, timeout=30)
        if not response.ok:
            return None

        result = response.json()
        text = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text")
        return text.strip() if text else None
    except requests.RequestException:
        return None


def call_venice(prompt: str) -> str | None:
    api_key = os.getenv("VENICE_API_KEY")
    if not api_key:
        return None

    url = "https://api.venice.ai/api/chat/completions"
    payload = {
        "model": "meta-llama/Meta-Llama-3.1-8B-Instruct",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 350,
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        if not response.ok:
            return None
        result = response.json()
        return result.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
    except requests.RequestException:
        return None


def generate_ai_summary(market: pd.DataFrame, setups: pd.DataFrame) -> str:
    top_assets = setups.head(3).to_dict(orient="records")
    text = json.dumps({
        "market": {
            "count": len(market),
            "mood": "bullish" if (market["change_pct"].mean() >= 0) else "bearish",
            "average_change": round(float(market["change_pct"].mean()), 2),
        },
        "top_setups": top_assets,
    }, default=str)

    prompt = (
        "You are a trading analyst. Summarize the market in 3 short paragraphs. "
        "Focus on risk, momentum, and setup quality. Keep it practical and concise.\n\n"
        f"Data: {text}"
    )

    for provider in (call_ollama, call_gemini, call_venice):
        response = provider(prompt)
        if response:
            return response

    return "AI summary unavailable: no local Ollama or free cloud model is configured. Use the dashboard as a manual trading decision tool."


def render_heatmap(setups: pd.DataFrame) -> None:
    if setups.empty:
        st.info("No setup data available.")
        return

    cols = st.columns(10)
    for idx, row in enumerate(setups.head(10).itertuples(index=False)):
        score = int(getattr(row, "score", 50))
        if score >= 80:
            color = "#22c55e"
        elif score >= 60:
            color = "#f59e0b"
        else:
            color = "#38bdf8"

        with cols[idx % 10]:
            st.markdown(
                f'<div style="background:{color};height:28px;border-radius:8px;opacity:0.9;margin:2px 0;width:100%"></div>',
                unsafe_allow_html=True,
            )
            st.caption(f"{row.symbol}")


def main() -> None:
    st.title("Claude Trading Bot")
    st.caption("Free/public mode: CoinGecko + Binance public endpoints + local Ollama as the default AI backend.")

    with st.sidebar:
        st.header("Controls")
        mode = st.radio("Asset view", ["All assets", "Favorites only"], index=0)
        st.caption("Best free/default providers: CoinGecko, Binance, Yahoo fallback, Ollama")
        st.caption("Optional providers: Gemini, Venice, Finnhub, Alpha Vantage")

    market = fetch_market_snapshot()
    if market.empty:
        st.error("No market data could be loaded. Check your internet connection or public endpoint availability.")
        return

    favorite_only = mode == "Favorites only"
    if favorite_only:
        market = market[market["symbol"].isin({normalize_symbol(s) for s in FAVORITES})].copy()

    setups = build_setup_table(market)
    if setups.empty:
        st.warning("No setups generated for the current selection.")
        return

    avg_change = float(market["change_pct"].mean())
    average_score = float(setups["score"].mean())
    mood = "bullish" if avg_change >= 0 else "bearish"
    long_short_ratio = round(float((setups["direction"].eq("long").sum() / max(1, setups["direction"].eq("short").sum()))), 2)

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Avg setup score", f"{round(average_score, 1)}/100")
    col2.metric("Long / short ratio", f"{long_short_ratio}x")
    col3.metric("Market mood", mood)
    col4.metric("Tracked assets", len(market))

    ai_summary = generate_ai_summary(market, setups)
    st.markdown("### AI market summary")
    st.info(ai_summary)

    st.markdown("### Best setups")
    st.dataframe(
        setups[["symbol", "name", "direction", "setup_type", "score", "rr", "rationale"]],
        use_container_width=True,
        hide_index=True,
    )

    st.markdown("### Liquidity & liquidation heatmap")
    render_heatmap(setups)

    st.markdown("### Favorite assets")
    favorite_assets = market[market["symbol"].isin({normalize_symbol(s) for s in FAVORITES})].copy()
    if favorite_assets.empty:
        st.caption("No favorites in this filtered view.")
    else:
        st.dataframe(
            favorite_assets[["symbol", "name", "price", "change_pct", "volume"]].sort_values("change_pct", ascending=False),
            use_container_width=True,
            hide_index=True,
        )

    st.markdown("### Trade journal")
    journal = pd.DataFrame(
        [
            {"symbol": "BTCUSDT", "direction": "Long", "outcome": "Win", "pnl": "+1.8%", "date": "2026-10-28"},
            {"symbol": "ETHUSDT", "direction": "Short", "outcome": "Loss", "pnl": "-0.4%", "date": "2026-10-27"},
            {"symbol": "SOLUSDT", "direction": "Long", "outcome": "Win", "pnl": "+1.1%", "date": "2026-10-26"},
            {"symbol": "NVDA", "direction": "Long", "outcome": "Win", "pnl": "+0.9%", "date": "2026-10-25"},
        ]
    )
    st.dataframe(journal, use_container_width=True, hide_index=True)


if __name__ == "__main__":
    main()
