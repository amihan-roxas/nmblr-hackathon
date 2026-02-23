interface Props {
  label: string;
  value: number | string;
  color?: string;
  subtitle?: string;
}

export default function StatsCard({ label, value, color = 'text-gray-900', subtitle }: Props) {
  const display = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${color}`}>{display}</p>
      {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
}
