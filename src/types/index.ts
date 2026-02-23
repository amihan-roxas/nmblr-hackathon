export const CATEGORIES = ['Tech Equipment', 'Furniture'] as const;
export type Category = (typeof CATEGORIES)[number];

export const SDG_GOALS = [
  { number: 1, name: 'No Poverty', color: '#E5243B' },
  { number: 2, name: 'Zero Hunger', color: '#DDA63A' },
  { number: 3, name: 'Good Health and Well-being', color: '#4C9F38' },
  { number: 4, name: 'Quality Education', color: '#C5192D' },
  { number: 5, name: 'Gender Equality', color: '#FF3A21' },
  { number: 8, name: 'Decent Work and Economic Growth', color: '#A21942' },
  { number: 9, name: 'Industry, Innovation and Infrastructure', color: '#FD6925' },
  { number: 10, name: 'Reduced Inequalities', color: '#DD1367' },
  { number: 11, name: 'Sustainable Cities and Communities', color: '#FD9D24' },
  { number: 12, name: 'Responsible Consumption and Production', color: '#BF8B2E' },
  { number: 17, name: 'Partnerships for the Goals', color: '#19486A' },
] as const;

export type SdgGoal = (typeof SDG_GOALS)[number];

export interface ImpactStatement {
  text: string;
  sdgs: readonly SdgGoal[];
  peopleHelped?: number;
  estimatedValue?: number;
  currency?: string;
}

export interface DonationItem {
  id: string;
  name: string;
  quantity: number;
  category: Category;
  donorName: string;
  photoUrl: string | null;
  urgent: boolean;
  impact: ImpactStatement;
  claimed: boolean;
  claimedBy: string | null;
  createdAt: number;
}

export interface DonateFormData {
  name: string;
  quantity: number;
  category: Category;
  donorName: string;
  photo: File | null;
  photoPreview: string | null;
  urgent: boolean;
}

export interface DashboardStats {
  totalItems: number;
  totalClaimed: number;
  totalAvailable: number;
  totalUrgent: number;
  byCategory: Record<Category, number>;
  bySdg: { goal: SdgGoal; count: number }[];
}
