import { useState } from 'react';
import { useAppStore } from '../../store/index.ts';
import { downloadImpactReport } from '../../lib/pdf-report.ts';

export default function ClaimModal() {
  const claimModalItemId = useAppStore((s) => s.claimModalItemId);
  const getItemById = useAppStore((s) => s.getItemById);
  const closeClaimModal = useAppStore((s) => s.closeClaimModal);
  const claimItem = useAppStore((s) => s.claimItem);

  const [seekerOrg, setSeekerOrg] = useState('');
  const [claimed, setClaimed] = useState(false);

  const item = claimModalItemId ? getItemById(claimModalItemId) : undefined;
  if (!item) return null;

  function handleClaim() {
    if (!seekerOrg.trim() || !item) return;
    claimItem(item.id, seekerOrg.trim());
    setClaimed(true);
  }

  function handleDownload() {
    if (!item) return;
    downloadImpactReport(item, seekerOrg.trim());
  }

  function handleClose() {
    closeClaimModal();
    setSeekerOrg('');
    setClaimed(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-xl font-bold text-gray-900">Claim {item.name}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            &#x2715;
          </button>
        </div>

        <div className="mb-4 space-y-1 text-sm text-gray-600">
          <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
          <p><span className="font-medium">Category:</span> {item.category}</p>
          <p><span className="font-medium">Donor:</span> {item.donorName}</p>
        </div>

        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Impact Statement
          </h3>
          <p className="text-sm leading-relaxed text-gray-700">{item.impact.text}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.impact.sdgs.map((sdg) => (
              <span
                key={sdg.number}
                className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                style={{ backgroundColor: sdg.color }}
              >
                SDG {sdg.number}
              </span>
            ))}
          </div>
        </div>

        {!claimed ? (
          <>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Your Organization Name
              </label>
              <input
                type="text"
                value={seekerOrg}
                onChange={(e) => setSeekerOrg(e.target.value)}
                placeholder="e.g. Hope Academy"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleClaim}
              disabled={!seekerOrg.trim()}
              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              Claim Item
            </button>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-center text-sm font-medium text-emerald-600">
              Item claimed successfully!
            </p>
            <button
              onClick={handleDownload}
              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-700"
            >
              Download Impact Report (PDF)
            </button>
            <button
              onClick={handleClose}
              className="w-full rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
