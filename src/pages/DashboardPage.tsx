import { useMemo } from 'react';
import { useAppStore } from '../store/index.ts';
import { SDG_GOALS, CATEGORIES } from '../types/index.ts';
import type { Category, DashboardStats } from '../types/index.ts';
import StatsCard from '../components/dashboard/StatsCard.tsx';
import SdgBreakdown from '../components/dashboard/SdgBreakdown.tsx';

export default function DashboardPage() {
  const items = useAppStore((s) => s.items);

  const stats: DashboardStats = useMemo(() => {
    const totalItems = items.length;
    const totalClaimed = items.filter((i) => i.claimed).length;
    const totalAvailable = totalItems - totalClaimed;
    const totalUrgent = items.filter((i) => i.urgent && !i.claimed).length;

    const byCategory = {} as Record<Category, number>;
    for (const cat of CATEGORIES) {
      byCategory[cat] = items.filter((i) => i.category === cat).length;
    }

    const sdgCounts = new Map<number, number>();
    for (const item of items) {
      for (const sdg of item.impact.sdgs) {
        sdgCounts.set(sdg.number, (sdgCounts.get(sdg.number) ?? 0) + 1);
      }
    }

    const bySdg = SDG_GOALS.filter((g) => sdgCounts.has(g.number)).map((goal) => ({
      goal,
      count: sdgCounts.get(goal.number)!,
    }));

    return { totalItems, totalClaimed, totalAvailable, totalUrgent, byCategory, bySdg };
  }, [items]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Impact Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard label="Total Items" value={stats.totalItems} />
        <StatsCard label="Available" value={stats.totalAvailable} color="text-emerald-600" />
        <StatsCard label="Claimed" value={stats.totalClaimed} color="text-blue-600" />
        <StatsCard label="Urgent" value={stats.totalUrgent} color="text-red-600" />
      </div>

      <SdgBreakdown stats={stats} />
    </main>
  );
}
