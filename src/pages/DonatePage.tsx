import DonateForm from '../components/donate/DonateForm.tsx';

export default function DonatePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Donate Items</h1>
      <DonateForm />
    </main>
  );
}
