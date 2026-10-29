export function MetricCard({ label, value, tone }: { label: string; value: string; tone: 'sky' | 'green' | 'amber' | 'slate'; }) {
  const tones = {
    sky: 'border-sky-500/30 bg-sky-500/10 text-sky-100',
    green: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-100',
    slate: 'border-slate-700 bg-slate-800/70 text-slate-100',
  };

  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{label}</p>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </div>
  );
}
