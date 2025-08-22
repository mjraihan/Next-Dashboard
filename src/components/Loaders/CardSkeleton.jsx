"use client";

export default function CardSkeleton() {
  return (
    <div className="card bg-base-100 border border-base-200 rounded-xl shadow-sm">
      <div className="px-4 pt-6 bg-zinc-800 rounded-xl flex items-center justify-center h-40">
        <div className="skeleton w-24 h-24 rounded-lg" />
      </div>
      <div className="card-body p-4">
        <div className="skeleton h-5 w-3/4 mb-2 rounded" />
        <div className="skeleton h-6 w-1/2 mb-2 rounded" />
        <div className="flex gap-2 mb-2">
          <div className="skeleton h-4 w-1/3 rounded" />
          <div className="skeleton h-4 w-1/3 rounded" />
        </div>
        <div className="skeleton h-8 w-full mt-3 rounded" />
      </div>
    </div>
  );
}
