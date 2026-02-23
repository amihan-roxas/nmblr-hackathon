import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../types/index.ts';
import type { Category, DonateFormData, ImpactStatement } from '../../types/index.ts';
import { generateImpact } from '../../lib/impact-generator.ts';
import { generateId } from '../../lib/utils.ts';
import { useAppStore } from '../../store/index.ts';
import PhotoUpload from './PhotoUpload.tsx';
import ImpactCard from './ImpactCard.tsx';

export default function DonateForm() {
  const addItem = useAppStore((s) => s.addItem);
  const navigate = useNavigate();

  const [form, setForm] = useState<DonateFormData>({
    name: '',
    quantity: 1,
    category: 'Tech Equipment',
    donorName: '',
    photo: null,
    photoPreview: null,
    urgent: false,
  });

  const impact: ImpactStatement | null =
    form.name.trim() && form.quantity > 0
      ? generateImpact(form.name.trim(), form.quantity, form.category)
      : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.donorName.trim()) return;

    addItem({
      id: generateId(),
      name: form.name.trim(),
      quantity: form.quantity,
      category: form.category,
      donorName: form.donorName.trim(),
      photoUrl: form.photoPreview,
      urgent: form.urgent,
      impact: impact!,
      claimed: false,
      claimedBy: null,
      createdAt: Date.now(),
    });

    navigate('/browse');
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Item Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Laptop, School Desk"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              required
              min={1}
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Math.max(1, Number(e.target.value)) })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Your Name / Org</label>
          <input
            type="text"
            required
            value={form.donorName}
            onChange={(e) => setForm({ ...form, donorName: e.target.value })}
            placeholder="e.g. TechCorp PH"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <PhotoUpload
          preview={form.photoPreview}
          onSelect={(file, dataUrl) => setForm({ ...form, photo: file, photoPreview: dataUrl })}
        />

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.urgent}
            onChange={(e) => setForm({ ...form, urgent: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          Mark as Urgent
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-700 disabled:opacity-50"
          disabled={!form.name.trim() || !form.donorName.trim()}
        >
          Submit Donation
        </button>
      </form>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <ImpactCard impact={impact} />
      </div>
    </div>
  );
}
