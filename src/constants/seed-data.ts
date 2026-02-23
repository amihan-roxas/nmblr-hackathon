import type { Category, DonationItem } from '../types/index.ts';
import { SDG_GOALS } from '../types/index.ts';
import seedJson from './seed-data.json';

function findSdg(num: number) {
  return SDG_GOALS.find((g) => g.number === num)!;
}

function mapCategory(cat: string): Category {
  return cat === 'tech' ? 'Tech Equipment' : 'Furniture';
}

const donorMap = new Map(seedJson.donors.map((d) => [d.id, d]));

export const SEED_ITEMS: DonationItem[] = seedJson.items.map((item) => {
  const donor = donorMap.get(item.donor_id)!;
  const category = mapCategory(item.category);
  const sdg = findSdg(item.ai_impact.sdg);

  return {
    id: item.id,
    name: item.title,
    quantity: item.quantity,
    category,
    donorName: donor.name,
    photoUrl: null,
    urgent: item.urgent,
    impact: {
      text: item.ai_impact.impact_statement,
      sdgs: [sdg],
      peopleHelped: item.ai_impact.people_helped,
      estimatedValue: item.ai_impact.estimated_value,
      currency: item.ai_impact.currency,
    },
    claimed: false,
    claimedBy: null,
    createdAt: new Date(item.posted_at).getTime(),
  };
});
