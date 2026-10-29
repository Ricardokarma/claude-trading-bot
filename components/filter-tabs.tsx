import Link from 'next/link';

const tabs = [
  { key: 'all', label: 'All assets' },
  { key: 'favorites', label: 'Favorites' },
] as const;

export function FilterTabs({ activeMode }: { activeMode: 'all' | 'favorites' }) {
  return (
    <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900/70 p-1">
      {tabs.map((tab) => {
        const isActive = activeMode === tab.key;

        return (
          <Link
            key={tab.key}
            href={tab.key === 'all' ? '/' : '/?mode=favorites'}
            className={[
              'rounded-lg px-4 py-2 text-sm transition',
              isActive
                ? 'bg-sky-500 text-slate-950 shadow-glow'
                : 'text-slate-300 hover:bg-slate-800/80',
            ].join(' ')}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
