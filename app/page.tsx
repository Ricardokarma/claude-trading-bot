import { getMarketSnapshot } from '@/lib/data';
import { MetricCard } from '@/components/metric-card';
import { SetupTable } from '@/components/setup-table';

export default async function HomePage() {
  const { summary, setups, instruments } = await getMarketSnapshot();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-400">Trading Ops</p>
          <h1 className="mt-2 text-3xl font-semibold">Claude Trading Bot</h1>
        </div>
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-sm text-sky-200">
          Market mood: <span className="font-semibold">{summary.marketMood}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Average setup score" value={`${summary.avgSetupScore}/100`} tone="sky" />
        <MetricCard label="Long / short ratio" value={`${summary.longShortRatio.toFixed(2)}x`} tone="green" />
        <MetricCard label="Liquidations" value={`${summary.liquidations}`} tone="amber" />
        <MetricCard label="Tracked assets" value={`${instruments.length}`} tone="slate" />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-glow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Best setups</h2>
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
            Auto ranked by probability
          </span>
        </div>
        <SetupTable setups={setups} />
      </div>
    </div>
  );
}
