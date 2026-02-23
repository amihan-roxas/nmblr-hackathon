import { useMemo } from 'react';
import { useAppStore } from '../../store/index.ts';
import ItemCard from './ItemCard.tsx';

export default function ItemGrid() {
  const items = useAppStore((s) => s.items);
  const categoryFilter = useAppStore((s) => s.categoryFilter);

  const filtered = useMemo(() => {
    const list =
      categoryFilter === 'All'
        ? items
        : items.filter((i) => i.category === categoryFilter);

    return [...list].sort((a, b) => {
      if (a.urgent && !b.urgent) return -1;
      if (!a.urgent && b.urgent) return 1;
      return b.createdAt - a.createdAt;
    });
  }, [items, categoryFilter]);

  if (filtered.length === 0) {
    return (
      <p className="py-16 text-center text-gray-400">
        No items found. Be the first to donate!
      </p>
    );
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {filtered.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
