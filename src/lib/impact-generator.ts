import { CATEGORY_SDG_MAP, IMPACT_TEMPLATES } from '../constants/categories.ts';
import type { Category, ImpactStatement } from '../types/index.ts';

export function generateImpact(
  name: string,
  quantity: number,
  category: Category,
): ImpactStatement {
  const sdgs = CATEGORY_SDG_MAP[category];
  const text = IMPACT_TEMPLATES[category](name, quantity);
  const isTech = category === 'Tech Equipment';
  return {
    text,
    sdgs,
    peopleHelped: isTech ? quantity * 3 : quantity * 5,
    estimatedValue: isTech ? quantity * 5000 : quantity * 2000,
    currency: 'PHP',
  };
}
