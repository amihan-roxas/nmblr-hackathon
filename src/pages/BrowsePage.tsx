import CategoryFilter from '../components/browse/CategoryFilter.tsx';
import ItemGrid from '../components/browse/ItemGrid.tsx';
import ClaimModal from '../components/claim/ClaimModal.tsx';

export default function BrowsePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Browse Donations</h1>
      <div className="mb-6">
        <CategoryFilter />
      </div>
      <ItemGrid />
      <ClaimModal />
    </main>
  );
}
