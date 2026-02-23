import { useMemo } from 'react';
import { useAppStore } from '../store/index.ts';
import { SDG_GOALS, CATEGORIES } from '../types/index.ts';
import type { DashboardStats } from '../types/index.ts';
import type { Category } from '../types/index.ts';
import StatsCard from '../components/dashboard/StatsCard.tsx';
import SdgBreakdown from '../components/dashboard/SdgBreakdown.tsx';

export default function DashboardPage() {
  const items = useAppStore((s) => s.items);

  const stats: DashboardStats = useMemo(() => {
    const totalDonations = items.length;
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalClaimed = items.filter((i) => i.claimed).reduce((sum, i) => sum + i.quantity, 0);
    const totalAvailable = totalQuantity - totalClaimed;
    const totalUrgent = items.filter((i) => i.urgent && !i.claimed).reduce((sum, i) => sum + i.quantity, 0);
    const totalPeopleHelped = items.reduce((sum, i) => sum + (i.impact.peopleHelped ?? 0), 0);
    const totalEstimatedValue = items.reduce((sum, i) => sum + (i.impact.estimatedValue ?? 0), 0);

    const byCategory = {} as Record<Category, { donations: number; quantity: number }>;
    for (const cat of CATEGORIES) {
      const catItems = items.filter((i) => i.category === cat);
      byCategory[cat] = {
        donations: catItems.length,
        quantity: catItems.reduce((sum, i) => sum + i.quantity, 0),
      };
    }

    const sdgCounts = new Map<number, { count: number; peopleHelped: number }>();
    for (const item of items) {
      for (const sdg of item.impact.sdgs) {
        const prev = sdgCounts.get(sdg.number) ?? { count: 0, peopleHelped: 0 };
        sdgCounts.set(sdg.number, {
          count: prev.count + item.quantity,
          peopleHelped: prev.peopleHelped + (item.impact.peopleHelped ?? 0),
        });
      }
    }

    const bySdg = SDG_GOALS.filter((g) => sdgCounts.has(g.number)).map((goal) => ({
      goal,
      count: sdgCounts.get(goal.number)!.count,
      peopleHelped: sdgCounts.get(goal.number)!.peopleHelped,
    }));

    return { totalDonations, totalQuantity, totalClaimed, totalAvailable, totalUrgent, totalPeopleHelped, totalEstimatedValue, byCategory, bySdg };
  }, [items]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Impact Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatsCard label="Total Items" value={stats.totalQuantity} subtitle={`${stats.totalDonations} donations`} />
        <StatsCard label="Available" value={stats.totalAvailable} color="text-emerald-600" />
        <StatsCard label="Claimed" value={stats.totalClaimed} color="text-blue-600" />
        <StatsCard label="Urgent" value={stats.totalUrgent} color="text-red-600" />
        <StatsCard label="People Helped" value={stats.totalPeopleHelped} color="text-violet-600" />
        <StatsCard label="Estimated Value" value={`PHP ${stats.totalEstimatedValue.toLocaleString()}`} color="text-amber-600" />
      </div>

      <SdgBreakdown stats={stats} />
    </main>
  );
}
