import type { DashboardStats } from '../../types/index.ts';
import { CATEGORIES } from '../../types/index.ts';

interface Props {
  stats: DashboardStats;
}

export default function SdgBreakdown({ stats }: Props) {
  const maxSdg = Math.max(...stats.bySdg.map((s) => s.count), 1);
  const maxCat = Math.max(...CATEGORIES.map((c) => stats.byCategory[c].quantity), 1);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900">SDG Contributions</h2>
        <div className="space-y-3">
          {stats.bySdg.map(({ goal, count, peopleHelped }) => (
            <div key={goal.number}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">
                  SDG {goal.number}: {goal.name}
                </span>
                <span className="text-gray-500">
                  {count} items &middot; {peopleHelped.toLocaleString()} people
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(count / maxSdg) * 100}%`,
                    backgroundColor: goal.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900">By Category</h2>
        <div className="space-y-3">
          {CATEGORIES.map((cat) => (
            <div key={cat}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{cat}</span>
                <span className="text-gray-500">
                  {stats.byCategory[cat].quantity} items &middot; {stats.byCategory[cat].donations} donations
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${(stats.byCategory[cat].quantity / maxCat) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
