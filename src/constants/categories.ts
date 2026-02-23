import { SDG_GOALS } from '../types/index.ts';
import type { Category, SdgGoal } from '../types/index.ts';

export const CATEGORY_SDG_MAP: Record<Category, readonly SdgGoal[]> = {
  'Tech Equipment': [
    SDG_GOALS.find((g) => g.number === 4)!,
    SDG_GOALS.find((g) => g.number === 9)!,
    SDG_GOALS.find((g) => g.number === 10)!,
  ],
  Furniture: [
    SDG_GOALS.find((g) => g.number === 4)!,
    SDG_GOALS.find((g) => g.number === 11)!,
    SDG_GOALS.find((g) => g.number === 12)!,
  ],
};

export const IMPACT_TEMPLATES: Record<Category, (name: string, qty: number) => string> = {
  'Tech Equipment': (name, qty) =>
    `Your ${qty} ${name}${qty > 1 ? 's' : ''} could support ${qty * 3} students with digital learning access — bridging the digital divide and fostering innovation in underserved communities.`,
  Furniture: (name, qty) =>
    `Your ${qty} ${name}${qty > 1 ? 's' : ''} could furnish learning spaces for ${qty * 5} children — creating safe, comfortable environments that promote quality education.`,
};
