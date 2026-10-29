import Link from 'next/link';
import { BarChart3, Flame, Heart, LayoutDashboard, NotebookPen } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/heatmap', label: 'Heatmap', icon: Flame },
  { href: '/journal', label: 'Journal', icon: NotebookPen },
];

export function Sidebar() {
  return (
    <aside className="w-full max-w-[270px] border-r border-slate-800 bg-slate-900/80 p-5">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">AI</p>
          <h2 className="text-lg font-semibold">CTB</h2>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-slate-300 transition hover:border-sky-500/30 hover:bg-slate-800/70"
          >
            <Icon className="h-4 w-4 text-sky-400" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
