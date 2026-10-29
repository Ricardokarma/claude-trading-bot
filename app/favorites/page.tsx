import { getMarketSnapshot } from '@/lib/data';
import { SetupTable } from '@/components/setup-table';

export default async function FavoritesPage() {
  const { setups, instruments } = await getMarketSnapshot();
  const favorites = instruments.filter((item) => item.favorite);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-sky-400">Favorite assets</p>
        <h1 className="mt-2 text-3xl font-semibold">Favorites</h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {favorites.map((item) => (
          <div key={item.symbol} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-slate-400">{item.assetClass}</p>
                <h3 className="text-lg font-semibold">{item.symbol}</h3>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                {item.changePct > 0 ? '+' : ''}{item.changePct.toFixed(1)}%
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-300">Liquidity score: {item.liquidityScore}/100</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="mb-4 text-xl font-semibold">Favorite setup ranking</h2>
        <SetupTable setups={setups.slice(0, 3)} />
      </div>
    </div>
  );
}
