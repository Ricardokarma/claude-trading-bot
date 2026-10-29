import { getMarketSnapshot } from '@/lib/data';

export default async function HeatmapPage() {
  const { setups } = await getMarketSnapshot();

  const cells = Array.from({ length: 100 }, (_, index) => {
    const score = (Math.sin(index + 1) + 1) * 50;
    const opacity = Math.min(1, score / 100);
    const tone = opacity > 0.72 ? 'bg-emerald-500/80' : opacity > 0.45 ? 'bg-amber-500/80' : 'bg-sky-500/80';
    return { index, tone, opacity };
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-sky-400">Market maps</p>
        <h1 className="mt-2 text-3xl font-semibold">Liquidity & liquidation map</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="mb-4 text-lg font-semibold">Heatmap</h2>
          <div className="grid-heatmap">
            {cells.map((cell) => (
              <div key={cell.index} className={`h-7 rounded-md ${cell.tone}`} style={{ opacity: cell.opacity }} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="mb-4 text-lg font-semibold">Top setup context</h2>
          <div className="space-y-4">
            {setups.map((setup) => (
              <div key={setup.symbol} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{setup.symbol}</span>
                  <span className="text-sm text-emerald-300">{setup.score}/100</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{setup.heatmapContext}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
