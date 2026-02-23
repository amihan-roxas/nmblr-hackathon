import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-gray-900">
        Turn Surplus Into{' '}
        <span className="text-emerald-600">Social Impact</span>
      </h1>
      <p className="mt-4 max-w-xl text-lg text-gray-600">
        Connect your unused tech equipment and furniture with schools and
        orphanages that need them most. Every donation drives real progress
        toward the UN Sustainable Development Goals.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          to="/donate"
          className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-700"
        >
          Donate Items
        </Link>
        <Link
          to="/browse"
          className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          Browse Donations
        </Link>
      </div>
    </section>
  );
}
