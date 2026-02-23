import { CATEGORIES } from '../../types/index.ts';
import type { Category } from '../../types/index.ts';
import { useAppStore } from '../../store/index.ts';

const FILTER_OPTIONS: readonly (Category | 'All')[] = ['All', ...CATEGORIES];

export default function CategoryFilter() {
  const categoryFilter = useAppStore((s) => s.categoryFilter);
  const setCategoryFilter = useAppStore((s) => s.setCategoryFilter);

  return (
    <div className="flex gap-2">
      {FILTER_OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => setCategoryFilter(opt)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            categoryFilter === opt
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
