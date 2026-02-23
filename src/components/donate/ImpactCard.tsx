import type { ImpactStatement } from '../../types/index.ts';

interface Props {
  impact: ImpactStatement | null;
  loading?: boolean;
}

export default function ImpactCard({ impact, loading }: Props) {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="text-sm font-medium text-emerald-700">Generating AI impact forecast...</p>
        </div>
      </div>
    );
  }

  if (!impact) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-400">
        Start filling out the form to see your AI-generated impact forecast
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-700">
        AI Impact Forecast
      </h3>
      <p className="text-gray-700 leading-relaxed">{impact.text}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {impact.sdgs.map((sdg) => (
          <span
            key={sdg.number}
            className="rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: sdg.color }}
          >
            SDG {sdg.number}: {sdg.name}
          </span>
        ))}
      </div>
    </div>
  );
}
