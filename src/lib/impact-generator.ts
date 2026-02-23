import { CATEGORY_SDG_MAP } from '../constants/categories.ts';
import type { Category, ImpactStatement } from '../types/index.ts';

export async function generateImpact(
  name: string,
  quantity: number,
  category: Category,
): Promise<ImpactStatement> {
  const sdgs = CATEGORY_SDG_MAP[category];
  const isTech = category === 'Tech Equipment';
  const peopleHelped = isTech ? quantity * 3 : quantity * 5;
  const estimatedValue = isTech ? quantity * 5000 : quantity * 2000;

  const sdgNames = sdgs.map((s) => `SDG ${s.number}: ${s.name}`).join(', ');

  const regions = [
    'Mindanao (Zamboanga, Davao, Cotabato)',
    'Visayas (Cebu, Leyte, Samar)',
    'rural Luzon (Aurora, Quirino, Kalinga)',
    'Metro Manila urban poor communities (Tondo, Smokey Mountain, Baseco)',
    'island municipalities in Palawan and Romblon',
  ];
  const beneficiaries = isTech
    ? [
        'out-of-school youth learning basic digital skills',
        'public school students without computer lab access',
        'young women in STEM training programs',
        'community health workers needing digital tools',
        'indigenous Lumad and Mangyan learners in ALS programs',
      ]
    : [
        'orphaned and abandoned children in shelters',
        'daycare centers in informal settler communities',
        'barangay learning hubs serving working parents',
        'feeding program sites for malnourished children',
        'indigenous Peoples schools in remote highlands',
      ];

  const region = regions[Math.floor(Math.random() * regions.length)];
  const group = beneficiaries[Math.floor(Math.random() * beneficiaries.length)];

  const prompt = [
    `You are an impact analyst for a donation platform that connects surplus items to schools and orphanages in the Philippines.`,
    ``,
    `A donor is giving: ${quantity}x ${name} (category: ${category}).`,
    `Estimated people helped: ${peopleHelped}. Estimated value: PHP ${estimatedValue.toLocaleString()}.`,
    `Relevant UN SDGs: ${sdgNames}.`,
    `Target region: ${region}.`,
    `Primary beneficiaries: ${group}.`,
    ``,
    `Write a 2-3 sentence impact forecast for this donation. Mention the specific region and beneficiary group.`,
    `Be specific about how it helps these communities. Reference the SDGs naturally. Be warm but concise.`,
    `Do not use bullet points or headers — just flowing text.`,
  ].join('\n');

  try {
    const res = await fetch('/api/generate-impact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) throw new Error('API request failed');

    const data = await res.json();
    return {
      text: data.text,
      sdgs,
      peopleHelped,
      estimatedValue,
      currency: 'PHP',
    };
  } catch {
    // Fallback to a simple template if the API call fails
    const fallback = isTech
      ? `Your ${quantity} ${name} could support ${peopleHelped} students with digital learning access — bridging the digital divide and fostering innovation in underserved communities.`
      : `Your ${quantity} ${name} could furnish learning spaces for ${peopleHelped} children — creating safe, comfortable environments that promote quality education.`;
    return {
      text: fallback,
      sdgs,
      peopleHelped,
      estimatedValue,
      currency: 'PHP',
    };
  }
}
