import { getMarketSnapshot } from '@/lib/data';

export default async function JournalPage() {
  const { trades } = await getMarketSnapshot();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-sky-400">Execution log</p>
        <h1 className="mt-2 text-3xl font-semibold">Trade journal</h1>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/80 text-slate-300">
            <tr>
              <th className="p-3">Symbol</th>
              <th className="p-3">Direction</th>
              <th className="p-3">Outcome</th>
              <th className="p-3">P&L</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-t border-slate-800">
                <td className="p-3">{trade.symbol}</td>
                <td className="p-3 uppercase">{trade.direction}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${trade.result === 'win' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
                    {trade.result}
                  </span>
                </td>
                <td className={`p-3 ${trade.pnl >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                  {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(1)}%
                </td>
                <td className="p-3">{trade.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
