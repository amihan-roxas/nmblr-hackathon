interface Props {
  label: string;
  value: number;
  color?: string;
}

export default function StatsCard({ label, value, color = 'text-gray-900' }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
