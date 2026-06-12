export default function ProductCardSkeleton({ dark = false }) {
  const bg = dark ? 'bg-white/5' : 'bg-white';
  return (
    <div className={`rounded-xl overflow-hidden border ${dark ? 'border-white/8' : 'border-mist'} ${bg}`}>
      <div className="skeleton h-60 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="skeleton h-7 w-20 rounded" />
          <div className="skeleton h-9 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}
