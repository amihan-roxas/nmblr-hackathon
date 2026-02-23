import { create } from 'zustand';
import type { Category, DashboardStats, DonationItem } from '../types/index.ts';
import { SDG_GOALS, CATEGORIES } from '../types/index.ts';
import { SEED_ITEMS } from '../constants/seed-data.ts';

interface AppState {
  items: DonationItem[];
  categoryFilter: Category | 'All';
  claimModalItemId: string | null;

  addItem: (item: DonationItem) => void;
  claimItem: (id: string, claimedBy: string) => void;
  setCategoryFilter: (filter: Category | 'All') => void;
  openClaimModal: (id: string) => void;
  closeClaimModal: () => void;

  getFilteredItems: () => DonationItem[];
  getItemById: (id: string) => DonationItem | undefined;
  getDashboardStats: () => DashboardStats;
}

export const useAppStore = create<AppState>((set, get) => ({
  items: SEED_ITEMS,
  categoryFilter: 'All',
  claimModalItemId: null,

  addItem: (item) =>
    set((state) => ({ items: [item, ...state.items] })),

  claimItem: (id, claimedBy) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, claimed: true, claimedBy } : item,
      ),
    })),

  setCategoryFilter: (filter) => set({ categoryFilter: filter }),

  openClaimModal: (id) => set({ claimModalItemId: id }),

  closeClaimModal: () => set({ claimModalItemId: null }),

  getFilteredItems: () => {
    const { items, categoryFilter } = get();
    const filtered =
      categoryFilter === 'All'
        ? items
        : items.filter((i) => i.category === categoryFilter);

    return [...filtered].sort((a, b) => {
      if (a.urgent && !b.urgent) return -1;
      if (!a.urgent && b.urgent) return 1;
      return b.createdAt - a.createdAt;
    });
  },

  getItemById: (id) => get().items.find((i) => i.id === id),

  getDashboardStats: () => {
    const { items } = get();
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
  },
}));
