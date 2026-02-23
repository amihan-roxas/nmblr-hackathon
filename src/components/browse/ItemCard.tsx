import type { DonationItem } from '../../types/index.ts';
import { useAppStore } from '../../store/index.ts';

interface Props {
  item: DonationItem;
}

export default function ItemCard({ item }: Props) {
  const openClaimModal = useAppStore((s) => s.openClaimModal);

  return (
    <div
      className={`mb-4 break-inside-avoid overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
        item.urgent && !item.claimed ? 'animate-pulse border-red-400' : 'border-gray-200'
      }`}
    >
      {item.photoUrl && (
        <img src={item.photoUrl} alt={item.name} className="h-40 w-full object-cover" />
      )}

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          {item.urgent && !item.claimed && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
              Urgent
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
        <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          {item.category}
        </span>
        <p className="mt-1 text-xs text-gray-400">by {item.donorName}</p>

        {item.claimed ? (
          <div className="mt-3 rounded-lg bg-gray-100 py-2 text-center text-sm font-medium text-gray-500">
            Claimed by {item.claimedBy}
          </div>
        ) : (
          <button
            onClick={() => openClaimModal(item.id)}
            className="mt-3 w-full rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Claim
          </button>
        )}
      </div>
    </div>
  );
}
