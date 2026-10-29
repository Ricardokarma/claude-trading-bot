import { SetupScore } from '@/lib/types';

export function SetupTable({ setups }: { setups: SetupScore[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-slate-400">
          <tr>
            <th className="p-3">Symbol</th>
            <th className="p-3">Type</th>
            <th className="p-3">Direction</th>
            <th className="p-3">Score</th>
            <th className="p-3">RR</th>
            <th className="p-3">Rationale</th>
          </tr>
        </thead>
        <tbody>
          {setups.map((setup) => (
            <tr key={`${setup.symbol}-${setup.setupType}`} className="border-t border-slate-800 text-slate-200">
              <td className="p-3 font-medium">{setup.symbol}</td>
              <td className="p-3 uppercase">{setup.setupType}</td>
              <td className="p-3 uppercase text-emerald-300">{setup.direction}</td>
              <td className="p-3">
                <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-sky-200">{setup.score}</span>
              </td>
              <td className="p-3">{setup.rr.toFixed(1)}x</td>
              <td className="p-3 max-w-lg text-slate-300">{setup.rationale}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
