import { getMarketSnapshot } from '@/lib/data';
import { MetricCard } from '@/components/metric-card';
import { SetupTable } from '@/components/setup-table';
import { FilterTabs } from '@/components/filter-tabs';

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { mode?: string };
}) {
  const mode = searchParams?.mode === 'favorites' ? 'favorites' : 'all';
  const { summary, setups, instruments } = await getMarketSnapshot(mode);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-400">Trading Ops</p>
          <h1 className="mt-2 text-3xl font-semibold">Claude Trading Bot</h1>
        </div>
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-sm text-sky-200">
          Market mood: <span className="font-semibold">{summary.marketMood}</span>
        </div>
      </div>

      <FilterTabs activeMode={mode} />

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
            {mode === 'favorites' ? 'Favorite universe' : 'All assets'}
          </span>
        </div>
        <SetupTable setups={setups} />
      </div>
    </div>
  );
}
